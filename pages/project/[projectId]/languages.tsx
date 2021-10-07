import { useRouter } from 'next/router';
import UserDashboardLayout from '../../../components/layouts/UserDashboardLayout';

export default function LanguagesPage() {
    const router = useRouter();
    const projectId = router.query.projectId;
    return (
        <UserDashboardLayout>
            <div>Language page is here{projectId}</div>
        </UserDashboardLayout>
    );
}
