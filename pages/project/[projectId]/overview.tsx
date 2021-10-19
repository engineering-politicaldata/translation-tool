import { Link } from '@material-ui/core';
import { useTheme } from '@material-ui/styles';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';
import styled, { css } from 'styled-components';
import NoDataFoundPage from '../../../components/common/no-data-found-page';
import TranslationProgressView from '../../../components/common/translation-progress-view';
import WebsiteHeader from '../../../components/common/website-header';
import { UserDashboardSummaryContext } from '../../../components/contexts/UserDashboardSummaryProvider';
import UserDashboardLayout from '../../../components/layouts/UserDashboardLayout';
const ProjectOverviewPage = styled.div`
    ${props =>
        props.theme &&
        css`
            height: 100%;
            display: flex;
            flex-direction: column;
            .project-overview-page-body {
                flex: 1;
                padding: ${props.theme.spacing(8)}px;
            }
        `}
`;
export default function OverviewPage() {
    const router = useRouter();
    const projectId = router.query.projectId;
    const theme = useTheme();

    const projectListContext = useContext(UserDashboardSummaryContext);
    const { activeProject } = projectListContext;

    useEffect(() => {
        if (!activeProject) {
            return;
        }
        if (!activeProject.totalSourceKeys) {
            //TODO api call to get project translation summary
            // const dummyResponse = {
            //     totalSourceKeys: 100,
            //     translatedKeysCount: 50,
            //     totalSourceWords: 200,
            // };
            //update active project in context
        }
        // If totalSourceWords are already there then we can safely assume that its up to date
    }, [activeProject]);

    if (!activeProject) {
        return (
            <UserDashboardLayout>
                <NoDataFoundPage
                    message={'Project information not available'}
                    subText={'Please try after sometime'}
                />
            </UserDashboardLayout>
        );
    }

    if (activeProject && !activeProject.totalSourceKeys) {
        return (
            <UserDashboardLayout>
                <ProjectOverviewPage theme={theme}>
                    <WebsiteHeader
                        title={activeProject.name}
                        description={activeProject.description}
                    />

                    <NoDataFoundPage
                        message={'No Resources Found'}
                        subText={'Please setup resources for this project'}
                    >
                        <NextLink href={`/project/${projectId}/resources`}>
                            <Link color='secondary'>Add Resources</Link>
                        </NextLink>
                    </NoDataFoundPage>
                </ProjectOverviewPage>
            </UserDashboardLayout>
        );
    }

    const translationPercentage =
        (activeProject.translatedKeysCount / activeProject.totalSourceKeys) * 100;

    return (
        <UserDashboardLayout>
            <ProjectOverviewPage theme={theme}>
                <WebsiteHeader title={activeProject.name} description={activeProject.description} />

                <div className='project-overview-page-body'>
                    <TranslationProgressView
                        {...activeProject}
                        translationPercentage={Math.floor(translationPercentage)}
                        untranslationPercentage={Math.ceil(100 - translationPercentage)}
                    />
                </div>
            </ProjectOverviewPage>
        </UserDashboardLayout>
    );
}
