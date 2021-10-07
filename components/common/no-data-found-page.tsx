import { Typography, useTheme } from '@material-ui/core';
import styled, { css } from 'styled-components';

const NoDataFoundContainer = styled.div`
    ${props =>
        props.theme &&
        css`
            height: 100%;
            padding: ${props.theme.spacing(8)}px;
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            .no-project-present {
                display: flex;
                flex-direction: column;
                align-items: center;
                .message {
                    opacity: 0.5;
                    margin-bottom: ${props.theme.spacing(2)}px;
                }
            }
        `}
`;
const NoDataFoundPage = (props: { message: string; subText: string; children?: any }) => {
    const theme = useTheme();
    return (
        <NoDataFoundContainer theme={theme}>
            <div className='no-project-present'>
                <Typography variant='h6' className='message'>
                    {props.message}
                </Typography>
                <Typography variant='subtitle2' className='message'>
                    {props.subText}
                </Typography>
                {props.children}
            </div>
        </NoDataFoundContainer>
    );
};

export default NoDataFoundPage;
