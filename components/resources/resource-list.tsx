import { Chip, LinearProgress, Typography, useTheme } from '@material-ui/core';
import styled, { css } from 'styled-components';
import { useRouter } from 'next/router';

const ResourceListItemView = styled.div`
    ${props =>
        props.theme &&
        css`
            cursor: pointer;
            padding: ${props.theme.spacing(3)}px ${props.theme.spacing(1)}px;
            &:hover {
                background-color: ${props.theme.grey[200]};
            }
            .chip-root {
                height: auto;
                margin-right: ${props.theme.spacing(2)}px;
            }
            .resource-item-stats {
                display: flex;
                align-items: center;
                color: ${props.theme.grey[500]};
                margin-bottom: ${props.theme.spacing(1)}px;

                .section-1 {
                    flex: 1;
                    .source-name {
                    }
                }
                .section-2 {
                    margin-right: ${props.theme.spacing(4)}px;
                }
                .section-3 {
                    display: grid;
                    grid-gap: ${props.theme.spacing(2)}px;
                    text-align: center;
                    padding: 0 ${props.theme.spacing(2)}px;
                }
            }
        `}
`;

const ResourceList = (props: any) => {
    const theme = useTheme();
    const router = useRouter();
    const { resource, translationPercentage } = props;

    const handleResourceItemClick = (resourceId: string) => {
        const projectId = router.query.projectId;
        const hrefUrl = '/project/[projectId]/resources/[resourceId]';
        const asUrl = `/project/${projectId}/resources/${resourceId}`;
        router.push(hrefUrl, asUrl);
    };

    return (
        <ResourceListItemView theme={theme} onClick={() => handleResourceItemClick(resource.id)}>
            <div className='resource-item-stats'>
                <div className='section-1'>
                    <Typography variant='subtitle1'>
                        <Chip
                            label='Source'
                            variant='outlined'
                            className='chip-root'
                            color='secondary'
                            size='small'
                        />
                        {resource.sourceName}
                    </Typography>
                    <Typography variant='caption' color='inherit'>
                        {Math.floor(translationPercentage)}% translated{' '}
                    </Typography>
                </div>
                <div className='section-2'>
                    <Typography variant='subtitle2' color='inherit'>
                        {' '}
                        {resource.totalSourceKeys} keys
                    </Typography>
                </div>
                <div className='section-3'>
                    <Typography variant='caption' color='inherit'>
                        Updated On:
                    </Typography>
                    <Typography variant='caption' color='textPrimary'>
                        {new Date(resource.created).toLocaleString()}
                    </Typography>
                </div>
            </div>
            <LinearProgress
                style={{ height: '8px' }}
                variant='determinate'
                color='secondary'
                value={translationPercentage}
            />
        </ResourceListItemView>
    );
};

export default ResourceList;
