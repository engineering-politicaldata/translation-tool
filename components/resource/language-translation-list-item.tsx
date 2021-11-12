import {
    IconButton,
    LinearProgress,
    Menu,
    MenuItem,
    Typography,
    useTheme,
} from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { useRouter } from 'next/router';
import React from 'react';
import styled, { css } from 'styled-components';
import { ResourceSummaryByLanguage } from '@data-model';
import { GET_API_CONFIG } from '../../shared/ApiConfig';
import { apiRequest } from '../../shared/RequestHandler';

const ResourceListItemView = styled.div`
    ${props =>
        props.theme &&
        css`
            padding: ${props.theme.spacing(3)}px ${props.theme.spacing(1)}px;
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
                    display: grid;
                    grid-gap: ${props.theme.spacing(2)}px;
                    text-align: center;
                    padding: 0 ${props.theme.spacing(2)}px;
                }
                .section-3 {
                }
            }
        `}
`;

const ITEM_HEIGHT = 48;
enum OptionTypes {
    TRANSLATE = 'TRANSLATE',
    DOWNLOAD = 'DOWNLOAD',
    UPDATE = 'UPDATE',
}
const options = [
    {
        type: OptionTypes.TRANSLATE,
        value: 'Translate',
    },
    {
        type: OptionTypes.DOWNLOAD,
        value: 'Download File',
    },
    {
        type: OptionTypes.UPDATE,
        value: 'Update',
    },
];
interface Props {
    item: ResourceSummaryByLanguage;
    sourceKeysCount: number;
    resourceName: string;
    updateResourceForLanguage: (item: ResourceSummaryByLanguage) => void;
}

const LanguageTranslationListItem = (props: Props) => {
    const theme = useTheme();
    const router = useRouter();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const projectId = router.query.projectId;
    const resourceId = router.query.resourceId;
    const openMenu = event => {
        setAnchorEl(event.currentTarget);
    };

    const closeMenu = () => {
        setAnchorEl(null);
    };
    const { item, sourceKeysCount } = props;
    const translationPercentage = (item.translatedKeyCount / sourceKeysCount) * 100;

    const downloadResourceJSON = async () => {
        try {
            // TODO add page level loader
            const data = await apiRequest(
                `/api/project/${projectId}/resources/${resourceId}/download?languageId=${item.languageId}`,
                GET_API_CONFIG,
            );

            // Creating a blob object from non-blob data using the Blob constructor
            const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            // Create a new anchor element
            const a = document.createElement('a');
            const splitName = props.resourceName.split('.');
            a.href = url;
            a.download = `${splitName[0]}-${item.languageCode}.json`;
            a.click();
            a.remove();
        } catch (error) {}
    };
    const handleMenuItemClick = (actionType: OptionTypes) => {
        // open dialog to update resource, download translation or go to translations
        if (actionType === OptionTypes.TRANSLATE) {
            const hrefUrl = `/project/[projectId]/resources/[resourceId]/translate?targetLanguageId=${item.languageId}`;
            const asUrl = `/project/${projectId}/resources/${resourceId}/translate`;
            router.push(hrefUrl, asUrl);
            return;
        }
        if (actionType === OptionTypes.DOWNLOAD) {
            downloadResourceJSON();
        }

        if (actionType === OptionTypes.UPDATE) {
            closeMenu();
            props.updateResourceForLanguage(item);
        }
    };

    return (
        <ResourceListItemView key={item.languageId} theme={theme}>
            <div className='resource-item-stats'>
                <div className='section-1'>
                    <Typography variant='subtitle1'>
                        {item.languageName} ({item.languageCode}){' '}
                        {item.isSourceLanguage && (
                            <Typography variant='caption'>[source_language]</Typography>
                        )}
                    </Typography>
                    <Typography variant='caption' color='inherit'>
                        {Math.floor(translationPercentage)}% translated{' '}
                    </Typography>
                </div>
                <div className='section-2'>
                    {/* TODO uncomment on adding date */}
                    {/* <Typography variant='caption' color='inherit'>
                        Updated On:
                    </Typography>
                    <Typography variant='caption' color='textPrimary'>
                        {new Date(props.updatedDate).toLocaleString()}
                    </Typography> */}
                </div>
                <div className='section-3'>
                    <IconButton
                        aria-label='more'
                        aria-controls='long-menu'
                        aria-haspopup='true'
                        onClick={openMenu}
                    >
                        <MoreVertIcon />
                    </IconButton>
                    <Menu
                        id='long-menu'
                        anchorEl={anchorEl}
                        keepMounted
                        open={open}
                        onClose={closeMenu}
                        PaperProps={{
                            style: {
                                maxHeight: ITEM_HEIGHT * 4.5,
                                width: '20ch',
                            },
                        }}
                    >
                        {options.map(option => {
                            if (item.isSourceLanguage && option.type === OptionTypes.TRANSLATE) {
                                return null;
                            }
                            return (
                                <MenuItem
                                    key={option.type}
                                    onClick={() => handleMenuItemClick(option.type)}
                                >
                                    {option.value}
                                </MenuItem>
                            );
                        })}
                    </Menu>
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

export default LanguageTranslationListItem;
