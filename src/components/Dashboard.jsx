import { usePiggy } from '../context/PiggyContext';
import { Wallet, Settings, Pencil } from 'lucide-react';
import PlanList from './PlanList';
import AccountSetup from './AccountSetup';
import { useState } from 'react';
import { cn } from '../utils/cn';

export default function Dashboard() {
    const { goal, resetGoal, startEditing } = usePiggy();
    const [activeTab, setActiveTab] = useState('plan'); // 'plan' or 'accounts'

    return (
        <div className="pb-8">
            {/* Header / Summary Card */}
            <div className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 rounded-b-3xl shadow-2xl border-b border-slate-700 relative overflow-hidden">
                <div className="flex justify-between items-start mb-6 relative z-10">
                    <div>
                        <h1 className="text-2xl font-bold text-white mb-1">My Piggy Bank</h1>
                        <p className="text-slate-400 text-sm">Keep saving, keep growing!</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={startEditing}
                            className="p-2 bg-slate-700/50 hover:bg-slate-700 rounded-full transition-colors text-slate-300"
                            title="Edit Goal"
                        >
                            <Pencil className="w-4 h-4" />
                        </button>
                        <button
                            onClick={resetGoal}
                            className="px-3 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs rounded-full border border-red-500/20 transition-all"
                        >
                            Reset
                        </button>
                    </div>
                </div>

                <div className="text-center mb-6 relative z-10">
                    <p className="text-slate-400 text-sm mb-1 uppercase tracking-wider font-medium">Target Goal</p>
                    <div className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                        ₹{goal.targetAmount.toLocaleString()}
                    </div>
                    <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/50 border border-slate-700/50 backdrop-blur-sm">
                        <span className="text-xs text-slate-300">
                            {goal.totalSlots} Slots • {goal.frequency}
                        </span>
                    </div>
                </div>

                <div className="flex gap-2 relative z-10">
                    <button
                        onClick={() => setActiveTab('plan')}
                        className={cn(
                            "flex-1 py-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2",
                            activeTab === 'plan'
                                ? "bg-white text-slate-900 shadow-lg scale-[1.02]"
                                : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                        )}
                    >
                        <Wallet className="w-4 h-4" />
                        Savings Plan
                    </button>
                    <button
                        onClick={() => setActiveTab('accounts')}
                        className={cn(
                            "flex-1 py-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2",
                            activeTab === 'accounts'
                                ? "bg-white text-slate-900 shadow-lg scale-[1.02]"
                                : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                        )}
                    >
                        <Settings className="w-4 h-4" />
                        Accounts
                    </button>
                </div>

                {/* Decorative background blobs */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl"></div>
            </div>

            {/* Content Area */}
            <div className="p-4 animate-slide-in-right">
                {activeTab === 'plan' ? <PlanList /> : <AccountSetup />}
            </div>
        </div>
    );
}
