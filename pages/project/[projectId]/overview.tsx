import { useRouter } from 'next/router';

export default function OverviewPage() {
    const router = useRouter();
    const projectId = router.query.projectId;
    return <div>Overview page is here{projectId}</div>;
}
