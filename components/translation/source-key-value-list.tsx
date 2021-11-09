import { Typography, useTheme } from '@material-ui/core';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { TranslationKeyRecord } from '../../model';
import { POST_API_CONFIG } from '../../shared/ApiConfig';
import { LoadingState } from '../../shared/Constants';
import { apiRequest } from '../../shared/RequestHandler';

const KeyRecordListView = styled.div``;

const KeyRecordRow = styled.div`
    ${props =>
        props.theme &&
        css`
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            gap: ${props.theme.spacing(3)}px;
            padding: ${props.theme.spacing(2)}px ${props.theme.spacing(2)}px;
            border-top: 1px solid ${props.theme.grey[300]};
            :last-child {
                border-bottom: 1px solid ${props.theme.grey[300]};
            }
            position: relative;

            .indicator {
                width: 12px;
                height: 12px;
                border-radius: 6px;
                background-color: ${props.theme.grey[300]};
                &.checked {
                    background-color: ${props.theme.primary[500]};
                }
            }
        `};

    border-left: 4px solid transparent;

    ${props =>
        !props.isSelected &&
        css`
            &:hover {
                border-left: 4px solid ${props.theme.secondary[500]};
                // border-bottom: none;
            }
        `};
    ${props =>
        props.isSelected &&
        css`
            background-color: ${props.isTranslated && props.isSelected
                ? props.theme.primary[50]
                : props.theme.secondary[50]};
            ::before {
                content: '';
                border-left: 4px solid
                    ${props.isTranslated ? props.theme.primary[500] : props.theme.secondary[500]};
                position: absolute;
                left: -4px;
                height: 100%;
            }
        `}
`;
interface Props {
    projectId: string;
    sourceLanguageId: string;
    targetLanguageId: string;
    resourceId: string;
    selectedKeyRecord: TranslationKeyRecord | undefined;
    changeSelectedKeyRecord: (item: TranslationKeyRecord) => void;
}
const SourceKeyValueList = (props: Props) => {
    const [keyRecordList, setKeyRecordList] = useState<TranslationKeyRecord[]>([]);
    const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.loading);

    const theme = useTheme();

    const getTranslationList = async () => {
        setKeyRecordList([]);
        props.changeSelectedKeyRecord(undefined);
        setLoadingState(LoadingState.loading);
        try {
            const data = await apiRequest(
                `/api/project/${props.projectId}/resources/${props.resourceId}/translation-records`,
                {
                    ...POST_API_CONFIG,
                    body: JSON.stringify({
                        languageIds: [props.sourceLanguageId, props.targetLanguageId],
                    }),
                },
            );
            setKeyRecordList(data);
            props.changeSelectedKeyRecord(data[0]);
            setLoadingState(LoadingState.initial);
        } catch (error) {
            setLoadingState(LoadingState.error);
        }
    };

    useEffect(() => {
        if (!props.targetLanguageId || !props.sourceLanguageId) {
            return;
        }
        getTranslationList();
    }, [props.targetLanguageId, props.sourceLanguageId]);

    useEffect(() => {
        const index = keyRecordList.findIndex(
            item => item.keyRecordId === props.selectedKeyRecord.keyRecordId,
        );
        if (
            index > -1 &&
            JSON.stringify(keyRecordList[index]) !== JSON.stringify(props.selectedKeyRecord)
        ) {
            const updatedList = [...keyRecordList];
            updatedList.splice(index, 1, props.selectedKeyRecord);
            setKeyRecordList(updatedList);
        }
    }, [props.selectedKeyRecord]);

    if (loadingState == LoadingState.error) {
        return <div>error</div>;
    }

    if (loadingState == LoadingState.loading || !props.selectedKeyRecord) {
        return <div>loading</div>;
    }

    const listView = keyRecordList.map((item, index) => {
        const isTranslated = item.translations.length == 2;
        const classes = classNames('indicator', { checked: isTranslated });
        const sourceLanguage = item.translations.find(
            lang => lang.languageId == props.sourceLanguageId,
        );
        return (
            <KeyRecordRow
                key={item.key + sourceLanguage.value}
                isTranslated={isTranslated}
                isSelected={props.selectedKeyRecord.keyRecordId === item.keyRecordId}
                theme={theme}
                onClick={() => {
                    if (props.selectedKeyRecord.keyRecordId !== item.keyRecordId)
                        props.changeSelectedKeyRecord(item);
                }}
            >
                <div className={classes}></div>
                <div>
                    <Typography variant={'subtitle2'}>{item.key}</Typography>
                    <Typography variant={'caption'}>{sourceLanguage.value}</Typography>
                </div>
            </KeyRecordRow>
        );
    });
    return <KeyRecordListView>{listView}</KeyRecordListView>;
};

export default SourceKeyValueList;
