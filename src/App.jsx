import { usePiggy, PiggyProvider } from './context/PiggyContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import GoalForm from './components/GoalForm';
import Dashboard from './components/Dashboard';

function InnerApp() {
    const { goal, isEditing, isLoading } = usePiggy();

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
                <div className="animate-pulse">Loading Savings...</div>
            </div>
        );
    }

    if (!goal || isEditing) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black">
                <GoalForm />
            </div>
        );
    }

    return (
        <div className="min-h-screen landscape:h-screen bg-slate-950 text-white pb-24 landscape:pb-0 font-sans select-none">
            {/* Content Area */}
            <div className="max-w-md md:max-w-none mx-auto md:mx-0 min-h-screen landscape:h-screen relative bg-slate-950 shadow-2xl md:shadow-none overflow-hidden">
                <Dashboard />
            </div>
        </div>
    );
}

function App() {
    return (
        <ThemeProvider>
            <ToastProvider>
                <PiggyProvider>
                    <InnerApp />
                </PiggyProvider>
            </ToastProvider>
        </ThemeProvider>
    );
}

export default App;
