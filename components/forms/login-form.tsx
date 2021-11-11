import { Button, CircularProgress, Typography, useTheme } from '@material-ui/core';
import { Check } from '@material-ui/icons';
import { Formik } from 'formik';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { User, UserLoginInput } from '@data-model';
import { POST_API_CONFIG } from '../../shared/ApiConfig';
import { APP_ROUTES, LoadingState } from '../../shared/Constants';
import { apiRequest } from '../../shared/RequestHandler';
import { LoginSchema } from '../../utils/validation-schemas';
import GenericTextField from '../common/generic-text-field';
import Visibility from '@material-ui/icons/Visibility';
import { ErrorCodes } from '../../error-codes';

const SignInComponent = styled.div`
    ${props =>
        props.theme &&
        css`
            display: flex;
            width: 100%;

            .form-container {
                justify-content: center;
                align-items: center;
                flex-direction: column;
                min-width: 450px;

                .sign-in-heading {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding-bottom: 10px;
                }

                .login-button {
                    color: #fff;
                    height: 40px;
                    background: ${props.theme.secondary[500]};
                }
            }
        `}
`;

export const LoginForm = () => {
    const [apiError, setApiError] = useState<{
        errorCode: ErrorCodes;
        message: string;
    }>(undefined);

    const [loginForm, setContactForm] = useState({
        email: '',
        password: '',
        showPassword: false,
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
                // if (query['redirectUri']) {
                //     window.location.replace(String(query['redirectUri']));
                // } else {
                //     router.replace({
                //         pathname: APP_ROUTES.LANDING,
                //     });
                // }

                // TODO use above code and remove following line after adding error handling for 403
                router.replace({
                    pathname: APP_ROUTES.LANDING,
                });
            }, 500);
        } catch (error) {
            console.log(error);
            setApiError(error);
            setLoadingState(LoadingState.initial);
        }
    };

    const handleClickShowPassword = () => {
        setContactForm({ ...loginForm, showPassword: !loginForm.showPassword });
    };

    const handleFormChange = (fieldName: string, value: string) => {
        if (loadingState === LoadingState.success) {
            setLoadingState(LoadingState.initial);
        }
        if (apiError) {
            setApiError(undefined);
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
                {({ errors, submitForm }) => {
                    let emailErrorMessage: any = errors.email;
                    if (
                        apiError &&
                        [ErrorCodes.INVALID_EMAIL, ErrorCodes.USER_NOT_FOUND].includes(
                            apiError.errorCode,
                        )
                    ) {
                        emailErrorMessage = apiError.message;
                    }

                    let passwordErrorMessage: any = errors.password;
                    if (apiError && apiError.errorCode === ErrorCodes.INVALID_PASSWORD) {
                        passwordErrorMessage = apiError.message;
                    }
                    return (
                        <div className='form-container'>
                            <div className='sign-in-heading'>
                                <Typography variant='h4' color='secondary'>
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
                                error={!!emailErrorMessage}
                                helperMessage={emailErrorMessage}
                                textFieldProps={{
                                    type: 'text',
                                    label: 'Email address',
                                }}
                            />
                            <div style={{ padding: 10 }} />
                            <div style={{ position: 'relative' }}>
                                <GenericTextField
                                    key={'password'}
                                    defaultValue={loginForm.password}
                                    fieldName={'password'}
                                    onChange={(field, value, event) => {
                                        handleFormChange(field, value);
                                    }}
                                    label={'Password'}
                                    error={!!passwordErrorMessage}
                                    helperMessage={passwordErrorMessage}
                                    textFieldProps={{
                                        label: 'Password',
                                        type: loginForm.showPassword ? 'text' : 'password',
                                    }}
                                />

                                {loginForm.password && (
                                    <Visibility
                                        style={{
                                            color: '#777777',
                                            position: 'absolute',
                                            top: '20px',
                                            right: '8px',
                                            fontSize: '30px',
                                        }}
                                        onClick={handleClickShowPassword}
                                    />
                                )}
                            </div>
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
                        </div>
                    );
                }}
            </Formik>
        </SignInComponent>
    );
};
