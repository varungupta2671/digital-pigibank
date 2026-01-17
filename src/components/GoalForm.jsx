import { useState, useEffect } from 'react';
import { usePiggy } from '../context/PiggyContext';
import { Target, Calendar, ArrowRight, Clock, X } from 'lucide-react';

export default function GoalForm() {
    const { createGoal, goal, isEditing, cancelEditing } = usePiggy();
    const [amount, setAmount] = useState('');

    // Duration State
    const [durationValue, setDurationValue] = useState('1');
    const [durationUnit, setDurationUnit] = useState('months'); // days, weeks, months, years
    const [frequency, setFrequency] = useState('daily');

    const [estimatedSlots, setEstimatedSlots] = useState(0);

    // Pre-fill if editing
    useEffect(() => {
        if (isEditing && goal) {
            setAmount(goal.targetAmount);
            setFrequency(goal.frequency);
            if (goal.durationValue) setDurationValue(goal.durationValue);
            if (goal.durationUnit) setDurationUnit(goal.durationUnit);
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
        createGoal(amount, estimatedSlots, frequency, durationValue, durationUnit);
    };

    return (
        <div className="w-full max-w-md mx-auto p-6 bg-slate-800/10 backdrop-blur-md rounded-3xl border border-white/10 shadow-2xl animate-fade-in relative">
            {isEditing && (
                <button
                    onClick={cancelEditing}
                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-800/50 rounded-full transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            )}

            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent mb-2">
                    {isEditing ? 'Update Goal' : 'New Goal'}
                </h2>
                <p className="text-slate-400">Smart Savings Plan</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                        <Target className="w-4 h-4 text-emerald-400" />
                        Target Amount
                    </label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">₹</span>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-4 pl-10 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-mono text-lg"
                            placeholder="50000"
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-blue-400" />
                            Duration
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                value={durationValue}
                                onChange={(e) => setDurationValue(e.target.value)}
                                className="w-1/3 bg-slate-900/50 border border-slate-700 rounded-xl py-4 px-2 text-center text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-mono"
                                required
                            />
                            <select
                                value={durationUnit}
                                onChange={(e) => setDurationUnit(e.target.value)}
                                className="w-2/3 bg-slate-900/50 border border-slate-700 rounded-xl py-4 px-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                            >
                                <option value="days">Days</option>
                                <option value="weeks">Weeks</option>
                                <option value="months">Months</option>
                                <option value="years">Years</option>
                            </select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-purple-400" />
                            Frequency
                        </label>
                        <select
                            value={frequency}
                            onChange={(e) => setFrequency(e.target.value)}
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-4 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all h-[60px]"
                        >
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Yearly</option>
                        </select>
                    </div>
                </div>

                <div className="text-center text-xs text-slate-500 bg-slate-900/30 rounded-lg p-2 border border-slate-800">
                    Calculated: <span className="text-emerald-400 font-bold">{estimatedSlots}</span> savings deposits
                </div>

                <button
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 transform transition-all active:scale-[0.98] flex items-center justify-center group"
                >
                    {isEditing ? 'Update Savings Board' : 'Create Savings Board'}
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
            </form>
        </div>
    );
}
