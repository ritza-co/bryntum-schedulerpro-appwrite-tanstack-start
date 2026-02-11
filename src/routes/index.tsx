import { createFileRoute, Link } from '@tanstack/react-router';
import { useUser } from '../lib/context/user';
import SchedulerPro from '../components/SchedulerPro';

export const Route = createFileRoute('/')({
    component: Home,
    ssr: false,
});

function Home() {
    const user = useUser();

    return (
        <div className="home-page">
            {user?.current
                ? (
                    <SchedulerPro />
                )
                :
                user?.isLoading ?
                    (
                        <div className="loader-container">
                            <div className="loader"></div>
                        </div>
                    ) :
                    (
                        <p>
                            Please <Link to="/login">login or register</Link> to view the Bryntum Scheduler Pro
                        </p>
                    )
            }
        </div>
    );
}