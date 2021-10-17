import {
    Button,
    Chip,
    CircularProgress,
    FormHelperText,
    TextField,
    Typography,
    useTheme,
} from '@material-ui/core';
import { Formik } from 'formik';
import { useRouter } from 'next/router';
import React, { useContext, useState } from 'react';
import styled, { css } from 'styled-components';
import useSWR from 'swr';
import GenericTextField from '../../components/common/generic-text-field';
import WebsiteHeader from '../../components/common/website-header';
import { UserDashboardSummaryContext } from '../../components/contexts/UserDashboardSummaryProvider';
import { GET_API_CONFIG } from '../../lib/backend.config';
import { CreateProjectInput, Language } from '../../lib/model';

const CreateProjectComponent = styled.div`
    ${props =>
        props.theme &&
        css`
            min-height: 100vh;
            display: flex;
            justify-content: center;
            background-color: ${props.theme.grey[200]};
            padding-bottom: ${props.theme.spacing(8)}px;

            .create-project-container {
                background-color: ${props.theme.contrastColor};
                width: 800px;

                .progress {
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .create-project-body {
                    padding: ${props.theme.spacing(8)}px;
                    .set-project-info {
                        padding-bottom: ${props.theme.spacing(4)}px;
                    }
                    .project-textfield {
                        width: 50%;
                        margin-bottom: ${props.theme.spacing(2)}px;
                    }
                    .select-language-text {
                        margin-top: ${props.theme.spacing(4)}px;
                        margin-bottom: ${props.theme.spacing(2)}px;
                    }
                    .language-selection-section {
                        display: grid;
                        grid-template-columns: 1fr 1fr 1fr;
                        margin-bottom: ${props.theme.spacing(16)}px;
                        grid-gap: ${props.theme.spacing(8)}px;
                        .source-language {
                            display: grid;
                            grid-template-rows: auto 1fr;
                            grid-gap: ${props.theme.spacing(2)}px;
                        }
                        .selected-target-languages {
                            display: grid;
                            grid-template-rows: auto 1fr;
                            grid-gap: ${props.theme.spacing(2)}px;
                            .selected_chip {
                                margin: ${props.theme.spacing(1)}px;
                            }
                            .selected-language-container {
                                padding: ${props.theme.spacing(2)}px;
                                border: 1px solid ${props.theme.black};
                            }
                        }
                        .remaining-languages {
                            display: grid;
                            grid-template-rows: auto 1fr;
                            grid-gap: ${props.theme.spacing(2)}px;
                            .remaining-languages-container {
                                background-color: ${props.theme.grey[100]};
                                min-height: 32px;
                                padding: ${props.theme.spacing(2)}px;
                                border: 1px solid ${props.theme.black};
                            }
                        }
                    }
                    .create-project-button {
                        width: 120px;
                    }
                }
            }
        `}
`;

export default function CreateProject() {
    const projectListContext = useContext(UserDashboardSummaryContext);
    const [projectData, setProjectData] = useState({
        projectName: '',
        projectDescription: '',
        sourceLanguage: null,
        targetLanguages: [],
    });

    const router = useRouter();
    const theme = useTheme();

    const { data, error } = useSWR<{ languages: Language[] }>(['/api/languages', GET_API_CONFIG]);

    if (error)
        return (
            <CreateProjectComponent theme={theme}>
                <div className='create-project-container'>
                    <WebsiteHeader title={'Add new project'} description={''} />
                    <div className='progress'>
                        <div>failed to load languages</div>
                    </div>
                </div>
            </CreateProjectComponent>
        );

    if (!data) {
        return (
            <CreateProjectComponent theme={theme}>
                <div className='create-project-container'>
                    <WebsiteHeader title={'Add new project'} description={''} />
                    <div className='progress'>
                        <CircularProgress size={'80px'} />
                    </div>
                </div>
            </CreateProjectComponent>
        );
    }
    let allLanguages = data.languages;

    const initializeSourceLanguage = () => {
        const sourceLanguage = allLanguages.find(item => (item.code = 'en'));
        setProjectData({
            ...projectData,
            sourceLanguage,
        });
    };

    if (!projectData.sourceLanguage) {
        initializeSourceLanguage();
    }
    const addTargetLanguage = lang => () => {
        setProjectData({
            ...projectData,
            targetLanguages: [...projectData.targetLanguages, lang],
        });
    };

    const deleteTargetLanguage = lang => () => {
        setProjectData({
            ...projectData,
            targetLanguages: projectData.targetLanguages.filter(tLang => tLang.id !== lang.id),
        });
    };

    const handleFormChange = (fieldName: string, value: string) => {
        let newState: any = {};
        newState[fieldName] = value;
        setProjectData({ ...projectData, ...newState });
    };

    const createProject = async (values: any) => {
        const input: CreateProjectInput = {
            // userId: 'default_user_id', // TODO add user id
            name: values.projectName,
            description: values.projectDescription,
            sourceLanguageId: values.sourceLanguage.id,
            targetLanguageIds: values.targetLanguages.map(lang => lang.id),
        };
        //TODO: handle project name exists error
        const res = await fetch('/api/project/create', {
            method: 'POST',
            body: JSON.stringify(input),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        });
        const data: { id: string } = await res.json();

        // redirect to project page
        projectListContext.updateProjectList({
            id: data.id,
            name: input.name,
            description: input.description,
        });
        router.replace('/');
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

        if (values.sourceLanguage === null) {
            errors['sourceLanguage'] = 'please select source language';
        }

        if (values.targetLanguages === null || !values.targetLanguages.length) {
            errors['targetLanguages'] = 'please select target language';
        }
        return errors;
    };
    return (
        <CreateProjectComponent theme={theme}>
            <div className='create-project-container'>
                <WebsiteHeader title={'Add new project'} description={''} />
                <Formik
                    initialValues={projectData}
                    enableReinitialize={true}
                    onSubmit={values => createProject(values)}
                    validate={validate}
                >
                    {({ errors, submitForm }) => (
                        <div className='create-project-body'>
                            <Typography variant='h6' component='div' className='set-project-info'>
                                Set project information
                            </Typography>

                            <div className='project-textfield'>
                                <GenericTextField
                                    key={'projectName'}
                                    defaultValue={projectData.projectName}
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
                                    defaultValue={projectData.projectDescription}
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
                                        placeholder: 'Please describe the project in few words',
                                        multiline: true,
                                        type: 'text',
                                        rowsMax: 4,
                                        rows: 4,
                                    }}
                                />
                            </div>

                            <Typography
                                variant='h6'
                                component='div'
                                className='select-language-text'
                            >
                                Select languages
                            </Typography>

                            <div className='language-selection-section'>
                                <div className='source-language'>
                                    <p>
                                        Source language: <b>set to English</b>
                                    </p>

                                    {projectData.sourceLanguage && (
                                        <TextField
                                            id='filled-read-only-input'
                                            variant='outlined'
                                            value={projectData.sourceLanguage.name}
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                            style={{
                                                width: '120px',
                                            }}
                                        />
                                    )}
                                </div>

                                <div className='remaining-languages'>
                                    <p>Available Languages</p>
                                    <div className='remaining-languages-container'>
                                        {allLanguages.map(data => {
                                            if (data.id === projectData.sourceLanguage.id) {
                                                return null;
                                            }
                                            const index = projectData.targetLanguages.findIndex(
                                                targetLang => targetLang.id === data.id,
                                            );
                                            if (index > -1) {
                                                return null;
                                            }
                                            return (
                                                <Chip
                                                    key={data.code}
                                                    label={data.name}
                                                    onClick={addTargetLanguage(data)}
                                                    className='chip_class'
                                                    style={{ margin: '4px' }}
                                                />
                                            );
                                        })}
                                        {projectData.targetLanguages.length ===
                                            allLanguages.length - 1 && 'No more languages'}
                                    </div>
                                </div>

                                <div className='selected-target-languages'>
                                    <p>Target languages</p>
                                    <div className='selected-language-container'>
                                        {allLanguages.map(lng => {
                                            const index = projectData.targetLanguages.findIndex(
                                                targetLang => targetLang.id === lng.id,
                                            );
                                            if (index === -1) {
                                                return null;
                                            }
                                            return (
                                                <Chip
                                                    key={lng.code}
                                                    label={lng.name}
                                                    onDelete={deleteTargetLanguage(lng)}
                                                    className='selected_chip'
                                                    color='primary'
                                                />
                                            );
                                        })}
                                        {projectData.targetLanguages.length === 0 &&
                                            'No target languages'}
                                    </div>
                                    <FormHelperText error={!!errors.targetLanguages}>
                                        {errors.targetLanguages}
                                    </FormHelperText>
                                </div>
                            </div>
                            <Button
                                className='create-project-button'
                                type='submit'
                                variant='contained'
                                color='primary'
                                size='small'
                                onClick={submitForm}
                                disableElevation
                            >
                                create
                            </Button>
                        </div>
                    )}
                </Formik>
            </div>
        </CreateProjectComponent>
    );
}
