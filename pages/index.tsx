import { Button, Typography, useTheme } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import NoDataFoundPage from '../components/common/no-data-found-page';
import TranslationProgressView from '../components/common/translation-progress-view';
import WebsiteHeader from '../components/common/website-header';
import UserDashboardLayout from '../components/layouts/UserDashboardLayout';
import { privateRoute } from '../shared/guard';

const AllProjectListPage = styled.div`
    ${props =>
        props.theme &&
        css`
            height: 100%;
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
        `}
`;

export interface AllProjectSummary {
    projectCount: number;
    totalSourceKeys: number;
    translationPercentage: number;
    untranslationPercentage: number;
    totalSourceWords: number;
}

function LandingPage() {
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
                <NoDataFoundPage
                    message={'No Projects Found'}
                    subText={'Please add project to manage translations'}
                >
                    <Button size='small' variant='contained' disableElevation color='secondary'>
                        Add Project
                    </Button>
                </NoDataFoundPage>
            );
        }
        if (allProjectsSummary && !allProjectsSummary.totalSourceWords) {
            return (
                <NoDataFoundPage
                    message={'No Resources Found'}
                    subText={'Please setup resources for your projects'}
                />
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

export default privateRoute(LandingPage);
