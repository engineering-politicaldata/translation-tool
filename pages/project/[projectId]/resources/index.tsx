import { Chip, CircularProgress, LinearProgress, Typography, useTheme } from '@material-ui/core';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import NoDataFoundPage from '../../../../components/common/no-data-found-page';
import WebsiteHeader from '../../../../components/common/website-header';
import SnackBarCustom from '../../../../components/common/SnackBarCustom';
import { UserDashboardSummaryContext } from '../../../../components/contexts/user-dashboard-summary-provider';
import UserDashboardLayout from '../../../../components/layouts/user-dashboard-layout';
import { privateRoute } from '../../../../guard';
import { UploadResourceInput } from '../../../../model';
import { GET_API_CONFIG, POST_API_CONFIG } from '../../../../shared/ApiConfig';
import { APPBAR_HEIGHT, LoadingState } from '../../../../shared/Constants';
import { apiRequest } from '../../../../shared/RequestHandler';

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

const ResourceListItemView = styled.div`
    ${props =>
        props.theme &&
        css`
            cursor: pointer;
            padding: ${props.theme.spacing(3)}px ${props.theme.spacing(1)}px;
            &:hover {
                background-color: ${props.theme.grey[200]};
            }
            .chip-root {
                height: auto;
                margin-right: ${props.theme.spacing(2)}px;
            }
            .resource-item-stats {
                display: flex;
                align-items: center;
                color: ${props.theme.grey[500]};
                margin-bottom: ${props.theme.spacing(1)}px;

                .section-1 {
                    flex: 1;
                    .source-name {
                    }
                }
                .section-2 {
                    margin-right: ${props.theme.spacing(4)}px;
                }
                .section-3 {
                    display: grid;
                    grid-gap: ${props.theme.spacing(2)}px;
                    text-align: center;
                    padding: 0 ${props.theme.spacing(2)}px;
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

    const [snackBarData, openSnackbar] = useState({
        isSnackBarOpen: false,
        errorMessage: '',
    });

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

    const onSnackbarClose = () => {
        openSnackbar({
            ...snackBarData,
            isSnackBarOpen: false,
        });
    };

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
            openSnackbar({
                errorMessage: error.message,
                isSnackBarOpen: true,
            });
            setFileUploadProgressState(LoadingState.initial);
        }
    }

    const handleResourceItemClick = (resourceId: string) => {
        const hrefUrl = '/project/[projectId]/resources/[resourceId]';
        const asUrl = `/project/${projectId}/resources/${resourceId}`;
        router.push(hrefUrl, asUrl);
    };

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
                <ResourceListItemView
                    key={resource.id}
                    theme={theme}
                    onClick={() => handleResourceItemClick(resource.id)}
                >
                    <div className='resource-item-stats'>
                        <div className='section-1'>
                            <Typography variant='subtitle1'>
                                <Chip
                                    label='Source'
                                    variant='outlined'
                                    className='chip-root'
                                    color='secondary'
                                    size='small'
                                />
                                {resource.sourceName}
                            </Typography>
                            <Typography variant='caption' color='inherit'>
                                {Math.floor(translationPercentage)}% translated{' '}
                            </Typography>
                        </div>
                        <div className='section-2'>
                            <Typography variant='subtitle2' color='inherit'>
                                {' '}
                                {resource.totalSourceKeys} keys
                            </Typography>
                        </div>
                        <div className='section-3'>
                            <Typography variant='caption' color='inherit'>
                                Updated On:
                            </Typography>
                            <Typography variant='caption' color='textPrimary'>
                                {new Date(resource.created).toLocaleString()}
                            </Typography>
                        </div>
                    </div>
                    <LinearProgress
                        style={{ height: '8px' }}
                        variant='determinate'
                        color='secondary'
                        value={translationPercentage}
                    />
                </ResourceListItemView>
            );
        });

        return (
            <div className='project-resource-page-body'>
                <div className='resources-summary'>
                    <div className='section-1'>
                        <div>
                            <Typography variant='h5'>
                                {' '}
                                {activeProject.totalResourcesCount}{' '}
                            </Typography>{' '}
                            <Typography color='inherit'>Resources</Typography>
                        </div>
                        <div className='word-count'>
                            <Typography variant='h5'> {activeProject.totalSourceKeys} </Typography>{' '}
                            <Typography variant='subtitle2' color='inherit'>
                                Total Source Keys
                            </Typography>
                        </div>
                    </div>
                    <div className='section-2'>
                        <Typography variant='h5'>
                            {activeProject.totalSourceKeys - activeProject.translatedKeysCount}
                        </Typography>
                        <Typography variant='subtitle2' color='inherit'>
                            Untranslated Keys{' '}
                        </Typography>
                    </div>
                    <div className='section-3'>
                        <Typography variant='h5'>/ </Typography>
                    </div>
                    <div className='section-4'>
                        <Typography variant='h5'>{activeProject.translatedKeysCount}</Typography>
                        <Typography variant='subtitle2' color='inherit'>
                            Translated Keys
                        </Typography>
                    </div>
                </div>

                <div className='upload-resource-button'>
                    <UploadSourceButtom title={'Add Resource'} />
                </div>

                <div>{resourceListItems}</div>
                <SnackBarCustom
                    message={snackBarData.errorMessage}
                    snackbarProps={{
                        open: snackBarData.isSnackBarOpen,
                        autoHideDuration: 2000,
                        onClose: onSnackbarClose,
                    }}
                />
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
