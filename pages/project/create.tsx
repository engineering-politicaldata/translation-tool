import {
    Button,
    Chip,
    CircularProgress,
    FormHelperText,
    Typography,
    useTheme,
    Input,
    InputLabel,
    MenuItem,
    FormControl,
    Select,
    makeStyles,
} from '@material-ui/core';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import { Formik } from 'formik';
import { useRouter } from 'next/router';
import React, { useContext, useState } from 'react';
import styled, { css } from 'styled-components';
import useSWR from 'swr';
import GenericTextField from '../../components/common/generic-text-field';
import SnackBarCustom from '../../components/common/SnackBarCustom';
import WebsiteHeader from '../../components/common/website-header';
import { UserDashboardSummaryContext } from '../../components/contexts/user-dashboard-summary-provider';
import { CreateProjectInput, Language } from '@data-model';
import { privateRoute } from '../../guard';
import { GET_API_CONFIG, POST_API_CONFIG } from '../../shared/ApiConfig';
import { apiRequest } from '../../shared/RequestHandler';
import { APPBAR_HEIGHT } from '../../shared/Constants';

const CreateProjectComponent = styled.div`
    ${props =>
        props.theme &&
        css`
            min-height: calc(100vh - ${APPBAR_HEIGHT});
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
                        margin-bottom: ${props.theme.spacing(2)}px;
                    }
                    .select-language-text {
                        margin-top: ${props.theme.spacing(4)}px;
                        margin-bottom: ${props.theme.spacing(2)}px;
                    }
                    .source-language-icon {
                        font-size: 19px;
                        margin-top: ${props.theme.spacing(4)}px;
                        margin-bottom: -${props.theme.spacing(1)}px;
                    }
                    .source-language-text {
                        font-size: 12px;
                        color: ${props.theme.grey[500]};
                    }
                    .language-selection-section {
                        margin-bottom: ${props.theme.spacing(16)}px;
                    }
                    .create-btn {
                        display: flex;
                        justify-content: right;
                    }
                    .create-project-button {
                        width: 120px;
                    }
                }
            }
        `}
`;

const useStyles = makeStyles(theme => ({
    formControl: {
        margin: theme.spacing(1),
        width: 300,
    },
    chips: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    chip: {
        margin: 6,
    },
    noLabel: {
        marginTop: theme.spacing(3),
    },
    selectRoot: {
        minHeight: 40,
    },
    selectRootInput: {
        minHeight: 40,
    },
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 0;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
            paddingRight: 0,
        },
    },
};

const getStyles = (id, languangeIdArray, theme) => {
    return {
        fontWeight: languangeIdArray.indexOf(id) === -1 ? 500 : 600,
    };
};

function CreateProject() {
    const projectListContext = useContext(UserDashboardSummaryContext);
    const [projectData, setProjectData] = useState({
        projectName: '',
        projectDescription: '',
        sourceLanguage: null,
        targetLanguages: [],
        errorMessage: '',
    });

    const [snackBarData, openSnackbar] = useState({
        isSnackBarOpen: false,
        errorMessage: '',
    });

    const router = useRouter();
    const theme = useTheme();
    const classes = useStyles();

    const handleChange = event => {
        setProjectData({
            ...projectData,
            targetLanguages: event.target.value,
        });
    };

    const { data, error } = useSWR<{ languages: Language[] }>(['/api/languages', GET_API_CONFIG]);

    if (error)
        return (
            <CreateProjectComponent theme={theme}>
                <div className='create-project-container'>
                    <WebsiteHeader title={'Add New Project'} description={''} />
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
                    <WebsiteHeader title={'Add New Project'} description={''} />
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

    const handleFormChange = (fieldName: string, value: string) => {
        let newState: any = {};
        newState[fieldName] = value;
        setProjectData({ ...projectData, ...newState });
    };

    const onSnackbarClose = () => {
        openSnackbar({
            isSnackBarOpen: false,
            errorMessage: '',
        });
    };

    const createProject = async (values: any) => {
        const input: CreateProjectInput = {
            name: values.projectName,
            description: values.projectDescription,
            sourceLanguageId: values.sourceLanguage.id,
            targetLanguageIds: values.targetLanguages,
        };

        try {
            const data: { id: string } = await apiRequest('/api/project/create', {
                ...POST_API_CONFIG,
                body: JSON.stringify(input),
            });

            projectListContext.updateProjectList({
                id: data.id,
                name: input.name,
                description: input.description,
            });

            // redirect to project page
            router.replace(`/project/${data.id}/resources`);
        } catch (err) {
            openSnackbar({
                errorMessage: err.message,
                isSnackBarOpen: true,
            });
        }
    };

    const validate = (values: any) => {
        const errors: any = {};
        if (!values.projectName) {
            errors['projectName'] = 'Project Name is Mandatory';
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
                <WebsiteHeader title={''} description={'Add New Project'} />
                <Formik
                    initialValues={projectData}
                    enableReinitialize={true}
                    onSubmit={values => createProject(values)}
                    validate={validate}
                >
                    {({ errors, submitForm }) => (
                        <div className='create-project-body'>
                            <Typography variant='h6' component='div' className='set-project-info'>
                                Set Project Information
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
                                        placeholder: 'Please describe the Project in few words',
                                        multiline: true,
                                        type: 'text',
                                        maxRows: 4,
                                        minRows: 4,
                                    }}
                                />
                            </div>

                            <Typography
                                variant='h6'
                                component='div'
                                className='select-language-text'
                            >
                                Select Target Languages{' '}
                                <span className='source-language-text'>
                                    {' '}
                                    <InfoOutlinedIcon
                                        className='source-language-icon'
                                        color='secondary'
                                    />{' '}
                                    Source language is set to English by default{' '}
                                </span>
                            </Typography>

                            <div className='language-selection-section'>
                                <FormControl className={classes.formControl}>
                                    <InputLabel id='demo-multiple-chip-label'>
                                        Target Languages
                                    </InputLabel>
                                    <Select
                                        className={classes.selectRoot}
                                        labelId='demo-multiple-chip-label'
                                        id='demo-multiple-chip'
                                        multiple
                                        value={projectData.targetLanguages}
                                        onChange={handleChange}
                                        style={{ minHeight: '40px' }}
                                        input={
                                            <Input
                                                id='select-multiple-chip'
                                                className={classes.selectRootInput}
                                            />
                                        }
                                        renderValue={(selected: any[]) => (
                                            <div className={classes.chips}>
                                                {selected.map(languageId => {
                                                    const selectedLanguage = allLanguages.find(
                                                        language => language.id === languageId,
                                                    );
                                                    return (
                                                        <Chip
                                                            key={languageId}
                                                            label={selectedLanguage.name}
                                                            className={classes.chip}
                                                        />
                                                    );
                                                })}
                                            </div>
                                        )}
                                        MenuProps={MenuProps}
                                    >
                                        {allLanguages.map(data => {
                                            if (data.id === projectData.sourceLanguage.id) {
                                                return null;
                                            }

                                            return (
                                                <MenuItem
                                                    key={data.id}
                                                    value={data.id}
                                                    style={getStyles(
                                                        data.id,
                                                        projectData.targetLanguages,
                                                        theme,
                                                    )}
                                                >
                                                    {data.name}
                                                </MenuItem>
                                            );
                                        })}
                                    </Select>
                                </FormControl>

                                <FormHelperText error={!!errors.targetLanguages}>
                                    {errors.targetLanguages}
                                </FormHelperText>
                            </div>
                            <div className='create-btn'>
                                <Button
                                    className='create-project-button'
                                    type='submit'
                                    variant='contained'
                                    color='secondary'
                                    size='small'
                                    onClick={submitForm}
                                    disableElevation
                                >
                                    <Typography color={'inherit'}>create</Typography>
                                </Button>
                            </div>
                        </div>
                    )}
                </Formik>
                <SnackBarCustom
                    message={snackBarData.errorMessage}
                    snackbarProps={{
                        open: snackBarData.isSnackBarOpen,
                        autoHideDuration: 2000,
                        onClose: onSnackbarClose,
                    }}
                />
            </div>
        </CreateProjectComponent>
    );
}

export default privateRoute(CreateProject);
