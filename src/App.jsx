import { usePiggy, PiggyProvider } from './context/PiggyContext';
import { ToastProvider } from './context/ToastContext';
import GoalForm from './components/GoalForm';
import Dashboard from './components/Dashboard';

function PiggyApp() {

    const { goal, isEditing } = usePiggy();

    if (!goal || isEditing) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black">
                <GoalForm />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white pb-24 font-sans select-none">
            {/* Content Area */}
            <div className="max-w-md mx-auto min-h-screen relative bg-slate-950 shadow-2xl overflow-hidden">
                <Dashboard />
            </div>
        </div>
    );
}

function App() {
    return (
        <ToastProvider>
            <PiggyProvider>
                <PiggyApp />
            </PiggyProvider>
        </ToastProvider>
    );
}

export default App;
