import { Container, TextField, Typography, Button, useTheme } from '@material-ui/core';
import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import GenericTextField from '../../../components/common/generic-text-field';
import { Form, Formik, FormikHelpers } from 'formik';
import WebsiteHeader from '../../../components/common/website-header';

const ProjectSettingsComponent = styled.div`
    ${props =>
        props.theme &&
        css`
            height: 1000px;
            .project-settings-container {
                background-color: ${props.theme.grey[200]};
                height: 100%;
                .container {
                    background-color: #ffffff;
                    padding: 0px;
                    height: 100%;
                }
                .project-settings-body {
                    padding-left: 24px;
                    .set-project-info {
                        padding-top: ${props.theme.spacing(12)}px;
                        margin-bottom: ${props.theme.spacing(8)}px;
                    }
                    .project-name-textfield {
                        display: flex;
                        flex-direction: column;
                        .name-textfield {
                            width: 80%;
                            & .MuiInputBase-root {
                                height: 100%;
                                display: flex;
                                align-items: start;
                            }
                        }
                        .description-textfield {
                            width: 80%;
                            height: 120px;
                            & .MuiInputBase-root {
                                height: 100%;
                                display: flex;
                                align-items: start;
                            }
                        }
                    }
                    .create-project-button {
                        margin-top: 48px;
                        width: 120px;
                        height: 32px;
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

    const [spinnerState, setSpinnerState] = useState({
        inProgress: false,
        complete: false,
    });
    const handleFormChange = (fieldName: string, value: string) => {
        if (spinnerState.complete) {
            setSpinnerState({
                inProgress: false,
                complete: false,
            });
        }
        let newState: any = {};
        newState[fieldName] = value;
        setProjectDetails({ ...projectDetails, ...newState });
    };
    const handleSettings = async (values: {
        projectName: string;
        projectDescription: string;
    }) => {};

    const theme = useTheme();

    const validate = (values: any) => {
        const errors: any = {};
        if (!values.projectName) {
            errors['projectName'] = 'Required';
        } else if (values.projectName.length > 120) {
            (errors['projectName'] = 'Project name should not exceed more than 120 chars'),
                {
                    COUNT: 120,
                };
        }
        return errors;
    };

    return (
        <ProjectSettingsComponent theme={theme}>
            <div className='project-settings-container'>
                <Formik
                    initialValues={projectDetails}
                    enableReinitialize={true}
                    onSubmit={values => handleSettings(values)}
                    validate={validate}
                >
                    {({ errors, submitForm }) => {
                        let messageHelperView: any = errors.projectName;

                        return (
                            <Container fixed className='container'>
                                <WebsiteHeader title='Project name here' description='' />

                                <div className='project-settings-body'>
                                    <Typography
                                        variant='h6'
                                        component='div'
                                        className='set-project-info'
                                    >
                                        Project Details
                                    </Typography>
                                    <div className='project-name-textfield'>
                                        <a>Name (required)</a>
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
                                            error={messageHelperView}
                                            helperMessage={messageHelperView}
                                            textFieldProps={{
                                                multiline: true,
                                                type: 'text',
                                            }}
                                        />
                                    </div>
                                    <div style={{ paddingTop: '32px' }} />
                                    <div className='project-name-textfield'>
                                        <a>Description</a>
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
                                            textFieldProps={{
                                                multiline: true,
                                                type: 'text',
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
                                        Save
                                    </Button>
                                </div>
                            </Container>
                        );
                    }}
                </Formik>
            </div>
        </ProjectSettingsComponent>
    );
}
