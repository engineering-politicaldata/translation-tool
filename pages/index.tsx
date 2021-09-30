import React, { useEffect, useState } from 'react';
import WebsiteHeader from '../components/common/website-header';
import UserDashboardLayout from '../components/layouts/UserDashboardLayout';

export default function Home() {
    const [allProjectsSummary, setAllProjectSummary] = useState<{
        projectCount: number;
        translationPercentage: number;
        untranslationPercentage: number;
        sourceWords: number;
    }>(undefined);
    useEffect(() => {
        // get all project summary
        const dummyResponse = {
            projectCount: 3,
            totalSourceKeys: 120,
            translatedKeysCount: 60,
            untranslatedKeysCount: 40,
            sourceWords: 300,
        };

        const translationPercentage =
            (dummyResponse.translatedKeysCount / dummyResponse.totalSourceKeys) * 100;
        const untranslationPercentage = 100 - translationPercentage;
        setAllProjectSummary({
            projectCount: dummyResponse.projectCount,
            translationPercentage,
            untranslationPercentage,
            sourceWords: dummyResponse.sourceWords,
        });
    }, []);

    if (!allProjectsSummary) {
        return <UserDashboardLayout>No Projects available</UserDashboardLayout>;
    }

    return (
        <UserDashboardLayout>
            <WebsiteHeader
                title='All projects'
                description='Summary of all the projects available'
            />
            Total Projects {allProjectsSummary.projectCount}
            Total Source keys Translation percentage UnTranslated percentage Source words
        </UserDashboardLayout>
    );
}
