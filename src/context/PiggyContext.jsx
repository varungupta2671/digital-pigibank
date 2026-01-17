import { createContext, useContext, useState, useEffect } from 'react';
import { db, STORES_CONSTANTS } from '../utils/db';

const PiggyContext = createContext();

export function usePiggy() {
    return useContext(PiggyContext);
}

export function PiggyProvider({ children }) {
    // State
    const [goals, setGoals] = useState([]);
    const [activeGoalId, setActiveGoalId] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    // Derived State: Active Goal & Plan
    const activeGoal = goals.find(g => g.id === activeGoalId) || null;
    const savingsPlan = activeGoal ? activeGoal.savingsPlan : [];

    // Initialization & Migration
    useEffect(() => {
        const init = async () => {
            try {
                // Load Data from IDB
                const dbGoals = await db.getAll(STORES_CONSTANTS.GOALS);
                const dbAccounts = await db.getAll(STORES_CONSTANTS.ACCOUNTS);
                const dbTransactions = await db.getAll(STORES_CONSTANTS.TRANSACTIONS);
                const activeId = await db.get(STORES_CONSTANTS.META, 'activeGoalId');

                // MIGRATION CHECK: If IDB empty but LocalStorage has data
                const lsGoal = localStorage.getItem('piggy_goal');
                if (dbGoals.length === 0 && lsGoal) {
                    console.log("Migrating from LocalStorage to IndexedDB...");
                    const oldGoal = JSON.parse(lsGoal);
                    const oldPlan = JSON.parse(localStorage.getItem('piggy_plan') || '[]');
                    const oldAccounts = JSON.parse(localStorage.getItem('piggy_accounts') || '[]');
                    const oldTransactions = JSON.parse(localStorage.getItem('piggy_transactions') || '[]');

                    // Wrap in new structure
                    const migratedGoal = {
                        ...oldGoal,
                        name: "My First Goal", // Default name for migrated goal
                        savingsPlan: oldPlan
                    };

                    // Save to IDB
                    await db.set(STORES_CONSTANTS.GOALS, migratedGoal);
                    await db.setAll(STORES_CONSTANTS.ACCOUNTS, oldAccounts);
                    await db.setAll(STORES_CONSTANTS.TRANSACTIONS, oldTransactions);
                    await db.set(STORES_CONSTANTS.META, migratedGoal.id, 'activeGoalId');

                    // Update State
                    setGoals([migratedGoal]);
                    setAccounts(oldAccounts);
                    setTransactions(oldTransactions);
                    setActiveGoalId(migratedGoal.id);

                    // Cleanup LocalStorage
                    localStorage.removeItem('piggy_goal');
                    localStorage.removeItem('piggy_plan');
                    localStorage.removeItem('piggy_accounts');
                    localStorage.removeItem('piggy_transactions');

                } else {
                    // Normal Load
                    setGoals(dbGoals);
                    setAccounts(dbAccounts);
                    setTransactions(dbTransactions);
                    setActiveGoalId(activeId || (dbGoals.length > 0 ? dbGoals[0].id : null));
                }
            } catch (error) {
                console.error("Failed to initialize DB:", error);
            } finally {
                setIsLoading(false);
            }
        };

        init();
    }, []);

    // Helper to persist Goal updates efficiently
    const saveGoal = async (updatedGoal) => {
        setGoals(prev => prev.map(g => g.id === updatedGoal.id ? updatedGoal : g));
        await db.set(STORES_CONSTANTS.GOALS, updatedGoal);
    };

    // Actions
    const startEditing = () => setIsEditing(true);
    const cancelEditing = () => setIsEditing(false);

    const createGoal = async (name, amount, slots, frequency, durationValue, durationUnit) => {
        const newId = Date.now();
        const plan = generatePlanLogic(amount, slots, frequency);

        const newGoal = {
            id: newId,
            name: name || `Goal ${goals.length + 1}`,
            targetAmount: parseFloat(amount),
            totalSlots: parseInt(slots),
            frequency: frequency,
            durationValue: durationValue,
            durationUnit: durationUnit,
            createdAt: new Date().toISOString(),
            status: 'active',
            savingsPlan: plan
        };

        const updatedGoals = [...goals, newGoal];
        setGoals(updatedGoals);
        setActiveGoalId(newId);
        setIsEditing(false);

        await db.set(STORES_CONSTANTS.GOALS, newGoal);
        await db.set(STORES_CONSTANTS.META, newId, 'activeGoalId');
    };

    // Extracted logic for plan generation to be reused
    const generatePlanLogic = (amount, slots, frequency) => {
        const dayMs = 86400000;
        let interval = dayMs;
        if (frequency === 'weekly') interval = dayMs * 7;
        if (frequency === 'monthly') interval = dayMs * 30;
        if (frequency === 'yearly') interval = dayMs * 365;

        let minAmount = 50;
        const avgSlotAmount = amount / slots;
        let chunks = [50, 100, 200, 500];

        if (avgSlotAmount > 50000) { minAmount = 5000; chunks = [5000, 10000, 20000, 50000]; }
        else if (avgSlotAmount > 5000) { minAmount = 500; chunks = [500, 1000, 2000, 5000]; }
        else if (avgSlotAmount > 500) { minAmount = 100; chunks = [100, 200, 500, 1000]; }

        const plan = [];
        if (amount < minAmount * slots) {
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
            return plan;
        }

        const rawPlan = new Array(parseInt(slots)).fill(minAmount);
        let remaining = amount - (minAmount * slots);
        while (remaining >= minAmount) {
            const slotIdx = Math.floor(Math.random() * slots);
            let chunk = chunks[0];
            const r = Math.random();
            if (remaining >= chunks[3] && r > 0.9) chunk = chunks[3];
            else if (remaining >= chunks[2] && r > 0.7) chunk = chunks[2];
            else if (remaining >= chunks[1] && r > 0.4) chunk = chunks[1];

            rawPlan[slotIdx] += chunk;
            remaining -= chunk;
        }
        if (remaining > 0) rawPlan[Math.floor(Math.random() * slots)] += remaining;

        for (let i = 0; i < slots; i++) {
            plan.push({
                id: `bit-${Date.now()}-${i}`,
                index: i + 1,
                amount: rawPlan[i],
                status: 'pending',
                dueDate: new Date(Date.now() + i * interval).toISOString()
            });
        }
        // Shuffle
        for (let i = plan.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [plan[i], plan[j]] = [plan[j], plan[i]];
        }
        return plan;
    };

    const updateGoal = async (updatedGoalData) => {
        // For editing goal settings
        // This effectively resets the plan if amounts change - simplistic approach for now as per v4
        // If we want to support 'smart update', logic would be complex. 
        // Assuming 'Update' button in UI triggers a re-generation or overwrite
        await createGoal(
            updatedGoalData.name || activeGoal.name,
            updatedGoalData.amount,
            updatedGoalData.slots,
            updatedGoalData.frequency,
            updatedGoalData.durationValue,
            updatedGoalData.durationUnit
        );
    };

    const switchGoal = async (goalId) => {
        setActiveGoalId(goalId);
        await db.set(STORES_CONSTANTS.META, goalId, 'activeGoalId');
    };

    const addAccount = async (upiId, name) => {
        const newAccount = { id: Date.now(), upiId, name };
        setAccounts(prev => [...prev, newAccount]);
        await db.set(STORES_CONSTANTS.ACCOUNTS, newAccount);
    };

    const deleteAccount = async (accountId) => {
        setAccounts(prev => prev.filter(a => a.id !== accountId));
        await db.delete(STORES_CONSTANTS.ACCOUNTS, accountId);
    };

    const makePayment = async (bitId, accountId) => {
        if (!activeGoal) return;

        const updatedPlan = savingsPlan.map(bit =>
            bit.id === bitId ? { ...bit, status: 'paid', paidAt: new Date().toISOString(), paidBy: accountId } : bit
        );

        const updatedGoal = { ...activeGoal, savingsPlan: updatedPlan };
        saveGoal(updatedGoal);

        const bit = savingsPlan.find(b => b.id === bitId);
        if (bit) {
            const newTx = {
                id: Date.now(),
                amount: bit.amount,
                type: 'debit',
                accountId: accountId,
                description: `Saved ₹${bit.amount} for ${activeGoal.name}`,
                date: new Date().toISOString()
            };
            setTransactions(prev => [...prev, newTx]);
            await db.set(STORES_CONSTANTS.TRANSACTIONS, newTx);
        }
    };

    const resetGoal = async () => {
        if (!activeGoalId) return;
        // Delete current goal
        const remainingGoals = goals.filter(g => g.id !== activeGoalId);
        await db.delete(STORES_CONSTANTS.GOALS, activeGoalId);

        setGoals(remainingGoals);
        if (remainingGoals.length > 0) {
            switchGoal(remainingGoals[0].id);
        } else {
            setActiveGoalId(null);
            await db.delete(STORES_CONSTANTS.META, 'activeGoalId');
        }
    };

    const value = {
        goals,
        goal: activeGoal, // Expose as 'goal' for backward compatibility with components
        savingsPlan,
        accounts,
        transactions,
        isLoading,
        createGoal,
        updateGoal,
        switchGoal,
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
