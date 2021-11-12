export type UploadResourceInput = {
    sourceName: string;
    projectId: string;
    translationKeyValueList: {
        key: string;
        text: string;
    }[];
};

export type UpdateResourceInput = {
    languageId: string;
    isSourceLanguage: boolean;
    translationKeyValueList: {
        key: string;
        text: string;
    }[];
};

export type UpdateKeyTranslation = {
    languageId: string;
    keyRecordId: string;
    value: string;
};

export type TranslationKeyRecord = {
    keyRecordId: string;
    key: string;
    translations: {
        languageId: string;
        value: string;
    }[];
};

export type UpdateTranslationRecord = {
    keyRecordId: string;
    languageId: string;
    value: string;
};

export type ResourceSummaryByLanguage = {
    languageCode: string;
    languageId: string;
    isSourceLanguage: boolean;
    translatedKeyCount: number;
    languageName: string;
};

export type ResourceSummary = {
    resourceName: string;
    resourceSummaryListByLanguage: ResourceSummaryByLanguage[];
};
