import { Typography, useTheme } from '@material-ui/core';
import styled, { css } from 'styled-components';

const ResourceSummaryStyled = styled.div`
    ${props =>
        props.theme &&
        css`
            display: grid;
            grid-template-columns: 1fr auto auto auto;
            grid-gap: ${props.theme.spacing(3)}px;
            padding-bottom: ${props.theme.spacing(4)}px;
            border-bottom: 1px solid ${props.theme.grey[300]};
            color: ${props.theme.grey[500]};

            .section-1 {
                flex: 1;
                display: flex;
                justify-content: space-between;
                border-right: 1px solid ${props.theme.grey[300]};
                padding-right: ${props.theme.spacing(3)}px;

                .word-count {
                    text-align: right;
                }
            }
            .section-2 {
                text-align: right;
            }
            .section-3 {
            }
            .section-4 {
            }
        `}
`;

const ResourcesSummary = props => {
    const { activeProject } = props;
    const theme = useTheme();
    return (
        <ResourceSummaryStyled theme={theme}>
            <div className='section-1'>
                <div>
                    <Typography variant='h5'> {activeProject.totalResourcesCount} </Typography>{' '}
                    <Typography color='inherit'>Resources</Typography>
                </div>
                <div className='word-count'>
                    <Typography variant='h5'> {activeProject.totalSourceKeys} </Typography>{' '}
                    <Typography variant='subtitle2' color='inherit'>
                        Total Source Keys
                    </Typography>
                </div>
            </div>
            <div className='section-2'>
                <Typography variant='h5'>
                    {activeProject.totalSourceKeys - activeProject.translatedKeysCount}
                </Typography>
                <Typography variant='subtitle2' color='inherit'>
                    Untranslated Keys{' '}
                </Typography>
            </div>
            <div className='section-3'>
                <Typography variant='h5'>/ </Typography>
            </div>
            <div className='section-4'>
                <Typography variant='h5'>{activeProject.translatedKeysCount}</Typography>
                <Typography variant='subtitle2' color='inherit'>
                    Translated Keys
                </Typography>
            </div>
        </ResourceSummaryStyled>
    );
};

export default ResourcesSummary;
