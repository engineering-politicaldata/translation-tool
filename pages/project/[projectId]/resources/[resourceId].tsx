import { useRouter } from 'next/router';
import UserDashboardLayout from '../../../../components/layouts/user-dashboard-layout';
import { privateRoute } from '../../../../guard';

function ResourcePage() {
    const router = useRouter();
    const projectId = router.query.projectId;
    return (
        <UserDashboardLayout>
            <div>Resource page is here{projectId}</div>
        </UserDashboardLayout>
    );
}

export default privateRoute(ResourcePage);
