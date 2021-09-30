import { useRouter } from 'next/router';
import UserDashboardLayout from '../../../components/layouts/UserDashboardLayout';

export default function ResourcesPage() {
    const router = useRouter();
    const projectId = router.query.projectId;
    return (
        <UserDashboardLayout>
            <div>Resources page is here{projectId}</div>
        </UserDashboardLayout>
    );
}
