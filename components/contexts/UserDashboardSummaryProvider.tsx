import React, { createContext, useState, useEffect } from 'react';
import { ProjectListItemInfo } from '../../lib/model';
export interface Project {
    id: string;
    name: string;
    description?: string;
    totalResourcesCount?: number; // Total number of resources added for project
    totalSourceKeys?: number; // Total number of source keys in all the resources
    totalSourceWords?: number; // Total number of words tobe translated in source JSON
    translatedKeysCount?: number; // Total number of translated strings/keys
    totalTranslatedWords?: number; // Total number of words in strings of translated keys
    resources?: {
        id: string;
        createdDate: string;
        sourceName: string;
        totalSourceKeys: number;
        translatedKeysCount: number;
        totalSourceWords: number;
    }[];
}

export interface UserDashboardSummaryType {
    projectList: ProjectListItemInfo[];
    activeProject?: Project;
    updateProjectList: (project: ProjectListItemInfo) => void;
    setProjectList: (projectList: ProjectListItemInfo[]) => void;
    updateActiveProject: (project: Project) => void;
    clearContext: () => void;
}
export const UserDashboardSummaryContext = createContext<UserDashboardSummaryType>({
    projectList: [],
    updateProjectList: (project: ProjectListItemInfo) => {},
    setProjectList: (projectList: ProjectListItemInfo[]) => {},
    activeProject: undefined,
    updateActiveProject: (project: Project) => {},
    clearContext: () => {},
});

const UserDashboardSummaryProvider = props => {
    const [projectList, setProjectList] = useState<ProjectListItemInfo[]>([]);
    const [activeProject, setActiveProject] = useState<Project>(undefined);

    const updateProjectList = (project: ProjectListItemInfo) => {
        setProjectList([...projectList, project]);
    };
    const updateActiveProject = (project: Project) => {
        if (project) {
            setActiveProject(project);
        } else {
            setActiveProject(undefined);
        }
    };
    const clearContext = () => {
        setProjectList([]);
        setActiveProject(undefined);
    };
    return (
        <UserDashboardSummaryContext.Provider
            value={{
                projectList,
                updateProjectList,
                setProjectList,
                activeProject,
                updateActiveProject,
                clearContext,
            }}
        >
            {props.children}
        </UserDashboardSummaryContext.Provider>
    );
};
export default UserDashboardSummaryProvider;
