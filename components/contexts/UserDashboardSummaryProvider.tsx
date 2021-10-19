import React, { createContext, useState, useEffect } from 'react';
import { ProjectListItemInfo, Project } from '../../lib/model';
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
            if (
                activeProject &&
                (activeProject.name !== project.name ||
                    activeProject.description !== project.description)
            ) {
                const index = projectList.findIndex(item => item.id === project.id);
                const newList = [...projectList];
                newList.splice(index, 1, {
                    id: project.id,
                    name: project.name,
                    description: project.description,
                });

                setProjectList(newList);
            }

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
