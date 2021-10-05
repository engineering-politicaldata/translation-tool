import React, { createContext, useState, useEffect } from 'react';

export interface ProjectBasicInfo {
    id: string;
    projectName: string;
    projectDescription?: string;
}
export interface Project {
    id: string;
    projectName: string;
    projectDescription?: string;
}

export interface UserDashboardSummaryType {
    projectList: ProjectBasicInfo[];
    activeProject?: ProjectBasicInfo;
    updateProjectList: (project: ProjectBasicInfo) => void;
    updateActiveProject: (project: Project) => void;
    clearContext: () => void;
}
export const UserDashboardSummaryContext = createContext<UserDashboardSummaryType>({
    projectList: [],
    updateProjectList: (project: ProjectBasicInfo) => {},
    activeProject: undefined,
    updateActiveProject: (project: Project) => {},
    clearContext: () => {},
});

const UserDashboardSummaryProvider = props => {
    const [projectList, setProjectList] = useState<ProjectBasicInfo[]>([]);
    const [activeProject, setActiveProject] = useState<Project>(undefined);

    const updateProjectList = (project: ProjectBasicInfo) => {
        setProjectList([...projectList, project]);
    };
    const updateActiveProject = (project: Project) => {
        if (activeProject && project.id === activeProject.id) {
            setActiveProject({
                ...activeProject,
                ...project,
            });
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
