import { usePiggy } from '../context/PiggyContext';
import { Wallet, Settings, Pencil, X, Plus, ChevronRight, Trophy } from 'lucide-react';
import PlanList from './PlanList';
import AccountSetup from './AccountSetup';
import { useState } from 'react';
import { cn } from '../utils/cn';

export default function Dashboard() {
    const { goal, goals, savingsPlan, resetGoal, startEditing, switchGoal } = usePiggy();
    const [activeTab, setActiveTab] = useState('plan'); // 'plan' or 'accounts'
    const [showGoalMenu, setShowGoalMenu] = useState(false);

    // Statistics Logic
    const totalSaved = savingsPlan
        .filter(bit => bit.status === 'paid')
        .reduce((sum, bit) => sum + bit.amount, 0);

    const progress = Math.min((totalSaved / goal.targetAmount) * 100, 100);

    // Time Left Calculation
    const getTimeLeft = () => {
        const created = new Date(goal.createdAt);
        let endDate = new Date(created);

        // Add duration
        const val = parseInt(goal.durationValue || 0);
        const unit = goal.durationUnit || 'months';

        if (unit === 'days') endDate.setDate(endDate.getDate() + val);
        if (unit === 'weeks') endDate.setDate(endDate.getDate() + (val * 7));
        if (unit === 'months') endDate.setMonth(endDate.getMonth() + val);
        if (unit === 'years') endDate.setFullYear(endDate.getFullYear() + val);

        const now = new Date();
        const diffTime = endDate - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return "FINISHED";
        if (diffDays > 365) return `${Math.floor(diffDays / 365)}Y LEFT`;
        if (diffDays > 30) return `${Math.floor(diffDays / 30)}M LEFT`;
        return `${diffDays}D LEFT`;
    };

    const handleCreateNew = () => {
        setShowGoalMenu(false);
        // Small timeout to ensure menu exit animation clears or state updates smoothly
        setTimeout(() => switchGoal(null), 100);
    }

    const handleSwitch = (id) => {
        setShowGoalMenu(false);
        setTimeout(() => switchGoal(id), 100);
    }

    return (
        <div className="pb-8 font-[Courier Prime]">
            {/* Retro Header Card */}
            <div className="p-6 bg-[#2C1810] rounded-b-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)] border-b-4 border-[#CDA434] relative overflow-hidden">
                {/* Wood Texture Overlay */}
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] mix-blend-overlay pointer-events-none"></div>

                <div className="flex justify-between items-start mb-6 relative z-10">
                    <div className="relative">
                        <button
                            onClick={() => setShowGoalMenu(true)}
                            className="flex items-center gap-2 text-2xl text-[#FFF8E7] mb-1 hover:text-[#FFD700] transition-colors font-['Righteous'] tracking-wide group"
                        >
                            <Trophy className="w-6 h-6 text-[#FFD700]" />
                            {goal.name || 'MY GOAL'}
                            <div className="bg-[#2C1810] p-1 rounded-md border border-[#5D4037] group-hover:border-[#FFD700] transition-colors">
                                <ChevronRight className="w-4 h-4 text-[#FFD700]" />
                            </div>
                        </button>
                        <p className="text-[#A1887F] text-xs font-bold uppercase tracking-widest pl-1">Piggy Bank OS v2.0</p>
                    </div>

                    {/* NEW NAVIGATION BUTTON - Visible explicitly */}
                    <button
                        onClick={() => setShowGoalMenu(true)}
                        className="bg-[#2C1810] text-[#FFD700] px-3 py-2 rounded-lg border border-[#5D4037] text-[10px] font-bold uppercase tracking-widest hover:bg-[#3E2723] hover:border-[#FFD700] transition-all shadow-lg active:scale-95"
                    >
                        My Goals
                    </button>
                </div>

                {/* Digital Counter Display */}
                <div className="text-center mb-6 relative z-10 bg-[#1A1A1A] p-4 rounded-xl border-2 border-[#4E342E] shadow-inner relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-50"></div>

                    <p className="text-[#5D4037] text-[10px] mb-1 uppercase tracking-widest font-bold font-sans">TARGET STATUS</p>
                    <div className="text-5xl text-[#4ADE80] font-['VT323'] tracking-widest drop-shadow-[0_0_10px_rgba(74,222,128,0.5)]">
                        ₹{goal.targetAmount.toLocaleString()}
                    </div>

                    {/* Progress Bar Retro */}
                    <div className="w-full mt-4 h-3 bg-[#0F0F0F] rounded-full border border-[#333] p-[1px]">
                        <div
                            className="h-full bg-gradient-to-r from-[#CDA434] via-[#F9A825] to-[#CDA434] rounded-full shadow-[0_0_15px_rgba(205,164,52,0.5)] relative overflow-hidden"
                            style={{ width: `${progress}%` }}
                        >
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')] opacity-20"></div>
                        </div>
                    </div>
                    <div className="flex justify-between mt-2 px-1">
                        <span className="text-[#CDA434] text-xs font-['VT323'] text-xl">0%</span>
                        <span className="text-[#CDA434] text-xs font-['VT323'] text-xl">{progress.toFixed(0)}% DONE</span>
                    </div>
                </div>

                {/* Info Tickets */}
                <div className="grid grid-cols-2 gap-3 relative z-10 mb-4">
                    <div className="bg-[#E8DCC4] text-[#3E2723] p-3 rounded-lg shadow-lg border-2 border-[#D7CCC8] relative rotate-[-1deg] transform transition-transform hover:rotate-0">
                        <div className="absolute top-[-4px] left-1/2 -translate-x-1/2 w-3 h-3 bg-[#2C1810] rounded-full"></div>
                        <p className="text-[10px] uppercase font-bold tracking-widest opacity-60">Saved So Far</p>
                        <p className="text-2xl font-bold font-['VT323']">₹{totalSaved.toLocaleString()}</p>
                    </div>
                    <div className="bg-[#E8DCC4] text-[#3E2723] p-3 rounded-lg shadow-lg border-2 border-[#D7CCC8] relative rotate-[1deg] transform transition-transform hover:rotate-0">
                        <div className="absolute top-[-4px] left-1/2 -translate-x-1/2 w-3 h-3 bg-[#2C1810] rounded-full"></div>
                        <p className="text-[10px] uppercase font-bold tracking-widest opacity-60">Time Left</p>
                        <p className="text-2xl font-bold font-['VT323']">{getTimeLeft()}</p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 relative z-10 mt-2">
                    <button
                        onClick={() => setActiveTab('plan')}
                        className={cn(
                            "flex-1 py-3 rounded-lg text-sm font-bold uppercase tracking-wider transition-all border-b-4 active:border-b-0 active:translate-y-1 flex items-center justify-center gap-2",
                            activeTab === 'plan'
                                ? "bg-[#CDA434] text-[#2C1810] border-[#8D6E63] shadow-lg"
                                : "bg-[#3E2723] text-[#A1887F] border-[#1A1A1A] hover:bg-[#4E342E]"
                        )}
                    >
                        <Wallet className="w-4 h-4" />
                        Board
                    </button>
                    <button
                        onClick={() => setActiveTab('accounts')}
                        className={cn(
                            "flex-1 py-3 rounded-lg text-sm font-bold uppercase tracking-wider transition-all border-b-4 active:border-b-0 active:translate-y-1 flex items-center justify-center gap-2",
                            activeTab === 'accounts'
                                ? "bg-[#CDA434] text-[#2C1810] border-[#8D6E63] shadow-lg"
                                : "bg-[#3E2723] text-[#A1887F] border-[#1A1A1A] hover:bg-[#4E342E]"
                        )}
                    >
                        <Settings className="w-4 h-4" />
                        Setup
                    </button>
                    <button
                        onClick={startEditing}
                        className="p-3 bg-[#3E2723] text-[#CDA434] rounded-lg border-b-4 border-[#1A1A1A] hover:bg-[#4E342E] active:border-b-0 active:translate-y-1 transition-all"
                        title="Edit Goal"
                    >
                        <Pencil className="w-4 h-4" />
                    </button>
                    <button
                        onClick={resetGoal}
                        className="p-3 bg-[#5D2020] text-[#FF8A80] rounded-lg border-b-4 border-[#2C0B0B] hover:bg-[#7F2A2A] active:border-b-0 active:translate-y-1 transition-all text-xs font-bold"
                    >
                        RESET
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="p-4 animate-slide-in-up">
                {activeTab === 'plan' ? <PlanList /> : <AccountSetup />}
            </div>

            {/* FULL SCREEN MENU OVERLAY */}
            {showGoalMenu && (
                <div className="fixed inset-0 z-[100] bg-[#2C1810]/95 backdrop-blur-md flex flex-col p-6 animate-fade-in font-['Courier Prime']">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl text-[#CDA434] font-['Righteous']">SELECT SAVE FILE</h2>
                        <button
                            onClick={() => setShowGoalMenu(false)}
                            className="p-2 bg-[#4E342E] text-[#E8DCC4] rounded-full hover:bg-[#5D4037] transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-3">
                        {goals.map(g => (
                            <button
                                key={g.id}
                                onClick={() => handleSwitch(g.id)}
                                className={cn(
                                    "w-full text-left p-4 rounded-xl border-2 transition-all group flex items-center justify-between",
                                    g.id === goal.id
                                        ? "bg-[#CDA434] border-[#FFD770] text-[#2C1810] shadow-[0_0_20px_rgba(205,164,52,0.3)] transform scale-[1.02]"
                                        : "bg-[#3E2723] border-[#5D4037] text-[#E8DCC4] hover:border-[#CDA434] hover:bg-[#4E342E]"
                                )}
                            >
                                <div>
                                    <div className="font-bold text-lg mb-1">{g.name}</div>
                                    <div className="text-xs opacity-70 font-mono">
                                        ₹{g.targetAmount.toLocaleString()} • {g.frequency}
                                    </div>
                                </div>
                                {g.id === goal.id && <Trophy className="w-6 h-6 animate-pulse" />}
                            </button>
                        ))}
                    </div>

                    <div className="mt-6 pt-6 border-t border-[#5D4037]">
                        <button
                            onClick={handleCreateNew}
                            className="w-full py-4 bg-transparent border-2 border-dashed border-[#CDA434] text-[#CDA434] font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-[#CDA434]/10 transition-all active:scale-[0.98]"
                        >
                            <Plus className="w-5 h-5" />
                            START NEW SAVE FILE
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
