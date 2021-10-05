import { Button, LinearProgress, Typography, useTheme } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import TranslationProgressView from '../components/common/translation-progress-view';
import WebsiteHeader from '../components/common/website-header';
import UserDashboardLayout from '../components/layouts/UserDashboardLayout';

const AllProjectListPage = styled.div`
    ${props =>
        props.theme &&
        css`
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            .all-project-list-body {
                flex: 1;
                padding: ${props.theme.spacing(8)}px;
            }
            .project-count {
                display: flex;
                align-items: center;
            }

            .no-project-present-container {
                height: 100%;
                padding: ${props.theme.spacing(8)}px;
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: center;
                .no-project-present {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    .message {
                        opacity: 0.5;
                        margin-bottom: ${props.theme.spacing(2)}px;
                    }
                }
            }
        `}
`;

export interface AllProjectSummary {
    projectCount: number;
    totalSourceKeys: number;
    translationPercentage: number;
    untranslationPercentage: number;
    totalSourceWords: number;
}

export default function Home() {
    const [allProjectsSummary, setAllProjectSummary] = useState<AllProjectSummary>(undefined);
    const theme = useTheme();
    useEffect(() => {
        //TODO api call to get all project summary
        // Projects with data
        // const dummyResponse = {
        //     projectCount: 3,
        //     totalSourceKeys: 120,
        //     translatedKeysCount: 50,
        //     sourceWords: 300,
        // };

        // Projects with no data
        const dummyResponse = {
            projectCount: 3,
            totalSourceKeys: 0,
            translatedKeysCount: 0,
            sourceWords: 0,
        };

        if (dummyResponse.sourceWords === 0) {
            setAllProjectSummary({
                projectCount: dummyResponse.projectCount,
                totalSourceKeys: 0,
                translationPercentage: 0,
                untranslationPercentage: 0,
                totalSourceWords: 0,
            });
            return;
        }

        const translationPercentage =
            (dummyResponse.translatedKeysCount / dummyResponse.totalSourceKeys) * 100;
        const untranslationPercentage = 100 - translationPercentage;
        setAllProjectSummary({
            projectCount: dummyResponse.projectCount,
            totalSourceKeys: dummyResponse.totalSourceKeys,
            translationPercentage: Math.floor(translationPercentage),
            untranslationPercentage: Math.ceil(untranslationPercentage),
            totalSourceWords: dummyResponse.sourceWords,
        });
    }, []);

    const AllProjectsSummary = () => {
        if (!allProjectsSummary) {
            return (
                <div className='no-project-present-container'>
                    <div className='no-project-present'>
                        <Typography variant='h6' className='message'>
                            No Projects Found
                        </Typography>
                        <Typography variant='h6' className='message'>
                            Please add project to manage translations
                        </Typography>
                        <Button size='small' variant='contained' disableElevation color='secondary'>
                            Add New Project
                        </Button>
                    </div>
                </div>
            );
        }
        if (allProjectsSummary && allProjectsSummary.totalSourceWords === 0) {
            return (
                <div className='no-project-present-container'>
                    <div className='no-project-present'>
                        <Typography variant='h6' className='message'>
                            No Resources Found
                        </Typography>
                        <Typography variant='subtitle2' className='message'>
                            Please setup resources for your projects
                        </Typography>
                    </div>
                </div>
            );
        }
        return (
            <div className='all-project-list-body'>
                <div className='project-count'>
                    <Typography variant='h5'>Total Projects: </Typography>
                    {'  '}
                    <Typography variant='h4' color='secondary'>
                        {allProjectsSummary.projectCount}
                    </Typography>
                </div>
                <TranslationProgressView {...allProjectsSummary} />
            </div>
        );
    };
    return (
        <UserDashboardLayout>
            <AllProjectListPage theme={theme}>
                <WebsiteHeader
                    title='All projects'
                    description='Summary of all the available projects'
                />
                <AllProjectsSummary />
            </AllProjectListPage>
        </UserDashboardLayout>
    );
}
