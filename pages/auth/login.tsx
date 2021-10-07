import React from 'react';
import { LoginForm } from '../../components/forms/login-form';

export default function Login() {
    return (
        <React.Fragment>
            <div
                className='login-container'
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <div className='login-form'>
                    <LoginForm />
                </div>
            </div>
        </React.Fragment>
    );
}
