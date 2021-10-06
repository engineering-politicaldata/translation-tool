import { LinearProgress, Typography, useTheme } from '@material-ui/core';
import styled, { css } from 'styled-components';

const TranslationProgressViewContainer = styled.div`
    ${props =>
        props.theme &&
        css`
            .stats {
                display: flex;
                margin-bottom: ${props.theme.spacing(2)}px;
                margin-top: ${props.theme.spacing(4)}px;
                .first-section {
                }
                .middle-section {
                    padding: 0 ${props.theme.spacing(4)}px;
                    flex: 1;
                    display: flex;
                    align-items: flex-end;
                }
                .last-section {
                    text-align: right;
                }
            }
        `}
`;

interface Props {
    totalSourceKeys?: number;
    translationPercentage?: number;
    untranslationPercentage?: number;
    totalSourceWords?: number;
}

const TranslationProgressView = (props: Props) => {
    const theme = useTheme();
    if (!props.totalSourceKeys || !props.totalSourceWords) {
        return null;
    }
    return (
        <TranslationProgressViewContainer theme={theme}>
            <div className='stats'>
                <div className='first-section'>
                    <Typography variant='h4'>{props.totalSourceKeys}</Typography>
                    <Typography>Total Source keys</Typography>
                </div>
                <div className='middle-section'>
                    <Typography color='secondary'>
                        {props.translationPercentage}% Translated{' '}
                    </Typography>
                    &nbsp; &nbsp;
                    <Typography>{props.untranslationPercentage}% UnTranslated </Typography>
                </div>
                <div className='last-section'>
                    <Typography variant='h4'>{props.totalSourceWords}</Typography>
                    <Typography> Source words</Typography>
                </div>
            </div>
            <LinearProgress
                style={{ height: '12px' }}
                variant='determinate'
                color='secondary'
                value={props.translationPercentage}
            />
        </TranslationProgressViewContainer>
    );
};
export default TranslationProgressView;
