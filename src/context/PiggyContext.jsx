import { createContext, useContext, useState, useEffect } from 'react';

const PiggyContext = createContext();

export function usePiggy() {
    return useContext(PiggyContext);
}

export function PiggyProvider({ children }) {
    const [goal, setGoal] = useState(() => {
        const saved = localStorage.getItem('piggy_goal');
        return saved ? JSON.parse(saved) : null;
    });

    const [savingsPlan, setSavingsPlan] = useState(() => {
        const saved = localStorage.getItem('piggy_plan');
        return saved ? JSON.parse(saved) : [];
    });

    const [accounts, setAccounts] = useState(() => {
        const saved = localStorage.getItem('piggy_accounts');
        return saved ? JSON.parse(saved) : [];
    });

    const [transactions, setTransactions] = useState(() => {
        const saved = localStorage.getItem('piggy_transactions');
        return saved ? JSON.parse(saved) : [];
    });

    // Persist to local storage
    useEffect(() => {
        localStorage.setItem('piggy_goal', JSON.stringify(goal));
    }, [goal]);

    useEffect(() => {
        localStorage.setItem('piggy_plan', JSON.stringify(savingsPlan));
    }, [savingsPlan]);

    useEffect(() => {
        localStorage.setItem('piggy_accounts', JSON.stringify(accounts));
    }, [accounts]);

    useEffect(() => {
        localStorage.setItem('piggy_transactions', JSON.stringify(transactions));
    }, [transactions]);

    // Edit State
    const [isEditing, setIsEditing] = useState(false);

    // Actions
    const startEditing = () => setIsEditing(true);
    const cancelEditing = () => setIsEditing(false);

    const createGoal = (amount, slots, frequency, durationValue, durationUnit) => {
        const newGoal = {
            id: Date.now(),
            targetAmount: parseFloat(amount),
            totalSlots: parseInt(slots),
            frequency: frequency, // 'daily', 'weekly', 'monthly'
            durationValue: durationValue,
            durationUnit: durationUnit,
            createdAt: new Date().toISOString(),
            status: 'active'
        };
        setGoal(newGoal);
        generatePlan(amount, slots, frequency);
        setIsEditing(false);
    };

    const generatePlan = (amount, slots, frequency) => {
        // Calculate interval in milliseconds
        const dayMs = 86400000;
        let interval = dayMs;
        if (frequency === 'weekly') interval = dayMs * 7;
        if (frequency === 'monthly') interval = dayMs * 30;
        if (frequency === 'yearly') interval = dayMs * 365;

        // Base minimum per slot
        let minAmount = 50;

        // Dynamic Chunking Logic
        // Determine the scale of collection based on average slot amount
        const avgSlotAmount = amount / slots;
        let chunks = [50, 100, 200, 500];

        // If average amount is large, scale up the chunks
        if (avgSlotAmount > 50000) {
            minAmount = 5000;
            chunks = [5000, 10000, 20000, 50000];
        } else if (avgSlotAmount > 5000) {
            minAmount = 500;
            chunks = [500, 1000, 2000, 5000];
        } else if (avgSlotAmount > 500) {
            minAmount = 100;
            chunks = [100, 200, 500, 1000];
        }

        const plan = [];

        // Validation: If amount is too small for slots
        if (amount < minAmount * slots) {
            // Fallback: Just divide evenly if constraints can't be met
            const bitAmount = Math.floor(amount / slots);
            let rem = amount - (bitAmount * slots);
            for (let i = 0; i < slots; i++) {
                plan.push({
                    id: `bit-${Date.now()}-${i}`,
                    index: i + 1,
                    amount: i < rem ? bitAmount + 1 : bitAmount,
                    status: 'pending',
                    dueDate: new Date(Date.now() + i * interval).toISOString()
                });
            }
            setSavingsPlan(plan);
            return;
        }

        // 1. Initialize all slots with minimum
        const rawPlan = new Array(parseInt(slots)).fill(minAmount);
        let remaining = amount - (minAmount * slots);

        // 2. Distribute remaining amount in random chunks
        while (remaining >= minAmount) {
            // Pick a random slot
            const slotIdx = Math.floor(Math.random() * slots);

            // Pick a random chunk size
            let chunk = chunks[0];
            const r = Math.random();

            // Weighted selection of chunks
            if (remaining >= chunks[3] && r > 0.9) chunk = chunks[3];
            else if (remaining >= chunks[2] && r > 0.7) chunk = chunks[2];
            else if (remaining >= chunks[1] && r > 0.4) chunk = chunks[1];

            // Apply chunk
            rawPlan[slotIdx] += chunk;
            remaining -= chunk;
        }

        // 3. Distribute any tiny remainder
        if (remaining > 0) {
            const slotIdx = Math.floor(Math.random() * slots);
            rawPlan[slotIdx] += remaining;
        }

        // 4. Create final plan objects
        for (let i = 0; i < slots; i++) {
            plan.push({
                id: `bit-${Date.now()}-${i}`,
                index: i + 1,
                amount: rawPlan[i],
                status: 'pending',
                dueDate: new Date(Date.now() + i * interval).toISOString()
            });
        }

        // Shuffle the plan so large/small amounts are mixed (except the last fix-up one, which we should mix in too)
        // Fisher-Yates shuffle
        for (let i = plan.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [plan[i], plan[j]] = [plan[j], plan[i]];
        }

        setSavingsPlan(plan);
    };

    const addAccount = (upiId, name) => {
        setAccounts([...accounts, { id: Date.now(), upiId, name }]);
    };

    const deleteAccount = (accountId) => {
        setAccounts(accounts.filter(a => a.id !== accountId));
    };

    const makePayment = (bitId, accountId) => {
        setSavingsPlan(prev => prev.map(bit =>
            bit.id === bitId ? { ...bit, status: 'paid', paidAt: new Date().toISOString(), paidBy: accountId } : bit
        ));

        // Record transaction
        const bit = savingsPlan.find(b => b.id === bitId);
        const account = accounts.find(a => a.id === accountId);
        if (bit && account) {
            setTransactions([...transactions, {
                id: Date.now(),
                amount: bit.amount,
                type: 'debit',
                accountId: accountId,
                description: `Saved ₹${bit.amount}`,
                date: new Date().toISOString()
            }]);
        }
    };

    const resetGoal = () => {
        setGoal(null);
        setSavingsPlan([]);
        setTransactions([]);
    };

    const value = {
        goal,
        savingsPlan,
        accounts,
        transactions,
        createGoal,
        addAccount,
        deleteAccount,
        makePayment,
        resetGoal,
        isEditing,
        startEditing,
        cancelEditing
    };

    return (
        <PiggyContext.Provider value={value}>
            {children}
        </PiggyContext.Provider>
    );
}
