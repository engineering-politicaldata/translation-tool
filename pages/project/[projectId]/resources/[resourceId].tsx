import { useRouter } from 'next/router';
import UserDashboardLayout from '../../../../components/layouts/UserDashboardLayout';

export default function ResourcePage() {
    const router = useRouter();
    const projectId = router.query.projectId;
    return (
        <UserDashboardLayout>
            <div>Resource page is here{projectId}</div>
        </UserDashboardLayout>
    );
}
