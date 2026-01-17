import { useState, useEffect } from 'react';
import { usePiggy } from '../context/PiggyContext';
import { Target, Calendar, ArrowRight, Clock, X, Type } from 'lucide-react';

export default function GoalForm() {
    const { createGoal, goal, isEditing, cancelEditing } = usePiggy();

    // Form State
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');

    // Duration State
    const [durationValue, setDurationValue] = useState('1');
    const [durationUnit, setDurationUnit] = useState('months');
    const [frequency, setFrequency] = useState('daily');

    const [estimatedSlots, setEstimatedSlots] = useState(0);

    // Pre-fill if editing
    useEffect(() => {
        if (isEditing && goal) {
            setName(goal.name || '');
            setAmount(goal.targetAmount);
            setFrequency(goal.frequency);
            if (goal.durationValue) setDurationValue(goal.durationValue);
            if (goal.durationUnit) setDurationUnit(goal.durationUnit);
        } else if (!isEditing) {
            setName('');
            setAmount('');
            setDurationValue('1');
            setDurationUnit('months');
            setFrequency('daily');
        }
    }, [isEditing, goal]);

    // Calculate slots whenever inputs change
    useEffect(() => {
        if (!durationValue) {
            setEstimatedSlots(0);
            return;
        }

        const val = parseInt(durationValue);
        let days = 0;

        switch (durationUnit) {
            case 'days': days = val; break;
            case 'weeks': days = val * 7; break;
            case 'months': days = val * 30; break;
            case 'years': days = val * 365; break;
            default: days = val;
        }

        let interval = 1;
        switch (frequency) {
            case 'daily': interval = 1; break;
            case 'weekly': interval = 7; break;
            case 'monthly': interval = 30; break;
            case 'yearly': interval = 365; break;
            default: interval = 1;
        }

        const slots = Math.ceil(days / interval);
        setEstimatedSlots(slots > 0 ? slots : 0);

    }, [durationValue, durationUnit, frequency]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!amount || estimatedSlots <= 0) return;
        createGoal(name, amount, estimatedSlots, frequency, durationValue, durationUnit);
    };

    return (
        <div className="w-full max-w-md mx-auto p-6 bg-[#2C1810] rounded-3xl border-4 border-[#CDA434] shadow-2xl animate-fade-in relative font-['Courier Prime']">
            {/* decorative corners */}
            <div className="absolute top-2 left-2 w-2 h-2 bg-[#CDA434] rounded-full"></div>
            <div className="absolute top-2 right-2 w-2 h-2 bg-[#CDA434] rounded-full"></div>
            <div className="absolute bottom-2 left-2 w-2 h-2 bg-[#CDA434] rounded-full"></div>
            <div className="absolute bottom-2 right-2 w-2 h-2 bg-[#CDA434] rounded-full"></div>

            {isEditing && (
                <button
                    onClick={cancelEditing}
                    className="absolute top-4 right-4 p-2 text-[#E8DCC4] hover:text-[#CDA434] bg-[#4E342E] rounded-full transition-colors border border-[#5D4037]"
                >
                    <X className="w-4 h-4" />
                </button>
            )}

            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-[#CDA434] font-['Righteous'] uppercase tracking-wider mb-2 drop-shadow-md">
                    {isEditing ? 'MODIFY TARGET' : 'NEW MISSION'}
                </h2>
                <div className="h-1 w-24 mx-auto bg-[#5D4037] rounded-full"></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

                <div className="space-y-2">
                    <label className="text-xs font-bold text-[#8D6E63] uppercase tracking-widest flex items-center gap-2">
                        <Type className="w-4 h-4 text-[#CDA434]" />
                        Mission Name
                    </label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-[#1A1A1A] border-2 border-[#5D4037] rounded-xl py-4 px-4 text-[#4ADE80] font-['VT323'] text-2xl placeholder:text-[#333] focus:outline-none focus:border-[#CDA434] transition-all"
                        placeholder="e.g. Dream Car"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-[#8D6E63] uppercase tracking-widest flex items-center gap-2">
                        <Target className="w-4 h-4 text-[#CDA434]" />
                        Target Amount
                    </label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#555] font-bold">₹</span>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full bg-[#1A1A1A] border-2 border-[#5D4037] rounded-xl py-4 pl-10 pr-4 text-[#4ADE80] font-['VT323'] text-2xl placeholder:text-[#333] focus:outline-none focus:border-[#CDA434] transition-all"
                            placeholder="50000"
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-[#8D6E63] uppercase tracking-widest flex items-center gap-2">
                            <Clock className="w-4 h-4 text-[#CDA434]" />
                            Duration
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                value={durationValue}
                                onChange={(e) => setDurationValue(e.target.value)}
                                className="w-1/3 bg-[#1A1A1A] border-2 border-[#5D4037] rounded-xl py-4 px-2 text-center text-[#E8DCC4] focus:outline-none focus:border-[#CDA434] transition-all font-bold"
                                required
                            />
                            <select
                                value={durationUnit}
                                onChange={(e) => setDurationUnit(e.target.value)}
                                className="w-2/3 bg-[#3E2723] border-2 border-[#5D4037] rounded-xl py-4 px-2 text-[#E8DCC4] text-sm focus:outline-none focus:border-[#CDA434] transition-all"
                            >
                                <option value="days">Days</option>
                                <option value="weeks">Weeks</option>
                                <option value="months">Months</option>
                                <option value="years">Years</option>
                            </select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-[#8D6E63] uppercase tracking-widest flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-[#CDA434]" />
                            Frequency
                        </label>
                        <select
                            value={frequency}
                            onChange={(e) => setFrequency(e.target.value)}
                            className="w-full bg-[#3E2723] border-2 border-[#5D4037] rounded-xl py-4 px-4 text-[#E8DCC4] focus:outline-none focus:border-[#CDA434] transition-all h-[64px]"
                        >
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Yearly</option>
                        </select>
                    </div>
                </div>

                <div className="text-center text-xs text-[#8D6E63] bg-[#1A1A1A] rounded-lg p-3 border border-[#333] font-mono">
                    CALCULATED: <span className="text-[#CDA434] font-bold text-lg">{estimatedSlots}</span> DEPOSITS
                </div>

                <button
                    type="submit"
                    className="w-full py-4 bg-[#CDA434] hover:bg-[#FFD770] text-[#2C1810] font-black uppercase tracking-widest rounded-xl shadow-lg transform transition-all active:scale-[0.98] flex items-center justify-center group border-b-4 border-[#8D6E63] active:border-b-0 active:translate-y-1"
                >
                    {isEditing ? 'SAVE CHANGES' : 'INITIALIZE'}
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
            </form>
        </div>
    );
}
