import Head from 'next/head';
import React from 'react';
import RegistrationForm from '../../components/forms/registration-form';
import { Typography } from '@material-ui/core';

const RegisterPage = () => {
    return (
        <>
            <div
                className='sign-up-form'
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <div>
                    <RegistrationForm />
                </div>
            </div>
        </>
    );
};
export default RegisterPage;
