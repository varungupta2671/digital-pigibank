import { Mail, Github, Twitter, MessageCircle } from 'lucide-react';

export default function Contact() {
    return (
        <div className="min-h-screen bg-[#0F0502] text-[#FFF8E7] font-['Courier_Prime'] p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                {/* Page Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-['Righteous'] text-[#FFD700] mb-4">
                        CONTACT US
                    </h1>
                    <p className="text-[#A1887F] text-lg">
                        We'd love to hear from you!
                    </p>
                </div>

                {/* Contact Info */}
                <div className="bg-[#1A0B08] rounded-2xl p-8 border-4 border-[#FFD700] shadow-lg mb-8 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] mix-blend-overlay pointer-events-none"></div>
                    <div className="relative z-10">
                        <h2 className="text-2xl font-['Righteous'] text-[#FFD700] mb-6">Get In Touch</h2>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <Mail className="w-6 h-6 text-[#FFD700] flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="text-lg font-bold text-[#FFF8E7] mb-1">Email</h3>
                                    <p className="text-[#A1887F]">support@digitalpiggybank.app</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <MessageCircle className="w-6 h-6 text-[#FFD700] flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="text-lg font-bold text-[#FFF8E7] mb-1">Feedback</h3>
                                    <p className="text-[#A1887F]">
                                        We're always looking to improve! Share your thoughts and suggestions.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Social Links */}
                <h2 className="text-2xl font-['Righteous'] text-[#FFD700] mb-6 text-center">Connect With Us</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <a
                        href="https://github.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#1A0B08] rounded-xl p-6 border-2 border-[#5D4037] hover:border-[#FFD700] transition-all flex flex-col items-center gap-3 group"
                    >
                        <Github className="w-10 h-10 text-[#FFD700] group-hover:scale-110 transition-transform" />
                        <span className="text-[#FFF8E7] font-bold">GitHub</span>
                    </a>

                    <a
                        href="https://twitter.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#1A0B08] rounded-xl p-6 border-2 border-[#5D4037] hover:border-[#FFD700] transition-all flex flex-col items-center gap-3 group"
                    >
                        <Twitter className="w-10 h-10 text-[#FFD700] group-hover:scale-110 transition-transform" />
                        <span className="text-[#FFF8E7] font-bold">Twitter</span>
                    </a>

                    <a
                        href="mailto:support@digitalpiggybank.app"
                        className="bg-[#1A0B08] rounded-xl p-6 border-2 border-[#5D4037] hover:border-[#FFD700] transition-all flex flex-col items-center gap-3 group"
                    >
                        <Mail className="w-10 h-10 text-[#FFD700] group-hover:scale-110 transition-transform" />
                        <span className="text-[#FFF8E7] font-bold">Email</span>
                    </a>
                </div>

                {/* Note */}
                <div className="mt-12 text-center">
                    <p className="text-[#5D4037] text-sm">
                        Digital Piggy Bank is an open-source project. Contributions are welcome!
                    </p>
                </div>
            </div>
        </div>
    );
}
