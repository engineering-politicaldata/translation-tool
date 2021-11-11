import {
    Button,
    CircularProgress,
    DialogActions,
    DialogTitle,
    Typography,
    useTheme,
    withStyles,
} from '@material-ui/core';
import MuiDialog from '@material-ui/core/Dialog';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogContentText from '@material-ui/core/DialogContentText';
import { Check } from '@material-ui/icons';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import WebsiteHeader from '../../../../../components/common/website-header';
import UserDashboardLayout from '../../../../../components/layouts/user-dashboard-layout';
import LanguageTranslationListItem from '../../../../../components/resource/language-translation-list-item';
import ResourceStatsSection from '../../../../../components/resource/resource-stats-section';

import { privateRoute } from '../../../../../guard';
import { ResourceSummary, ResourceSummaryByLanguage, UpdateResourceInput } from '@data-model';
import { GET_API_CONFIG, POST_API_CONFIG } from '../../../../../shared/ApiConfig';
import { LoadingState } from '../../../../../shared/Constants';
import { apiRequest } from '../../../../../shared/RequestHandler';

const ResourcePageContainer = styled.div`
    ${props =>
        props.theme &&
        css`
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            .resource-page-body {
                padding: ${props.theme.spacing(8)}px;
                flex: 1;
            }
        `}
`;

const Dialog = withStyles(theme => ({
    root: {},
}))(MuiDialog);

const DialogContent = withStyles(theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: `${theme.spacing()}px ${theme.spacing(6)}px`,
    },
}))(MuiDialogContent);

const DialogContentText = withStyles(theme => ({
    root: {
        marginBottom: 24,
    },
}))(MuiDialogContentText);
const UploadSourceButtonStyled = styled.div`
    ${props =>
        props.theme &&
        css`
            padding: ${props.theme.spacing(2)}px 0;
            .upload-input-label {
                cursor: pointer;
                padding: ${props.theme.spacing(2)}px;
                border-radius: 3px;
                font-size: 16px;
                font-weight: 500;
                color: ${props.theme.contrastColor};
                background-color: ${props.theme.secondary[500]};
                overflow: hidden;
            }
            #upload-file {
                opacity: 0;
                position: absolute;
                z-index: -1;
            }
        `}
`;
const UploadSourceButton = (props: {
    handleFileRead: (e: ProgressEvent<FileReader>, fileName) => void;
    title: string;
}) => {
    const theme = useTheme();
    const handleFileSelected = event => {
        try {
            let files = event.target.files;
            if (!files.length) {
                alert('No file selected!');
                return;
            }
            let file = files[0];
            let reader = new FileReader();
            reader.onload = event => {
                props.handleFileRead(event, file.name);
            };
            reader.readAsText(file);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <UploadSourceButtonStyled theme={theme}>
            <label htmlFor='upload-file' className='upload-input-label'>
                {props.title}
            </label>
            <input
                type='file'
                name='photo'
                id='upload-file'
                accept='application/json'
                onChange={handleFileSelected}
            />
        </UploadSourceButtonStyled>
    );
};

function ResourcePage() {
    const router = useRouter();
    const theme = useTheme();
    const { projectId, resourceId } = router.query;

    const [openUpdateDialogForLanguage, setOpenUpdateDialogForLanguage] =
        useState<ResourceSummaryByLanguage>(undefined);
    const [resourceName, setResourceName] = useState('');
    const [sourceKeyCount, setSourceKeyCount] = useState(0);
    const [totalTranslatedKeyCount, setTotalTranslatedKeyCount] = useState(0);
    const [languageTranslationList, setLanguageTranslationList] = useState([]);
    const [fileUploadProgressState, setFileUploadProgressState] = useState<LoadingState>(
        LoadingState.initial,
    );
    useEffect(() => {
        getResourceSummary();
    }, []);

    const getResourceSummary = async () => {
        // TODO Show a progress bar
        try {
            const data: ResourceSummary = await apiRequest(
                `/api/project/${projectId}/resources/${resourceId}`,
                GET_API_CONFIG,
            );
            setResourceName(data.resourceName);
            const sourceLanguage = data.resourceSummaryListByLanguage.find(
                item => item.isSourceLanguage,
            );
            setSourceKeyCount(sourceLanguage.translatedKeyCount);
            setLanguageTranslationList(data.resourceSummaryListByLanguage);
            data.resourceSummaryListByLanguage.sort(function (a, b) {
                return a.translatedKeyCount - b.translatedKeyCount;
            });
            setTotalTranslatedKeyCount(data.resourceSummaryListByLanguage[0].translatedKeyCount);
        } catch (error) {}
    };

    const openUpdateResourceDialog = (item: ResourceSummaryByLanguage) => {
        setOpenUpdateDialogForLanguage(item);
    };

    const handleCloseOfUpdateResourceDialog = () => {
        setOpenUpdateDialogForLanguage(undefined);
    };

    async function onReaderLoad(event: ProgressEvent<FileReader>, fileName: string) {
        const obj: { [key: string]: string } = JSON.parse(event.target.result as string);

        const input: UpdateResourceInput = {
            languageId: openUpdateDialogForLanguage.languageId,
            isSourceLanguage: openUpdateDialogForLanguage.isSourceLanguage,
            translationKeyValueList: [],
        };
        for (const [key, value] of Object.entries(obj)) {
            if (!value || !value.trim()) {
                continue;
            }
            input.translationKeyValueList.push({
                key,
                text: value,
            });
        }
        await uploadFileData(input);
    }

    async function uploadFileData(input: UpdateResourceInput) {
        setFileUploadProgressState(LoadingState.loading);
        try {
            const data: { updated: boolean } = await apiRequest(
                `/api/project/${projectId}/resources/${resourceId}/update-resource`,
                {
                    ...POST_API_CONFIG,
                    body: JSON.stringify(input),
                },
            );

            setFileUploadProgressState(LoadingState.success);
            setTimeout(() => {
                setFileUploadProgressState(LoadingState.initial);
                if (data.updated) {
                    getResourceSummary();
                }
                handleCloseOfUpdateResourceDialog();
            }, 1000);
        } catch (error) {
            console.log('error', error);
            setFileUploadProgressState(LoadingState.initial);
        }
    }
    return (
        <UserDashboardLayout>
            <ResourcePageContainer theme={theme}>
                <WebsiteHeader title={'Resources'} description={resourceName} />
                <div className='resource-page-body'>
                    <ResourceStatsSection
                        languageCount={languageTranslationList.length}
                        totalSourceKeys={sourceKeyCount}
                        translatedKeysCount={totalTranslatedKeyCount}
                    />
                    {languageTranslationList.map(item => (
                        <LanguageTranslationListItem
                            updateResourceForLanguage={openUpdateResourceDialog}
                            item={item}
                            sourceKeysCount={sourceKeyCount}
                            resourceName={resourceName}
                            key={item.languageId}
                        />
                    ))}
                </div>

                <Dialog
                    open={!!openUpdateDialogForLanguage}
                    aria-labelledby='alert-dialog-title'
                    aria-describedby='alert-dialog-description'
                >
                    <DialogTitle id='alert-dialog-title'>{'Update Resource'}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id='alert-dialog-description'>
                            <b>Note:</b> When you update the source file, the already existing
                            strings will be ignored and only the new strings will be added to be
                            translated
                        </DialogContentText>
                        {fileUploadProgressState === LoadingState.loading && (
                            <CircularProgress
                                color='secondary'
                                size={30}
                                thickness={3}
                                variant='indeterminate'
                            ></CircularProgress>
                        )}
                        {fileUploadProgressState === LoadingState.success && (
                            <Check color='secondary' fontSize={'large'} />
                        )}
                        {fileUploadProgressState === LoadingState.initial && (
                            <UploadSourceButton title={'Upload'} handleFileRead={onReaderLoad} />
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button
                            variant='outlined'
                            size='small'
                            onClick={handleCloseOfUpdateResourceDialog}
                            disabled={
                                fileUploadProgressState === LoadingState.loading ||
                                fileUploadProgressState === LoadingState.success
                            }
                        >
                            <Typography>Close</Typography>
                        </Button>
                    </DialogActions>
                </Dialog>
            </ResourcePageContainer>
        </UserDashboardLayout>
    );
}

export default privateRoute(ResourcePage);
