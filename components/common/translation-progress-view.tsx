import { LinearProgress, Typography, useTheme } from '@material-ui/core';
import styled, { css } from 'styled-components';

const TranslationProgressViewContainer = styled.div`
    ${props =>
        props.theme &&
        css`
            .stats {
                display: flex;
                margin-bottom: ${props.theme.spacing(3)}px;
                margin-top: ${props.theme.spacing(4)}px;
                .first-section {
                }
                .middle-section {
                    flex: 1;
                    display: flex;
                    align-items: flex-end;
                }
                .last-section {
                    padding: 0 ${props.theme.spacing(4)}px;
                }
            }
        `}
`;

interface Props {
    totalSourceKeys?: number;
    translationPercentage?: number;
    untranslationPercentage?: number;
    totalResourcesCount?: number;
}

const TranslationProgressView = (props: Props) => {
    const theme = useTheme();
    if (!props.totalSourceKeys || !props.totalResourcesCount) {
        return null;
    }
    return (
        <TranslationProgressViewContainer theme={theme}>
            <div className='stats'>
                <div className='first-section'>
                    <Typography variant='h3'>{props.totalSourceKeys}</Typography>
                    <Typography>Total Source keys</Typography>
                </div>

                <div className='last-section'>
                    <Typography variant='h3'>{props.totalResourcesCount}</Typography>
                    <Typography> Total Resources</Typography>
                </div>
            </div>

            <LinearProgress
                style={{ height: '10px' }}
                variant='determinate'
                color='secondary'
                value={props.translationPercentage}
            />
            <div className='stats'>
                <div className='middle-section'>
                    <Typography variant='subtitle2' color='secondary'>
                        {props.translationPercentage}% Translated{' '}
                    </Typography>
                    &nbsp; &nbsp;
                    <Typography variant='subtitle2'>
                        {props.untranslationPercentage}% Untranslated{' '}
                    </Typography>
                </div>
            </div>
        </TranslationProgressViewContainer>
    );
};
export default TranslationProgressView;
