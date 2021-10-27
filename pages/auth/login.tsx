import { useTheme } from '@material-ui/core';
import React from 'react';
import styled, { css } from 'styled-components';
import { LoginForm } from '../../components/forms/login-form';
import { anonRoute } from '../../shared/guard';

const LoginComponent = styled.div`
    ${props =>
        props.theme &&
        css`
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: ${props.theme.grey[200]};
            padding-bottom: ${props.theme.spacing(8)}px;

            .login-form {
                display: flex;
                justify-content: center;
                align-items: center;
                background-color: ${props.theme.contrastColor};
                padding: ${props.theme.spacing(10)}px;
            }
        `}
`;
function Login() {
    const theme = useTheme();
    return (
        <LoginComponent theme={theme}>
            <div className='login-form'>
                <LoginForm />
            </div>
        </LoginComponent>
    );
}

export default anonRoute(Login);
