import { Typography, useTheme } from '@material-ui/core';
import { AddCircleOutline } from '@material-ui/icons';
import React from 'react';
import styled, { css } from 'styled-components';

const WebsiteHeaderComponent = styled.div`
    ${props =>
        props.theme &&
        css`
            .add-project-header {
                display: flex;
                background-color: ${props.theme.grey[100]};
                height: 108px;
                align-items: center;
                justify-content: flex-start;
                padding: ${props.theme.spacing(2)}px;
                padding-left: ${props.theme.spacing(6)}px;
                .add-circle-icon {
                    font-size: 32px;
                }
                .my-circle {
                    width: 2.5em;
                    height: 2.5em;
                    line-height: 2.5em;
                    text-align: center;
                    border-radius: 50%;
                    background: plum;
                    color: ${props.theme.contrastColor};
                }
            }
        `}
`;
type Props = {
    title: string;
    description: string;
};
const WebsiteHeader = (props: Props) => {
    const theme = useTheme();

    return (
        <>
            <WebsiteHeaderComponent theme={theme}>
                <Typography variant='h5' component='div' className='add-project-header'>
                    <p data-letters='MN' className='my-circle'>
                        {props.title.substring(0, 2)}
                    </p>
                    <div style={{ paddingRight: '8px' }} />
                    {props.title}
                </Typography>
            </WebsiteHeaderComponent>
        </>
    );
};
export default WebsiteHeader;
