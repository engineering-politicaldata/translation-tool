import { Form, Formik, FormikHelpers } from 'formik';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { RegistrationSchema } from '../../utils/schemas';
import styled, { css } from 'styled-components';
import { Button, Typography, useTheme } from '@material-ui/core';
import GenericTextField from '../common/generic-text-field';

const SignUpComponent = styled.div`
    ${props =>
        props.theme &&
        css`
            display: flex;
            justify-content: center;
            align-items: center;
            padding-top: 60px;

            .form-container {
                .sign-in-nav-text {
                    padding-top: 20px;
                    padding-bottom: 20px;
                    flex-direction: row;
                }
                .sign-up-heading {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding-bottom: 16px;
                    padding-top: 16px;
                }
                .sign-up-image {
                    height: 50px;
                }

                justify-content: center;
                align-items: center;
                width: 450px;
                flex-direction: column;
            }
        `}
`;
const RegistrationForm = () => {
    const router = useRouter();
    const handleSignUp = async (values: {
        fullName: string;
        email: string;
        password: string;
        confirmPassword: string;
    }) => {};

    const [signUpForm, setContactForm] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
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
        setContactForm({ ...signUpForm, ...newState });
    };
    const theme = useTheme();
    return (
        <SignUpComponent theme={theme}>
            <Formik
                initialValues={signUpForm}
                enableReinitialize={true}
                onSubmit={values => handleSignUp(values)}
                validationSchema={RegistrationSchema}
            >
                {({ errors, submitForm }) => (
                    <div className='form-container'>
                        <div className='sign-up-heading'>
                            <img
                                className='sign-up-image'
                                src='/images/logos/outreach_circle_logo.png'
                            />
                        </div>
                        <div className='sign-up-heading'>
                            <Typography variant='h4' color='primary'>
                                Get started with Translation Tool account
                            </Typography>
                        </div>

                        <GenericTextField
                            key={'fullName'}
                            defaultValue={signUpForm.fullName}
                            fieldName={'fullName'}
                            onChange={(field, value, event) => {
                                handleFormChange(field, value);
                            }}
                            onReset={field => {
                                handleFormChange(field, '');
                            }}
                            label={'Full name'}
                            error={!!errors.fullName}
                            helperMessage={errors.fullName}
                            textFieldProps={{
                                type: 'text',
                                label: 'Full name',
                            }}
                        />
                        <div style={{ padding: 10 }} />
                        <GenericTextField
                            key={'email'}
                            defaultValue={signUpForm.email}
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
                            defaultValue={signUpForm.password}
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
                        <GenericTextField
                            key={'confirmPassword'}
                            defaultValue={signUpForm.confirmPassword}
                            fieldName={'confirmPassword'}
                            onChange={(field, value, event) => {
                                handleFormChange(field, value);
                            }}
                            onReset={field => {
                                handleFormChange(field, '');
                            }}
                            label={'confirm password'}
                            error={!!errors.confirmPassword}
                            helperMessage={errors.confirmPassword}
                            textFieldProps={{
                                type: 'text',
                                label: 'confirm password',
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
                            Sign up
                        </Button>

                        <div className='sign-in-nav-text'>
                            <a>Already have an account? </a>
                            <Link href='/'>
                                <a>Log in</a>
                            </Link>
                        </div>
                    </div>
                )}
            </Formik>
        </SignUpComponent>
    );
};
export default RegistrationForm;
