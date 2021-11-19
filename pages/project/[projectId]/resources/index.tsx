import { CircularProgress, Typography, useTheme } from '@material-ui/core';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import NoDataFoundPage from '../../../../components/common/no-data-found-page';
import WebsiteHeader from '../../../../components/common/website-header';
import { UserDashboardSummaryContext } from '../../../../components/contexts/user-dashboard-summary-provider';
import UserDashboardLayout from '../../../../components/layouts/user-dashboard-layout';
import { privateRoute } from '../../../../guard';
import { UploadResourceInput } from '@data-model';
import { GET_API_CONFIG, POST_API_CONFIG } from '../../../../shared/ApiConfig';
import { APPBAR_HEIGHT, LoadingState } from '../../../../shared/Constants';
import { apiRequest } from '../../../../shared/RequestHandler';
import { ResourceList, ResourceHeader } from '../../../../components/resources/resource-list';

const ProjectResourcesPage = styled.div`
    ${props =>
        props.theme &&
        css`
            min-height: calc(100vh - ${APPBAR_HEIGHT});
            display: flex;
            flex-direction: column;
            .project-resource-page-body {
                padding: ${props.theme.spacing(8)}px;
                flex: 1;

                .upload-resource-button {
                    padding: ${props.theme.spacing(8)}px;
                    text-align: center;
                }
                .resources-summary {
                    display: grid;
                    grid-template-columns: 1fr auto auto auto;
                    grid-gap: ${props.theme.spacing(3)}px;
                    padding-bottom: ${props.theme.spacing(4)}px;
                    border-bottom: 1px solid ${props.theme.grey[300]};
                    color: ${props.theme.grey[500]};

                    .section-1 {
                        flex: 1;
                        display: flex;
                        justify-content: space-between;
                        border-right: 1px solid ${props.theme.grey[300]};
                        padding-right: ${props.theme.spacing(3)}px;

                        .word-count {
                            text-align: right;
                        }
                    }
                    .section-2 {
                        text-align: right;
                    }
                    .section-3 {
                    }
                    .section-4 {
                    }
                }
            }

            .no-source-present-container {
                height: 100%;
                padding: ${props.theme.spacing(8)}px;
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: center;
                .no-source-present {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    .message {
                        opacity: 0.5;
                        margin-bottom: ${props.theme.spacing(2)}px;
                    }
                }
            }

            .upload-file-button {
                padding: ${props.theme.spacing(2)}px 0;
                .upload-input-label {
                    cursor: pointer;
                    padding: ${props.theme.spacing(2)}px;
                    border-radius: 3px;
                    font-weight: 500;
                    color: ${props.theme.contrastColor};
                    background-color: ${props.theme.secondary[500]};
                    overflow: hidden;
                }
                #upload-photo {
                    opacity: 0;
                    position: absolute;
                    z-index: -1;
                }
            }
        `}
`;

function ResourcesPage() {
    const router = useRouter();
    const projectId = router.query.projectId;

    const [isPageReady, setPageReadyState] = useState(false);
    const [fileUploadProgressState, setFileUploadProgressState] = useState<LoadingState>(
        LoadingState.initial,
    );

    const projectListContext = useContext(UserDashboardSummaryContext);
    const { activeProject } = projectListContext;
    const theme = useTheme();

    async function getProjectResourceSummary(projectId: string) {
        const resourceSummary = await apiRequest(
            `/api/project/${projectId}/resources`,
            GET_API_CONFIG,
        );

        projectListContext.updateActiveProject({
            ...activeProject,
            ...resourceSummary,
        });
    }

    useEffect(() => {
        if (!activeProject) {
            return;
        }

        if (activeProject.resources === undefined) {
            getProjectResourceSummary(activeProject.id);
        }
    }, [activeProject]);

    if (!activeProject && !isPageReady) {
        return (
            <UserDashboardLayout>
                <NoDataFoundPage
                    message={'Loading project information '}
                    subText={'please wait...'}
                >
                    <CircularProgress size={'80px'} />
                </NoDataFoundPage>
            </UserDashboardLayout>
        );
    }

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

    const handleFileSelected = event => {
        try {
            let files = event.target.files;
            if (!files.length) {
                alert('No file selected!');
                return;
            }
            let file = files[0];
            let reader = new FileReader();
            reader.onload = event => {
                onReaderLoad(event, file.name);
            };
            reader.readAsText(file);
        } catch (err) {
            console.error(err);
        }
    };

    async function onReaderLoad(event: any, fileName: string) {
        if (activeProject.resources) {
            const existingResource = activeProject.resources.find(
                resource => resource.sourceName === fileName,
            );
            // TODO go to resource page for updating the translation
        }

        const obj: { [key: string]: string } = JSON.parse(event.target.result);

        const input = {
            sourceName: fileName,
            projectId: projectId.toString(),
            translationKeyValueList: [],
        };
        // extract and populate key value object
        for (const [key, value] of Object.entries(obj)) {
            if (!value || !value.trim()) {
                continue;
            }

            input.translationKeyValueList.push({
                key,
                text: value,
            });
        }
        await uploadFileData(input);
    }

    async function uploadFileData(input: UploadResourceInput) {
        setFileUploadProgressState(LoadingState.loading);
        try {
            const data: { id: string; created: string } = await apiRequest(
                `/api/project/${projectId}/resources/upload`,
                {
                    ...POST_API_CONFIG,
                    body: JSON.stringify(input),
                },
            );

            // Make api call and save the source object
            const resourceSummary = {
                id: data.id, // This will come from response,
                created: data.created,
                sourceName: input.sourceName,
                totalSourceKeys: input.translationKeyValueList.length,
                translatedKeysCount: 0,
            };

            projectListContext.updateActiveProject({
                ...activeProject,
                totalResourcesCount: activeProject.totalResourcesCount + 1,
                totalSourceKeys:
                    activeProject.totalSourceKeys + input.translationKeyValueList.length,
                resources: [resourceSummary, ...activeProject.resources],
            });

            setFileUploadProgressState(LoadingState.success);
            setTimeout(() => {
                setFileUploadProgressState(LoadingState.initial);
            }, 1000);
        } catch (error) {
            // TODO handler error correctly - Toast with - Resource Already exists. Go to resource for updating the content
            console.log('error', error);
            setFileUploadProgressState(LoadingState.initial);
        }
    }

    const UploadSourceButtom = (props: { title: string }) => {
        return (
            <div className='upload-file-button'>
                <label htmlFor='upload-photo' className='upload-input-label'>
                    {props.title}
                </label>
                <input
                    type='file'
                    name='photo'
                    id='upload-photo'
                    accept='application/json'
                    onChange={handleFileSelected}
                />
            </div>
        );
    };

    const ResourceListView = () => {
        if (!activeProject.resources || !activeProject.resources.length) {
            return (
                <div className='no-source-present-container'>
                    <div className='no-source-present'>
                        <Typography variant='h6' className='message'>
                            Please upload source file to translate
                        </Typography>

                        <UploadSourceButtom title={'Select Resources'} />
                    </div>
                </div>
            );
        }

        const resourceListItems = activeProject.resources.map(resource => {
            const translationPercentage =
                (resource.translatedKeysCount / resource.totalSourceKeys) * 100;
            return (
                <ResourceList resource={resource} translationPercentage={translationPercentage} />
            );
        });

        return (
            <div className='project-resource-page-body'>
                <ResourceHeader activeProject={activeProject} />
                <div className='upload-resource-button'>
                    <UploadSourceButtom title={'Add Resource'} />
                </div>

                <div>{resourceListItems}</div>
            </div>
        );
    };

    return (
        <UserDashboardLayout>
            <ProjectResourcesPage theme={theme}>
                <WebsiteHeader title={activeProject.name} description={'Resources'} />
                <ResourceListView />
            </ProjectResourcesPage>
        </UserDashboardLayout>
    );
}

export default privateRoute(ResourcesPage);
