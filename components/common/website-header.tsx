import { Typography, useTheme } from '@material-ui/core';
import { AddCircleOutline } from '@material-ui/icons';
import React from 'react';
import styled, { css } from 'styled-components';

const WebsiteHeaderComponent = styled.div`
    ${props =>
        props.theme &&
        css`
            background-color: ${props.theme.grey[100]};
            display: grid;
            grid-gap: ${props.theme.spacing(6)}px;
            align-items: center;
            grid-template-columns: 50px 1fr;
            padding: ${props.theme.spacing(4)}px ${props.theme.spacing(6)}px;
            .my-circle {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 50px;
                height: 50px;
                font-size: 24px;
                border-radius: 50%;
                background: plum;
                color: ${props.theme.contrastColor};
            }
        `}
`;
type Props = {
    title: string;
    description: string;
    highlight: 'title' | 'description';
};
const WebsiteHeader = (props: Props) => {
    const theme = useTheme();

    return (
        <>
            <WebsiteHeaderComponent theme={theme}>
                <div className='my-circle'>{props.title.substring(0, 2).toUpperCase()}</div>
                {props.highlight === 'title' ? (
                    <div>
                        <Typography variant='h5' component='div'>
                            {props.title}
                        </Typography>
                        <Typography variant='subtitle2' component='div'>
                            {props.description}
                        </Typography>
                    </div>
                ) : (
                    <div>
                        <Typography variant='subtitle2' component='div'>
                            {props.title}
                        </Typography>
                        <Typography variant='h5' component='div'>
                            {props.description}
                        </Typography>
                    </div>
                )}
            </WebsiteHeaderComponent>
        </>
    );
};

WebsiteHeader.defaultProps = {
    highlight: 'title',
};

export default WebsiteHeader;
