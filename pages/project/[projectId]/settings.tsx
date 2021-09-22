import { Button, CircularProgress, Typography, useTheme } from '@material-ui/core';
import { Check } from '@material-ui/icons';
import { Formik } from 'formik';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import GenericTextField from '../../../components/common/generic-text-field';
import WebsiteHeader from '../../../components/common/website-header';

const ProjectSettingsComponent = styled.div`
    ${props =>
        props.theme &&
        css`
            min-height: 100vh;
            display: flex;
            justify-content: center;
            background-color: ${props.theme.grey[200]};
            padding-bottom: ${props.theme.spacing(8)}px;
            .project-settings-container {
                background-color: ${props.theme.contrastColor};
                width: 800px;

                .project-settings-body {
                    padding: ${props.theme.spacing(8)}px;
                    .set-project-info {
                        padding-bottom: ${props.theme.spacing(4)}px;
                    }
                    .project-textfield {
                        width: 50%;
                        margin-bottom: ${props.theme.spacing(2)}px;
                    }
                    .create-project-button {
                        width: 100px;
                        height: 40px;
                    }
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
    const [savedProjectData, updateSavedProjectData] = useState(null);
    const [spinnerState, setSpinnerState] = useState({
        inProgress: false,
        complete: false,
    });

    const [isPageReady, setPageReadyState] = useState(false);
    const router = useRouter();
    const theme = useTheme();

    const query = router.query;
    const projectId = query['projectId'];

    useEffect(() => {
        // api call to fetch project details by id
        const projectDetailsResponse = {
            id: projectId,
            name: 'Dummy Name',
            description: 'Dummy Project Description',
        };
        setProjectDetails({
            projectName: projectDetailsResponse.name,
            projectDescription: projectDetailsResponse.description,
        });
        updateSavedProjectData(projectDetailsResponse);
        setPageReadyState(true);
    }, []);

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
            updateSavedProjectData(input);
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

    if (!isPageReady) {
        return (
            <ProjectSettingsComponent theme={theme}>
                <div className='project-settings-container'>
                    <WebsiteHeader title='Loading...' description='' />
                </div>
            </ProjectSettingsComponent>
        );
    }
    return (
        <ProjectSettingsComponent theme={theme}>
            <div className='project-settings-container'>
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
                                    title={savedProjectData.name}
                                    description={savedProjectData.description}
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
                                        className='create-project-button'
                                        type='submit'
                                        variant='contained'
                                        color='primary'
                                        onClick={submitForm}
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
            </div>
        </ProjectSettingsComponent>
    );
}
