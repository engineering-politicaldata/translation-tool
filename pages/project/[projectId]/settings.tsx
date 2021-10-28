import { Button, CircularProgress, Typography, useTheme } from '@material-ui/core';
import { Check } from '@material-ui/icons';
import { Formik } from 'formik';
import React, { useContext, useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import GenericTextField from '../../../components/common/generic-text-field';
import WebsiteHeader from '../../../components/common/website-header';
import { UserDashboardSummaryContext } from '../../../components/contexts/user-dashboard-summary-provider';
import UserDashboardLayout from '../../../components/layouts/user-dashboard-layout';
import { privateRoute } from '../../../guard';
import { POST_API_CONFIG } from '../../../shared/ApiConfig';
import { apiRequest } from '../../../shared/RequestHandler';

const ProjectSettingsComponent = styled.div`
    ${props =>
        props.theme &&
        css`
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            .project-settings-body {
                flex: 1;
                padding: ${props.theme.spacing(8)}px;

                .progress {
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .set-project-info {
                    padding-bottom: ${props.theme.spacing(4)}px;
                }
                .project-textfield {
                    width: 50%;
                    margin-bottom: ${props.theme.spacing(2)}px;
                }
                .save-project-button {
                    width: 100px;
                    height: 40px;
                }
            }
        `}
`;

type Props = {
    title: string;
    description: string;
};
function ProjectSettingsPage(props: Props) {
    const [projectDetails, setProjectDetails] = useState({
        id: null,
        projectName: '',
        projectDescription: '',
    });
    const [spinnerState, setSpinnerState] = useState({
        inProgress: false,
        complete: false,
    });

    const [isPageReady, setPageReadyState] = useState(false);
    const theme = useTheme();

    const projectListContext = useContext(UserDashboardSummaryContext);
    const { activeProject } = projectListContext;

    useEffect(() => {
        if (!activeProject) {
            return;
        }

        if (activeProject.id !== projectDetails.id) {
            setPageReadyState(false);
            setTimeout(() => {
                setProjectDetails({
                    id: activeProject.id,
                    projectName: activeProject.name,
                    projectDescription: activeProject.description,
                });
                setPageReadyState(true);
            }, 500);
        }
    }, [activeProject]);

    const handleFormChange = (fieldName: string, value: string) => {
        let newState: any = {};
        newState[fieldName] = value;
        setProjectDetails({ ...projectDetails, ...newState });
    };

    const updateProjectBasicDetails = async (values: {
        projectName: string;
        projectDescription: string;
    }) => {
        setSpinnerState({
            inProgress: true,
            complete: false,
        });

        // TODO verify if name is not already exists
        try {
            const input = {
                id: activeProject.id,
                name: values.projectName,
                description: values.projectDescription,
            };

            await apiRequest('/api/project/update', {
                ...POST_API_CONFIG,
                body: JSON.stringify(input),
            });

            setTimeout(() => {
                setSpinnerState({
                    inProgress: false,
                    complete: true,
                });
            }, 1000);

            setTimeout(() => {
                setSpinnerState({
                    inProgress: false,
                    complete: false,
                });
                projectListContext.updateActiveProject({
                    ...activeProject,
                    name: values.projectName,
                    description: values.projectDescription,
                });
            }, 3000);
        } catch (error) {
            // handle project name exists error
            setTimeout(() => {
                setSpinnerState({
                    inProgress: false,
                    complete: false,
                });
            });
        }
    };

    const validate = (values: any) => {
        const errors: any = {};
        if (!values.projectName) {
            errors['projectName'] = 'Required';
        } else if (values.projectName.length > 120) {
            errors['projectName'] = 'Must not be more than 120 chars';
        }

        if (values.projectDescription.length > 500) {
            errors['projectDescription'] = 'Must not be more than 500 chars';
        }

        return errors;
    };

    if (!activeProject || !isPageReady) {
        return (
            <UserDashboardLayout>
                <ProjectSettingsComponent theme={theme}>
                    <WebsiteHeader title='Loading...' description='' />
                    <div className='project-settings-body'>
                        <div className='progress'>
                            <CircularProgress size={'80px'} />
                        </div>
                    </div>
                </ProjectSettingsComponent>
            </UserDashboardLayout>
        );
    }
    return (
        <UserDashboardLayout>
            <ProjectSettingsComponent theme={theme}>
                <Formik
                    initialValues={projectDetails}
                    enableReinitialize={true}
                    onSubmit={values => updateProjectBasicDetails(values)}
                    validate={validate}
                >
                    {({ errors, submitForm }) => {
                        return (
                            <>
                                <WebsiteHeader
                                    title={activeProject.name}
                                    description={activeProject.description}
                                />

                                <div className='project-settings-body'>
                                    <Typography
                                        variant='h6'
                                        component='div'
                                        className='set-project-info'
                                    >
                                        Project Details
                                    </Typography>

                                    <div className='project-textfield'>
                                        <GenericTextField
                                            key={'projectName'}
                                            defaultValue={projectDetails.projectName}
                                            fieldName={'projectName'}
                                            onChange={(field, value, event) => {
                                                handleFormChange(field, value);
                                            }}
                                            onReset={field => {
                                                handleFormChange(field, '');
                                            }}
                                            label={'Name'}
                                            error={!!errors.projectName}
                                            helperMessage={errors.projectName}
                                            textFieldProps={{
                                                type: 'text',
                                            }}
                                        />
                                    </div>

                                    <div className='project-textfield'>
                                        <GenericTextField
                                            key={'projectDescription'}
                                            defaultValue={projectDetails.projectDescription}
                                            fieldName={'projectDescription'}
                                            onChange={(field, value, event) => {
                                                handleFormChange(field, value);
                                            }}
                                            onReset={field => {
                                                handleFormChange(field, '');
                                            }}
                                            label={'Description'}
                                            error={!!errors.projectDescription}
                                            helperMessage={errors.projectDescription}
                                            textFieldProps={{
                                                placeholder:
                                                    'Please describe the project in few words',
                                                multiline: true,
                                                type: 'text',
                                                maxRows: 4,
                                                minRows: 4,
                                            }}
                                        />
                                    </div>

                                    <Button
                                        className='save-project-button'
                                        type='submit'
                                        variant='contained'
                                        color='primary'
                                        onClick={submitForm}
                                        disableElevation
                                    >
                                        {spinnerState.inProgress && (
                                            <CircularProgress
                                                color='inherit'
                                                size={20}
                                                thickness={3}
                                                variant='indeterminate'
                                            ></CircularProgress>
                                        )}
                                        {spinnerState.complete && <Check />}
                                        {!spinnerState.inProgress &&
                                            !spinnerState.complete &&
                                            'Save'}
                                    </Button>
                                </div>
                            </>
                        );
                    }}
                </Formik>
            </ProjectSettingsComponent>
        </UserDashboardLayout>
    );
}

export default privateRoute(ProjectSettingsPage);
