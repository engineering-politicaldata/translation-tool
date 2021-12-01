import { Button, Typography, useTheme, CircularProgress, Box } from '@material-ui/core';
import { Check } from '@material-ui/icons';
import { Formik } from 'formik';
import { useRouter } from 'next/router';
import { Fragment, useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import GenericTextField from '../../../../../components/common/generic-text-field';
import SourceKeyValueList from '../../../../../components/translation/source-key-value-list';
import TargetLanguageSelection from '../../../../../components/translation/target-language-selection';
import { privateRoute } from '../../../../../guard';
import { TranslationKeyRecord } from '@data-model';
import { POST_API_CONFIG } from '../../../../../shared/ApiConfig';
import { apiRequest } from '../../../../../shared/RequestHandler';
import { LoadingState } from '../../../../../shared/Constants';

const TranslatePageContainer = styled.div`
    ${props =>
        props.theme &&
        css`
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            .translation-list-form-wrapper {
                height: calc(100vh - 60px);
                display: flex;
                section {
                    flex: 1;
                    overflow: auto;
                    min-height: 100%;
                    padding: ${props.theme.spacing(3)}px ${props.theme.spacing(2)}px;
                }
                }
                .source-language-value {
                    min-height: 150px;
                    border: 2px solid;
                    border-radius: 10px;
                    padding: ${props.theme.spacing(2)}px;
                    margin-bottom: ${props.theme.spacing(2)}px;
                    border-color: ${props.theme.grey[400]};
                    background-color: ${props.theme.grey[100]};
                }
                .translation-form {
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                }
                .source-text-label{
                    padding: ${props.theme.spacing(2)}px;
                }
            }
        `}
`;

const TranslatePage = () => {
    const router = useRouter();
    const theme = useTheme();
    const { projectId, resourceId } = router.query;

    const [targetLanguageId, setTargetLanguageId] = useState(router.query.targetLanguageId || '');
    const [sourceLanguageId, setSourceLanguageId] = useState('');
    const [selectedKeyRecord, setSelectedKeyRecord] = useState<TranslationKeyRecord>(undefined);

    const [translationForm, setTranslationForm] = useState<any>({});
    const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.initial);

    useEffect(() => {}, []);

    const changeTargetLanguageId = (id: string) => {
        if (id !== targetLanguageId) setTargetLanguageId(id);
    };
    const changeSourceLanguageId = (id: string) => {
        if (id !== sourceLanguageId) setSourceLanguageId(id);
    };
    const changeSelectedKeyRecord = (record: TranslationKeyRecord) => {
        setTimeout(() => {
            setSelectedKeyRecord(record);
            setTranslationForm({});
            setLoadingState(LoadingState.initial);
            if (record) {
                const targetLanguage = record.translations.find(
                    lang => lang.languageId == targetLanguageId,
                );

                setTranslationForm({
                    translationRecord: targetLanguage?.value || '',
                });
            } else {
                setTranslationForm({
                    translationRecord: '',
                });
            }
        });
    };

    const saveTranslation = async (values: { translationRecord: any }) => {
        setLoadingState(LoadingState.loading);
        try {
            const data = await apiRequest(
                `/api/project/${projectId}/resources/${resourceId}/update-key-translation`,
                {
                    ...POST_API_CONFIG,
                    body: JSON.stringify({
                        languageId: targetLanguageId,
                        keyRecordId: selectedKeyRecord.keyRecordId,
                        value: values.translationRecord,
                    }),
                },
            );
            let updatedKeyRecord = {
                ...selectedKeyRecord,
                translations: [
                    { languageId: sourceLanguageId, value: getSourceValue() },
                    { languageId: targetLanguageId.toString(), value: values.translationRecord },
                ],
            };

            setLoadingState(LoadingState.success);
            setTranslationForm({
                translationRecord: values.translationRecord,
            });
            setSelectedKeyRecord(updatedKeyRecord);
            setTimeout(() => {
                setLoadingState(LoadingState.initial);
            }, 1000);
        } catch (error) {
            setLoadingState(LoadingState.initial);
        }
    };

    const getSourceValue = () => {
        if (!selectedKeyRecord || !targetLanguageId) {
            return '';
        }
        const sourceLanguage = selectedKeyRecord.translations.find(
            lang => lang.languageId != targetLanguageId,
        );
        return sourceLanguage.value;
    };
    return (
        <TranslatePageContainer theme={theme}>
            <TargetLanguageSelection
                projectId={projectId.toString()}
                sourceLanguageId={sourceLanguageId}
                targetLanguageId={targetLanguageId.toString()}
                changeTargetLanguage={changeTargetLanguageId}
                setSourceLanguageId={changeSourceLanguageId}
            />
            <div className='translation-list-form-wrapper'>
                <section>
                    <SourceKeyValueList
                        projectId={projectId.toString()}
                        targetLanguageId={targetLanguageId.toString()}
                        sourceLanguageId={sourceLanguageId}
                        resourceId={resourceId.toString()}
                        selectedKeyRecord={selectedKeyRecord}
                        changeSelectedKeyRecord={changeSelectedKeyRecord}
                    />
                </section>
                <section>
                    <Typography className='source-text-label'>Source Text </Typography>
                    <div className='source-language-value'>{getSourceValue()} </div>
                    <div className='translation-form'>
                        <Formik
                            initialValues={translationForm}
                            enableReinitialize={true}
                            onSubmit={values => saveTranslation(values)}
                        >
                            {({
                                errors,
                                submitForm,
                                initialValues,
                                values,
                                dirty,
                                handleChange,
                            }) => {
                                return (
                                    <Fragment>
                                        <Box width={'100%'}>
                                            <GenericTextField
                                                key={'translationRecord'}
                                                defaultValue={values['translationRecord']}
                                                isControlledField={true}
                                                fieldName={'translationRecord'}
                                                onChange={(field, value, event) => {
                                                    handleChange(event);
                                                }}
                                                label={'Translated'}
                                                error={!!errors.translationRecord}
                                                helperMessage={errors.translationRecord}
                                                textFieldProps={{
                                                    placeholder: 'Type your translation here',
                                                    multiline: true,
                                                    type: 'text',
                                                    maxRows: 5,
                                                    minRows: 5,
                                                    focused: true,
                                                    autoFocus: true,
                                                }}
                                            />
                                        </Box>
                                        <Button
                                            size='small'
                                            color='secondary'
                                            disableElevation
                                            variant='contained'
                                            disabled={
                                                !dirty ||
                                                initialValues['translationRecord'] ===
                                                    values['translationRecord']
                                            }
                                            onClick={submitForm}
                                        >
                                            <Typography color='inherit'>
                                                {loadingState === LoadingState.loading && (
                                                    <CircularProgress
                                                        color='inherit'
                                                        size={18}
                                                        thickness={3}
                                                        variant='indeterminate'
                                                    ></CircularProgress>
                                                )}
                                                {loadingState === LoadingState.success && (
                                                    <Check style={{ fontSize: 18 }} />
                                                )}
                                                {loadingState === LoadingState.initial && 'Save '}
                                            </Typography>
                                        </Button>
                                    </Fragment>
                                );
                            }}
                        </Formik>
                    </div>
                </section>
            </div>
        </TranslatePageContainer>
    );
};

export default privateRoute(TranslatePage);
