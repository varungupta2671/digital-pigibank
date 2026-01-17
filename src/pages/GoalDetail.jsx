import { useParams } from 'react-router-dom';
import Dashboard from '../components/Dashboard';

export default function GoalDetail() {
    const { id } = useParams();

    return <Dashboard />;
}
