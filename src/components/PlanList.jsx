import { usePiggy } from '../context/PiggyContext';
import { useToast } from '../context/ToastContext';
import { Check, X, Smartphone, CreditCard } from 'lucide-react';
import { useState } from 'react';

export default function PlanList() {
    const { savingsPlan, accounts, makePayment } = usePiggy();
    const { addToast } = useToast();

    // Payment Modal State
    const [selectedBit, setSelectedBit] = useState(null);
    const [paymentModalOpen, setPaymentModalOpen] = useState(false);

    const handleTileClick = (bit) => {
        if (accounts.length === 0) {
            addToast("Please link a Savings Account first!", "error");
            return;
        }
        setSelectedBit(bit);
        setPaymentModalOpen(true);
    };

    const handleConfirmPayment = (appType) => {
        if (!selectedBit || accounts.length === 0) return;

        // For now, default to first account or let user pick if we add selection logic UI later
        // Simplification: just use the first account found for now, or the one they set up
        const account = accounts[0];

        // Construct Link
        // Standard UPI
        let upiLink = `upi://pay?pa=${account.upiId}&pn=${encodeURIComponent(account.name)}&am=${selectedBit.amount}&cu=INR&tn=PiggySavings`;

        // Google Pay Specific intent (simulated by scheme if supported or fallback)
        // Note: Tez scheme is deprecated in some contexts but still widely used for intent firing on Android
        if (appType === 'gpay') {
            // Try to force GPay if possible, or just use branded button
            // In web PWA, standard upi:// is safest, but we can try branding
            // Some devices respond to tez://
            // Let's stick to standard UPI but purely branded UI for now to avoid broken links
            // If user requested SPECIFIC Google Pay integrator, we assume they want the button to look like it
        }

        window.location.href = upiLink;

        // confirm payment in app (optimistic UI)
        // In real world, we'd wait for callback, here we ask manual confirmation or assume success after delay
        setTimeout(() => {
            if (confirm(`Did the payment of ₹${selectedBit.amount} complete successfully?`)) {
                makePayment(selectedBit.id, account.id);
                addToast(`₹${selectedBit.amount} Saved!`, "success");
                setPaymentModalOpen(false);
            }
        }, 2000);
    };

    const paidCount = savingsPlan.filter(b => b.status === 'paid').length;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-200">Savings Board</h3>
                <span className="text-xs text-slate-500 bg-slate-900 px-2 py-1 rounded-full border border-slate-800">
                    {paidCount} / {savingsPlan.length} Complete
                </span>
            </div>

            <div className="p-4 bg-[#3E2723]/30 rounded-xl border-4 border-[#5D4037] shadow-2xl relative overflow-hidden">
                {/* Wood Texture Background Effect */}
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] mix-blend-overlay pointer-events-none"></div>

                <div className="grid grid-cols-[repeat(auto-fill,minmax(72px,1fr))] gap-3 relative z-10">
                    {savingsPlan.map((bit) => {
                        const isPaid = bit.status === 'paid';
                        const date = new Date(bit.dueDate);

                        return (
                            <button
                                key={bit.id}
                                disabled={isPaid}
                                onClick={() => handleTileClick(bit)}
                                title={isPaid ? `Paid on ${new Date(bit.paidAt).toLocaleDateString()}` : `Due: ${date.toLocaleDateString()}`}
                                className={`
                                    aspect-square rounded-lg flex flex-col items-center justify-center transition-all transform duration-300 relative group p-1 hover:z-50
                                    ${isPaid
                                        ? 'bg-[#3E2723] text-[#5D4037] shadow-inner opacity-50 scale-95 border border-[#5D4037]/50'
                                        : 'bg-gradient-to-br from-slate-100 to-slate-200 text-slate-900 shadow-lg hover:scale-105 hover:from-white hover:to-white hover:text-black border-b-4 border-slate-300 active:border-b-0 active:translate-y-1'
                                    }
                                `}
                            >
                                {isPaid ? (
                                    <Check className="w-5 h-5" />
                                ) : (
                                    <>
                                        <span className="text-xs font-extrabold tracking-tight truncate w-full text-center">₹{bit.amount}</span>
                                        <span className="text-[9px] font-mono text-slate-500 mt-1 uppercase tracking-wider bg-slate-200/50 px-1 rounded whitespace-nowrap">
                                            {date.getDate()}/{date.getMonth() + 1}
                                        </span>
                                    </>
                                )}

                                {/* Tooltip for cleaner UI */}
                                {!isPaid && (
                                    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-1 px-2 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-xl border border-slate-700 transition-opacity">
                                        Due: {date.toLocaleDateString()}
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {savingsPlan.length === 0 && (
                <div className="text-center py-10 text-slate-500">
                    No plan generated yet.
                </div>
            )}

            <p className="text-center text-xs text-slate-500 mt-4">
                Tap a tile to pay. Dates show due deadlines.
            </p>

            {/* Payment Modal */}
            {paymentModalOpen && selectedBit && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
                    <div className="bg-slate-900 w-full max-w-sm rounded-3xl border border-slate-700 shadow-2xl p-6 relative">
                        <button
                            onClick={() => setPaymentModalOpen(false)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-white"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <div className="text-center mb-6">
                            <h3 className="text-slate-400 text-sm font-medium uppercase tracking-widest mb-2">Saving For Goal</h3>
                            <div className="text-5xl font-bold text-white mb-1">₹{selectedBit.amount}</div>
                            <div className="text-xs text-emerald-400 font-mono">
                                Due: {new Date(selectedBit.dueDate).toLocaleDateString()}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700">
                                <p className="text-xs text-slate-500 mb-2">Sending To:</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white">
                                        <CreditCard className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white">{accounts[0].name}</p>
                                        <p className="text-[10px] text-slate-400 font-mono">{accounts[0].upiId}</p>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => handleConfirmPayment('gpay')}
                                className="w-full py-4 bg-white text-black font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors shadow-lg shadow-white/10"
                            >
                                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Google_Pay_Logo.svg/2560px-Google_Pay_Logo.svg.png" alt="GPay" className="h-6 object-contain" />
                                Pay with Google Pay
                            </button>

                            <button
                                onClick={() => handleConfirmPayment('other')}
                                className="w-full py-4 bg-slate-800 text-white font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-slate-700 border border-slate-700 transition-colors"
                            >
                                <Smartphone className="w-5 h-5 text-slate-400" />
                                Other UPI Apps
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
