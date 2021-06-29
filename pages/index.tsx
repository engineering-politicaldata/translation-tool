import Head from 'next/head';
import Image from 'next/image';
import { Typography } from '@material-ui/core';
import { Link } from '@material-ui/core';
import React from 'react';
import { LoginForm } from '../components/forms/login-form';

export default function Home() {
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
