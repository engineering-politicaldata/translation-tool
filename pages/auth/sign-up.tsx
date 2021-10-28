import React from 'react';
import RegistrationForm from '../../components/forms/registration-form';
import { anonRoute } from '../../guard';

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
export default anonRoute(SignUpPage);
