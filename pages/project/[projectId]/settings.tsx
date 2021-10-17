import { Button, CircularProgress, Typography, useTheme } from '@material-ui/core';
import { Check } from '@material-ui/icons';
import { Formik } from 'formik';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import GenericTextField from '../../../components/common/generic-text-field';
import WebsiteHeader from '../../../components/common/website-header';
import { UserDashboardSummaryContext } from '../../../components/contexts/UserDashboardSummaryProvider';
import UserDashboardLayout from '../../../components/layouts/UserDashboardLayout';

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
                .set-project-info {
                    padding-bottom: ${props.theme.spacing(4)}px;
                }
                .project-textfield {
                    width: 50%;
                    margin-bottom: ${props.theme.spacing(2)}px;
                }
                .save-project-buttom {
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
export default function ProjectSettingsPage(props: Props) {
    const [projectDetails, setProjectDetails] = useState({
        projectName: '',
        projectDescription: '',
    });
    const [spinnerState, setSpinnerState] = useState({
        inProgress: false,
        complete: false,
    });

    const [isPageReady, setPageReadyState] = useState(false);
    const router = useRouter();
    const theme = useTheme();

    const query = router.query;
    const projectId = query['projectId'];

    const projectListContext = useContext(UserDashboardSummaryContext);
    const { activeProject } = projectListContext;

    useEffect(() => {
        if (!activeProject) {
            return;
        }
        if (!projectDetails.projectName) {
            setProjectDetails({
                projectName: activeProject.name,
                projectDescription: activeProject.description,
            });
            setPageReadyState(true);
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

        const input = {
            id: projectId,
            name: values.projectName,
            description: values.projectDescription,
        };
        //TODO:: use update project basic details api
        // handle project name exists error
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
                                                rowsMax: 4,
                                                rows: 4,
                                            }}
                                        />
                                    </div>

                                    <Button
                                        className='save-project-buttom'
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
