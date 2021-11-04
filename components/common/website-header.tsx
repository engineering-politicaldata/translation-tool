import { Typography, useTheme } from '@material-ui/core';
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
            padding: ${props.theme.spacing(4)}px ${props.theme.spacing(6)}px;
        `}
`;
type Props = {
    title: string;
    description: string;
};
const WebsiteHeader = (props: Props) => {
    const theme = useTheme();

    return (
        <WebsiteHeaderComponent theme={theme}>
            <div>
                <Typography variant='caption' component='div'>
                    {props.title}
                </Typography>
                <Typography variant='h5' component='div'>
                    {props.description}
                </Typography>
            </div>
        </WebsiteHeaderComponent>
    );
};

WebsiteHeader.defaultProps = {
    title: '',
};

export default WebsiteHeader;
