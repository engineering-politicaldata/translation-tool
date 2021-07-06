import Head from 'next/head';
import React from 'react';
import RegistrationForm from '../../components/forms/registration-form';

const SignUpPage = () => {
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
export default SignUpPage;
