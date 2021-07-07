import { Container, TextField, Typography, Button, useTheme } from '@material-ui/core';
import { AddCircleOutline } from '@material-ui/icons';
import Multiselect from 'multiselect-react-dropdown';
import React, { useState } from 'react';
import styled, { css } from 'styled-components';

const languages = ['Spanish(es)', 'French(fr)', 'Kannada(kn)'];

const CreateProjectComponent = styled.div`
    ${props =>
        props.theme &&
        css`
            height: 1000px;
            .create-project-container {
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
                    .add-circle-icon {
                        font-size: 32px;
                    }
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
                            border: 1px solid #777777;
                            padding-left: ${props.theme.spacing(4)}px;
                            background-color: #f1f1f1;
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
                            .separation-text {
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                padding-right: 40px;
                            }
                            .target-language-div {
                                padding-top: ${props.theme.spacing(1)}px;
                                width: 240px;
                            }
                        }
                        .create-project-button {
                            width: 120px;
                            height: 32px;
                        }
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

export default function CreateProject() {
    const [projectName, setProjectName] = useState({
        projectName: '',
    });

    var [language, setLanguage] = useState([]);
    var onSelect = event => {
        setLanguage = event;
        console.log(setLanguage);
    };
    var onRemove = event => {
        setLanguage = event;
        console.log(setLanguage);
    };
    const theme = useTheme();

    return (
        <CreateProjectComponent theme={theme}>
            <div className='create-project-container'>
                <Container fixed className='container'>
                    <Typography variant='h5' component='div' className='add-project-header'>
                        <AddCircleOutline className='add-circle-icon' />
                        <div style={{ paddingRight: '8px' }} />
                        Add a new project
                    </Typography>

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
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                        style={{
                                            width: '120px',
                                        }}
                                    />
                                </div>
                                <div className='separation-text'>to</div>

                                <div className='target-language-column'>
                                    <a>Target languages</a>

                                    <div className='target-language-div'>
                                        <Multiselect
                                            options={languages}
                                            isObject={false}
                                            showArrow={true}
                                            keepSearchTerm={true}
                                            placeholder='Choose target language'
                                            onSelect={onSelect}
                                            onRemove={onRemove}
                                            style={dropDownStyle}
                                        />
                                    </div>
                                </div>
                            </div>

                            <Button
                                className='create-project-button'
                                type='submit'
                                variant='contained'
                                color='primary'
                                // onClick={submitForm}
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
