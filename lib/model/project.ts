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
    projectId: string;
    name: string;
    description: string;
};

export type Language = {
    id: string;
    code: string;
    name: string;
};

export type ProjectBasicDetails = {
    projectId: string;
    name: string;
    description: string;
    targetLanguages: Language[];
};

export type ProjectListItemInfo = {
    id: string;
    name: string;
    description?: string;
};
