import { Form, Formik, FormikHelpers } from 'formik';
import Link from 'next/link';
import React, { useState } from 'react';
import { Button, Typography, useTheme } from '@material-ui/core';
import GenericTextField from '../common/generic-text-field';
import { Grid } from '@material-ui/core';
import styled, { css } from 'styled-components';
import { string, object } from 'yup';
import { EMAIL_VALIDATION_REGEX } from '../../shared/Constants';
import { LoginSchema } from '../../schemas/login-schemas';

const SignInComponent = styled.div`
    ${props =>
        props.theme &&
        css`
            display: flex;
            justify-content: center;
            align-items: center;
            padding-top: 80px;
            max-width: 700px;

            .form-container {
                .sign-up-text {
                    padding-top: 20px;
                    flex-direction: row;
                }
                .sign-in-heading {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding-bottom: 10px;
                }
                justify-content: center;
                align-items: center;
                flex-direction: column;
                width: 450px;
            }
        `}
`;

export const LoginForm = () => {
    const handleLogin = async (values: { email: string; password: string }) => {
        console.log(values);
        //TODo:: implement sign-in
    };

    const [loginForm, setContactForm] = useState({
        email: '',
        password: '',
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
        setContactForm({ ...loginForm, ...newState });
    };

    const theme = useTheme();
    return (
        <SignInComponent theme={theme}>
            <Formik
                initialValues={loginForm}
                enableReinitialize={true}
                onSubmit={values => handleLogin(values)}
                validationSchema={LoginSchema}
            >
                {({ errors, submitForm }) => (
                    <div className='form-container'>
                        <div className='sign-in-heading'>
                            <Typography variant='h4' color='primary'>
                                Translation Tool
                            </Typography>
                        </div>
                        <div style={{ padding: 10 }} />
                        <GenericTextField
                            key={'email'}
                            defaultValue={loginForm.email}
                            fieldName={'email'}
                            onChange={(field, value, event) => {
                                handleFormChange(field, value);
                            }}
                            onReset={field => {
                                handleFormChange(field, '');
                            }}
                            label={'Email address'}
                            error={!!errors.email}
                            helperMessage={errors.email}
                            textFieldProps={{
                                type: 'text',
                                label: 'Email address',
                            }}
                        />
                        <div style={{ padding: 10 }} />
                        <GenericTextField
                            key={'password'}
                            defaultValue={loginForm.password}
                            fieldName={'password'}
                            onChange={(field, value, event) => {
                                handleFormChange(field, value);
                            }}
                            onReset={field => {
                                handleFormChange(field, '');
                            }}
                            label={'Password'}
                            error={!!errors.password}
                            helperMessage={errors.password}
                            textFieldProps={{
                                type: 'text',
                                label: 'Password',
                            }}
                        />
                        <div style={{ padding: 10 }} />
                        <Button
                            type='submit'
                            variant='contained'
                            color='primary'
                            onClick={submitForm}
                            fullWidth
                        >
                            Login
                        </Button>

                        <div className='sign-up-text'>
                            <a>Don't have an account? </a>
                            <Link href='/auth/sign-up'>
                                <a>Sign up</a>
                            </Link>
                        </div>
                    </div>
                )}
            </Formik>
        </SignInComponent>
    );
};
