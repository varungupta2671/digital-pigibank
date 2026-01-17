import { usePiggy } from '../context/PiggyContext';
import { useToast } from '../context/ToastContext';
import { useState } from 'react';
import { Check, X, Lock } from 'lucide-react';
import { cn } from '../utils/cn';

export default function PlanList() {
    const { savingsPlan, accounts, makePayment } = usePiggy();
    const { showToast } = useToast();

    // Payment Modal State
    const [selectedBit, setSelectedBit] = useState(null);
    const [selectedAccount, setSelectedAccount] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const handleTileClick = (bit) => {
        if (bit.status === 'paid') return;
        setSelectedBit(bit);
        // Default to first account if available
        if (accounts.length > 0) setSelectedAccount(accounts[0].id);
    };

    const handleCloseModal = () => {
        setSelectedBit(null);
        setIsProcessing(false);
    };

    const handleConfirmPayment = async (method) => {
        setIsProcessing(true);

        // Simulate deep link or actual payment process
        if (method === 'gpay') {
            // Construct generic UPI link
            const receiverVpa = accounts.find(a => a.id === parseInt(selectedAccount))?.upiId;

            if (!receiverVpa) {
                showToast('Please select a valid savings account', 'error');
                setIsProcessing(false);
                return;
            }

            const upiLink = `upi://pay?pa=${receiverVpa}&pn=My%20Piggy%20Bank&tn=Savings%20Deposit&am=${selectedBit.amount}&cu=INR`;

            // Try to open
            window.location.href = upiLink;
        }

        // Simulate confirmation for now (since we can't detect app switch back easily without backend)
        setTimeout(() => {
            const confirmed = window.confirm("Did you complete the payment in the app?");
            if (confirmed) {
                makePayment(selectedBit.id, selectedAccount || 'gpay-sim');
                showToast(`Saved ₹${selectedBit.amount}! Great job!`, 'success');
                handleCloseModal();
            } else {
                setIsProcessing(false);
            }
        }, 3000); // Wait a bit for them to "pay"
    };

    return (
        <div className="space-y-6 pb-20 font-['Courier Prime']">

            {/* Payment Modal Overlay */}
            {selectedBit && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2C1810]/80 backdrop-blur-sm animate-fade-in">
                    <div className="bg-[#E8DCC4] w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden border-4 border-[#CDA434] relative">
                        {/* Receipt Pattern Top */}
                        <div className="absolute top-0 left-0 w-full h-4 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMTBMMTAgMEwyMCAxMFoiIGZpbGw9IiMyQzE4MTAiLz48L3N2Zz4=')] opacity-20"></div>

                        <div className="p-6 text-center">
                            <h3 className="text-xl font-bold font-['Righteous'] text-[#5D4037] mb-1">CONFIRM DEPOSIT</h3>
                            <div className="text-4xl font-bold text-[#2C1810] font-['VT323'] my-4 border-y-2 border-dashed border-[#8D6E63] py-2">
                                ₹{selectedBit.amount}
                            </div>

                            {/* Account Selector */}
                            <div className="mb-4 text-left">
                                <label className="text-xs font-bold text-[#8D6E63] uppercase tracking-widest block mb-2">Destination Piggy Bank</label>
                                {accounts.length > 0 ? (
                                    <div className="space-y-2">
                                        {accounts.map(acc => (
                                            <button
                                                key={acc.id}
                                                onClick={() => setSelectedAccount(acc.id)}
                                                className={cn(
                                                    "w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all",
                                                    selectedAccount === acc.id
                                                        ? "bg-[#2C1810] border-[#CDA434] text-[#E8DCC4]"
                                                        : "bg-transparent border-[#8D6E63] text-[#5D4037] hover:bg-[#D7CCC8]"
                                                )}
                                            >
                                                <span className="font-bold">{acc.name}</span>
                                                <div className="text-[10px] opacity-70 font-mono">{acc.upiId}</div>
                                                {selectedAccount === acc.id && <Check className="w-4 h-4 text-[#CDA434]" />}
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-3 bg-red-100 text-red-800 text-xs rounded-lg flex items-center gap-2 border border-red-200">
                                        <Lock className="w-3 h-3" />
                                        Link a Saving Account in Setup first!
                                    </div>
                                )}
                            </div>

                            <div className="space-y-3">
                                <button
                                    onClick={() => handleConfirmPayment('gpay')}
                                    disabled={accounts.length === 0 || isProcessing}
                                    className="w-full py-4 bg-[#CDA434] text-[#2C1810] font-black rounded-xl flex items-center justify-center gap-2 hover:bg-[#FFD770] transition-colors shadow-lg border-b-4 border-[#8D6E63] active:border-b-0 active:translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                                >
                                    {/* Shine effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent translate-x-[-100%] group-hover:animate-shine"></div>
                                    <span className="relative z-10 uppercase tracking-widest">PAY NOW</span>
                                </button>

                                <button
                                    onClick={handleCloseModal}
                                    className="w-full py-3 text-[#5D4037] font-bold hover:bg-[#D7CCC8] rounded-xl transition-colors uppercase tracking-widest text-sm"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex justify-between items-end px-2">
                <div>
                    <h2 className="text-xl font-bold text-[#E8DCC4] font-['Righteous'] tracking-wide">SAVINGS BOARD</h2>
                    <p className="text-[#8D6E63] text-xs">Tap a ticket to save</p>
                </div>
                <div className="text-[#CDA434] text-xs font-mono bg-[#2C1810] px-2 py-1 rounded border border-[#5D4037]">
                    {savingsPlan.filter(b => b.status === 'paid').length}/{savingsPlan.length} TICKETS
                </div>
            </div>

            <div className="p-4 bg-[#3E2723] rounded-xl border-4 border-[#CDA434] shadow-[0_10px_30px_rgba(0,0,0,0.5)] relative overflow-hidden">
                {/* Wood Texture Background Effect */}
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] mix-blend-overlay pointer-events-none"></div>

                <div className="grid grid-cols-[repeat(auto-fill,minmax(72px,1fr))] gap-3 relative z-10">
                    {savingsPlan.map((bit) => {
                        const isPaid = bit.status === 'paid';
                        const date = new Date(bit.dueDate);
                        // Random rotation for organic feel
                        const rotation = Math.random() * 4 - 2;

                        return (
                            <button
                                key={bit.id}
                                disabled={isPaid}
                                onClick={() => handleTileClick(bit)}
                                style={{ transform: isPaid ? 'scale(0.95)' : `rotate(${rotation}deg)` }}
                                title={isPaid ? `Paid on ${new Date(bit.paidAt).toLocaleDateString()}` : `Due: ${date.toLocaleDateString()}`}
                                className={`
                                    aspect-square rounded-lg flex flex-col items-center justify-center transition-all duration-300 relative group p-1 hover:z-50 border-b-4 active:border-b-0 active:translate-y-1 active:rotate-0
                                    ${isPaid
                                        ? 'bg-[#2C1810] text-[#4E342E] border-[#1A1A1A] opacity-60 shadow-inner'
                                        : 'bg-[#E8DCC4] text-[#3E2723] shadow-lg hover:scale-110 hover:bg-[#FFF8E1] border-[#BCAAA4]'
                                    }
                                `}
                            >
                                {isPaid ? (
                                    <Check className="w-6 h-6 text-[#5D4037]" />
                                ) : (
                                    <>
                                        <span className="text-sm font-black tracking-tighter truncate w-full text-center font-['VT323'] text-xl">₹{bit.amount}</span>
                                        <div className="w-full h-[1px] bg-[#D7CCC8] my-1"></div>
                                        <span className="text-[8px] font-bold text-[#8D6E63] uppercase tracking-wider font-sans leading-none">
                                            {date.getDate()}/{date.getMonth() + 1}
                                        </span>
                                    </>
                                )}

                                {/* Tooltip for cleaner UI */}
                                {!isPaid && (
                                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-[#2C1810] text-[#CDA434] text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-xl border border-[#CDA434] transition-opacity font-['VT323'] tracking-widest text-lg">
                                        DUE: {date.toLocaleDateString()}
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="text-center text-[#5D4037] text-[10px] uppercase tracking-[0.2em] opacity-50 mt-8">
                Digital Piggy Bank Systems • 2026
            </div>
        </div>
    );
}
