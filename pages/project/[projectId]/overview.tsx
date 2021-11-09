import { Link } from '@material-ui/core';
import { useTheme } from '@material-ui/styles';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';
import styled, { css } from 'styled-components';
import NoDataFoundPage from '../../../components/common/no-data-found-page';
import TranslationProgressView from '../../../components/common/translation-progress-view';
import WebsiteHeader from '../../../components/common/website-header';
import { UserDashboardSummaryContext } from '../../../components/contexts/user-dashboard-summary-provider';
import UserDashboardLayout from '../../../components/layouts/user-dashboard-layout';
import { privateRoute } from '../../../guard';
import { GET_API_CONFIG } from '../../../shared/ApiConfig';
import { apiRequest } from '../../../shared/RequestHandler';
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
function OverviewPage() {
    const router = useRouter();
    const projectId = router.query.projectId;
    const theme = useTheme();

    const projectListContext = useContext(UserDashboardSummaryContext);
    const { activeProject } = projectListContext;

    async function getProjectResourceSummary(projectId: string) {
        try {
            const resourceSummary = await apiRequest(
                `/api/project/${projectId}/resources`,
                GET_API_CONFIG,
            );

            projectListContext.updateActiveProject({
                ...activeProject,
                ...resourceSummary,
            });
        } catch (error) {
            console.log(error);
            // TODO handle error correctly
        }
    }

    useEffect(() => {
        if (!activeProject) {
            return;
        }

        if (activeProject.resources === undefined) {
            getProjectResourceSummary(activeProject.id);
        }
        // if (!activeProject.totalSourceKeys) {
        //     //TODO api call to get project translation summary

        //     //update active project in context
        // }
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

export default privateRoute(OverviewPage);
