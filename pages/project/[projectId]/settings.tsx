import { Container, TextField, Typography, Button, useTheme } from '@material-ui/core';
import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import GenericTextField from '../../../components/common/generic-text-field';
import { Form, Formik, FormikHelpers } from 'formik';

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
                .add-project-header {
                    display: flex;
                    background-color: #f4f5f7;
                    height: 108px;
                    align-items: center;
                    justify-content: flex-start;
                    padding: ${props.theme.spacing(2)}px;
                    padding-left: ${props.theme.spacing(6)}px;
                    .my-circle {
                        content: attr(data-letters);
                        display: inline-block;
                        font-size: 1em;
                        width: 2.5em;
                        height: 2.5em;
                        line-height: 2.5em;
                        text-align: center;
                        border-radius: 50%;
                        background: plum;
                        vertical-align: middle;
                        color: white;
                    }
                    .add-circle-icon {
                        font-size: 32px;
                    }
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

const dropDownStyle = {
    chips: { background: '#4b4e52' },
    searchBox: {
        minHeight: '40px',
    },
    option: {
        background: '#4b4e52',
        color: '#ffffff',
    },
};

export default function ProjectSettingsPage() {
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
        console.log(values, 'manu us bjs');
        if (!values.projectName) {
            errors['projectName'] = 'Required';
        } else if (values.projectName.length > 120) {
            (errors['projectName'] = 'Project name should not exceed more than 120 chars'),
                {
                    COUNT: 120,
                };
        }
        console.log(errors, 'manu us errr');
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
                                <div className='title-column' style={{ flexDirection: 'column' }}>
                                    <Typography
                                        variant='h5'
                                        component='div'
                                        className='add-project-header'
                                    >
                                        <p data-letters='MN' className='my-circle'>
                                            {' '}
                                            OC
                                        </p>{' '}
                                        {/*need to get initial values by using title */}
                                        <div style={{ paddingRight: '8px' }} />
                                        Project Name here
                                    </Typography>
                                </div>

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
