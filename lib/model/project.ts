export type CreateProjectInput = {
    name: string;
    description: string;
    sourceLanguageId: string;
    targetLanguageIds: string[];
};

export type UpdateTargetLanguagesInput = {
    projectId: string;
    targetLanguageIds: string[];
};

export type UpdateProjectBasicDetailsInput = {
    id: string;
    name: string;
    description: string;
};

export type UploadResourcForProjectInput = {
    sourceName: string;
    projectId: string;
    translationKeyValueList: {
        key: string;
        text: string;
    }[];
};

export type Language = {
    id: string;
    code: string;
    name: string;
};

export type Project = {
    id: string;
    name: string;
    description?: string;
    totalResourcesCount?: number; // Total number of resources added for project
    totalSourceKeys?: number; // Total number of source keys in all the resources
    translatedKeysCount?: number; // Total number of translated strings/keys
    resources?: {
        id: string;
        created: string;
        sourceName: string;
        totalSourceKeys: number;
        translatedKeysCount: number;
    }[];
};

export type ProjectListItemInfo = {
    id: string;
    name: string;
    description?: string;
};
