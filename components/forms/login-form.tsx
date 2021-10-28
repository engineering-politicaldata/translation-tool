import { Button, CircularProgress, Typography, useTheme } from '@material-ui/core';
import { Check } from '@material-ui/icons';
import { Formik } from 'formik';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { User, UserLoginInput } from '../../model';
import { POST_API_CONFIG } from '../../shared/ApiConfig';
import { APP_ROUTES, LoadingState } from '../../shared/Constants';
import { apiRequest } from '../../shared/RequestHandler';
import { LoginSchema } from '../../utils/validation-schemas';
import GenericTextField from '../common/generic-text-field';

const SignInComponent = styled.div`
    ${props =>
        props.theme &&
        css`
            .form-container {
                justify-content: center;
                align-items: center;
                flex-direction: column;
                min-width: 450px;
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

                .login-button {
                    color: #fff;
                    height: 40px;
                }
            }
        `}
`;

export const LoginForm = () => {
    const [loginForm, setContactForm] = useState({
        email: '',
        password: '',
    });
    const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.initial);
    const router = useRouter();

    const handleLogin = async (values: { email: string; password: string }) => {
        setLoadingState(LoadingState.loading);
        try {
            const input: UserLoginInput = values;
            const data: { user: User } = await apiRequest('/api/auth/login', {
                ...POST_API_CONFIG,
                body: JSON.stringify(input),
            });
            setLoadingState(LoadingState.success);
            setTimeout(() => {
                const { query } = router;
                if (query['redirectUri']) {
                    window.location.replace(String(query['redirectUri']));
                } else {
                    router.replace({
                        pathname: APP_ROUTES.LANDING,
                    });
                }
            }, 500);
        } catch (error) {
            console.log(error);

            setLoadingState(LoadingState.initial);
        }
    };

    const handleFormChange = (fieldName: string, value: string) => {
        if (loadingState === LoadingState.success) {
            setLoadingState(LoadingState.initial);
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
                                type: 'password',
                                label: 'Password',
                            }}
                        />
                        <div style={{ padding: 10 }} />
                        <Button
                            className='login-button'
                            type='submit'
                            variant='contained'
                            color='primary'
                            onClick={submitForm}
                            fullWidth
                            disableElevation
                        >
                            {loadingState === LoadingState.loading && (
                                <CircularProgress
                                    color='inherit'
                                    size={20}
                                    thickness={3}
                                    variant='indeterminate'
                                ></CircularProgress>
                            )}
                            {loadingState === LoadingState.success && <Check />}
                            {loadingState === LoadingState.initial && 'Login'}
                        </Button>

                        {/* <div className='sign-up-text'>
                            <a>Don't have an account? </a>
                            <Link href='/auth/sign-up'>
                                <a>Sign up</a>
                            </Link>
                        </div> */}
                    </div>
                )}
            </Formik>
        </SignInComponent>
    );
};
