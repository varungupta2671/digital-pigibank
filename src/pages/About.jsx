import { Trophy, Target, Zap, Shield } from 'lucide-react';

export default function About() {
    return (
        <div className="min-h-screen bg-[#0F0502] text-[#FFF8E7] font-['Courier_Prime'] p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                {/* Page Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-['Righteous'] text-[#FFD700] mb-4">
                        ABOUT DIGITAL PIGGY BANK
                    </h1>
                    <p className="text-[#A1887F] text-lg">
                        Your smart companion for achieving financial goals
                    </p>
                </div>

                {/* Mission */}
                <div className="bg-[#1A0B08] rounded-2xl p-8 border-4 border-[#FFD700] shadow-lg mb-8 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] mix-blend-overlay pointer-events-none"></div>
                    <div className="relative z-10">
                        <h2 className="text-2xl font-['Righteous'] text-[#FFD700] mb-4">Our Mission</h2>
                        <p className="text-[#FFF8E7] leading-relaxed">
                            Digital Piggy Bank is designed to make saving money fun, gamified, and achievable.
                            We believe that breaking down large financial goals into small, manageable "tickets"
                            makes the journey less daunting and more rewarding.
                        </p>
                    </div>
                </div>

                {/* Features */}
                <h2 className="text-3xl font-['Righteous'] text-[#FFD700] mb-6 text-center">Key Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    <div className="bg-[#1A0B08] rounded-xl p-6 border-2 border-[#5D4037]">
                        <Trophy className="w-10 h-10 text-[#FFD700] mb-3" />
                        <h3 className="text-xl font-bold text-[#FFD700] mb-2">Gamified Savings</h3>
                        <p className="text-[#A1887F]">
                            Break down your goals into fun "tickets" that you can check off as you save.
                        </p>
                    </div>

                    <div className="bg-[#1A0B08] rounded-xl p-6 border-2 border-[#5D4037]">
                        <Target className="w-10 h-10 text-[#FFD700] mb-3" />
                        <h3 className="text-xl font-bold text-[#FFD700] mb-2">Goal Tracking</h3>
                        <p className="text-[#A1887F]">
                            Set multiple savings goals and track your progress with visual indicators.
                        </p>
                    </div>

                    <div className="bg-[#1A0B08] rounded-xl p-6 border-2 border-[#5D4037]">
                        <Shield className="w-10 h-10 text-[#FFD700] mb-3" />
                        <h3 className="text-xl font-bold text-[#FFD700] mb-2">Local First</h3>
                        <p className="text-[#A1887F]">
                            Your data stays on your device using IndexedDB. No cloud, no tracking.
                        </p>
                    </div>

                    <div className="bg-[#1A0B08] rounded-xl p-6 border-2 border-[#5D4037]">
                        <Zap className="w-10 h-10 text-[#FFD700] mb-3" />
                        <h3 className="text-xl font-bold text-[#FFD700] mb-2">PWA Ready</h3>
                        <p className="text-[#A1887F]">
                            Install on your phone or desktop for a native app experience.
                        </p>
                    </div>
                </div>

                {/* Tech Stack */}
                <div className="bg-[#1A0B08] rounded-2xl p-8 border-4 border-[#FFD700] shadow-lg relative overflow-hidden">
                    <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] mix-blend-overlay pointer-events-none"></div>
                    <div className="relative z-10">
                        <h2 className="text-2xl font-['Righteous'] text-[#FFD700] mb-4">Built With</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-[#FFF8E7]">
                            <div className="bg-[#2C1810] p-3 rounded-lg text-center">
                                <p className="font-bold">React</p>
                            </div>
                            <div className="bg-[#2C1810] p-3 rounded-lg text-center">
                                <p className="font-bold">Vite</p>
                            </div>
                            <div className="bg-[#2C1810] p-3 rounded-lg text-center">
                                <p className="font-bold">TailwindCSS</p>
                            </div>
                            <div className="bg-[#2C1810] p-3 rounded-lg text-center">
                                <p className="font-bold">IndexedDB</p>
                            </div>
                            <div className="bg-[#2C1810] p-3 rounded-lg text-center">
                                <p className="font-bold">PWA</p>
                            </div>
                            <div className="bg-[#2C1810] p-3 rounded-lg text-center">
                                <p className="font-bold">React Router</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
