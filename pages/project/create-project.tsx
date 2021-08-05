import { Container, TextField, Typography, Button, useTheme, Chip } from '@material-ui/core';
import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import WebsiteHeader from '../../components/common/website-header';
import { TARGET_LANGUAGES } from '../../shared/Constants';

const CreateProjectComponent = styled.div`
    ${props =>
        props.theme &&
        css`
            height: 1000px;
            .create-project-container {
                background-color: ${props.theme.grey[200]};
                height: 100%;
                .container {
                    background-color: ${props.theme.contrastColor};
                    padding: 0px;
                    height: 100%;
                }
                .create-project-body {
                    padding-left: 24px;
                    .set-project-info {
                        padding-top: ${props.theme.spacing(16)}px;
                        margin-bottom: ${props.theme.spacing(2)}px;
                    }
                    .project-name-textfield {
                        display: flex;
                        flex-direction: column;
                        .name-textfield {
                            width: 80%;
                        }
                        .project-name-hint-container {
                            border-style: solid;
                            width: 80%;
                            border: 1px solid ${props.theme.grey[400]};
                            padding-left: ${props.theme.spacing(4)}px;
                            background-color: ${props.theme.grey[100]};
                        }
                    }
                    .select-language-text {
                        padding-top: ${props.theme.spacing(16)}px;
                        margin-bottom: ${props.theme.spacing(2)}px;
                    }
                    .language-selection-column {
                        display: flex;
                        flex-direction: column;
                        align-items: flex-start;
                        justify-content: flex-start;
                        .language-selection-row {
                            display: flex;
                            flex-direction: row;
                            margin-bottom: ${props.theme.spacing(16)}px;
                            .default-language {
                                padding-right: ${props.theme.spacing(12)}px;
                            }
                            .target-language-column {
                                .selected-language-div {
                                    display: flex;
                                    padding-right: ${props.theme.spacing(4)}px;
                                    padding-bottom: ${props.theme.spacing(2)}px;
                                    .selected_chip {
                                        margin: ${props.theme.spacing(1)}px;
                                    }
                                }
                                .target-language-div {
                                    width: 120px;
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
            }
        `}
`;
export default function CreateProject() {
    const [projectName, setProjectName] = useState('');

    var [selectedLanguages, setLanguage] = useState([]);
    var [targetLanguages, setTargetLanguages] = useState([...TARGET_LANGUAGES]);
    const theme = useTheme();
    const handleAdd = chipToAdd => () => {
        setLanguage(selectedLanguages.concat(chipToAdd));
        setTargetLanguages(chips => chips.filter(chip => chip !== chipToAdd));
    };

    const handleDelete = chipToDelete => () => {
        setLanguage(chips => chips.filter(chip => chip !== chipToDelete));
        setTargetLanguages(targetLanguages.concat(chipToDelete));
    };
    const handleChange = event => {
        setProjectName(event.target.value);
    };
    const createProject = async () => {
        //TODO:: implement create project
    };

    return (
        <CreateProjectComponent theme={theme}>
            <div className='create-project-container'>
                <Container fixed className='container'>
                    <WebsiteHeader title={'Add new project'} description={''} />
                    <div className='create-project-body'>
                        <Typography variant='h6' component='div' className='set-project-info'>
                            Set project information
                        </Typography>
                        <div className='project-name-textfield'>
                            <a>Name (required)</a>
                            <TextField
                                id='outlined-basic'
                                className='name-textfield'
                                placeholder='Type your project name'
                                variant='outlined'
                                defaultValue={projectName}
                                onChange={handleChange}
                            />
                            <div className='project-name-hint-container'>
                                e.g. "Translation Tool". A unique project URL will be created based
                                on the name.
                            </div>
                        </div>
                        <Typography variant='h6' component='div' className='select-language-text'>
                            Select languages
                        </Typography>

                        <div className='language-selection-column'>
                            <div className='language-selection-row'>
                                <div className='default-language'>
                                    <a>Source language set to English</a>
                                    <div style={{ padding: '2px' }} />

                                    <TextField
                                        id='filled-read-only-input'
                                        variant='outlined'
                                        defaultValue='English(es)'
                                        helperText
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                        style={{
                                            width: '120px',
                                        }}
                                    />
                                </div>

                                <div className='target-language-column'>
                                    <a>Target languages</a>

                                    <div className='selected-language-div'>
                                        {selectedLanguages.map(data => {
                                            return (
                                                <Chip
                                                    key={data.code}
                                                    label={data.value}
                                                    onDelete={handleDelete(data)}
                                                    className='selected_chip'
                                                    color='primary'
                                                />
                                            );
                                        })}
                                    </div>

                                    <div className='target-language-div'>
                                        {targetLanguages.map(data => {
                                            return (
                                                <Chip
                                                    key={data.code}
                                                    label={data.value}
                                                    onClick={handleAdd(data)}
                                                    className='chip_class'
                                                    style={{ margin: '4px' }}
                                                />
                                            );
                                        })}

                                        <a>
                                            {targetLanguages.length > 0
                                                ? ''
                                                : 'No more target languages'}
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <Button
                                className='create-project-button'
                                type='submit'
                                variant='contained'
                                color='primary'
                                size='small'
                                disabled={projectName.length > 0 ? false : true}
                                onClick={createProject}
                            >
                                create
                            </Button>
                        </div>
                    </div>
                </Container>
            </div>
        </CreateProjectComponent>
    );
}
