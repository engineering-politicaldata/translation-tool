import { useRouter } from 'next/router';
import { useEffect } from 'react';
import UserDashboardLayout from '../../../components/layouts/UserDashboardLayout';

export default function OverviewPage() {
    const router = useRouter();
    const projectId = router.query.projectId;
    useEffect(() => {
        // get project basic information
        // we need to show
    });
    return (
        <UserDashboardLayout>
            <div>Overview page is here{projectId}</div>
        </UserDashboardLayout>
    );
}
