import {
    Button,
    createStyles,
    Drawer,
    List,
    ListItem,
    ListItemText,
    makeStyles,
} from '@material-ui/core';
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { GET_API_CONFIG } from '../../lib/backend.config';
import { ProjectListItemInfo } from '../../lib/model';
import { CustomTheme } from '../../styles/MuiTheme';
import { UserDashboardSummaryContext } from '../contexts/UserDashboardSummaryProvider';

const LoggedInUserLayoutContainer = styled.div`
    display: flex;
    position: relative;
`;

const drawerWidth = 240;

const useStyles = makeStyles((theme: CustomTheme) =>
    createStyles({
        root: {
            display: 'flex',
        },
        drawer: {
            width: drawerWidth,
            flexShrink: 0,
        },
        drawerPaper: {
            width: drawerWidth,
            position: 'absolute',
        },
        content: {
            flexGrow: 1,
            minHeight: '100vh',
        },
        listRoot: {
            width: '100%',
            padding: 0,
            backgroundColor: theme.palette.secondary.main,
        },
        listItemRoot: {
            paddingTop: 0,
            paddingBottom: 0,
        },
        listItemTextRoot: {
            paddingTop: '8px',
            paddingBottom: '8px',
            color: theme.contrastColor,
        },
        addProjectButtomRoot: {
            position: 'absolute',
            bottom: '16px',
        },
    }),
);

const Accordion = withStyles((theme: CustomTheme) => {
    return {
        root: {
            border: '1px solid rgba(0, 0, 0, .125)',
            backgroundColor: theme.palette.secondary.main,
            boxShadow: 'none',
            '&:not(:last-child)': {
                borderBottom: 0,
            },
            '&:before': {
                display: 'none',
            },
            '&$expanded': {
                margin: '0px',
            },
        },
        expanded: {},
    };
})(MuiAccordion);

const AccordionSummary = withStyles((theme: CustomTheme) => {
    return {
        root: {
            color: theme.contrastColor,
            backgroundColor: 'rgba(0, 0, 0, .03)',
            borderBottom: '1px solid rgba(0, 0, 0, .125)',
            marginBottom: -1,
            minHeight: 56,
            '&$expanded': {
                minHeight: 56,
            },
        },
        content: {
            '&$expanded': {
                margin: '12px 0',
            },
        },
        expanded: {},
    };
})(MuiAccordionSummary);

const AccordionDetails = withStyles(theme => ({
    root: {
        padding: 0,
    },
}))(MuiAccordionDetails);

const UserDashboardLayout = props => {
    const classes = useStyles();
    const router = useRouter();
    const { projectId: activeProjectID } = router.query;
    const [expanded, setExpanded] = useState<string | false>(false);
    const [activeSubRoute, setActiveSubRoute] = useState('');
    const [menuList, setMenuList] = useState<
        | {
              projectId: string;
              title: string;
              subMenus: {
                  title: string;
                  route: string;
              }[];
          }[]
        | null
    >(null);
    const projectListContext = useContext(UserDashboardSummaryContext);

    async function getActiveProjectInfo(activeProjectID: string) {
        if (
            !projectListContext.activeProject ||
            projectListContext.activeProject.id !== activeProjectID
        ) {
            try {
                const res = await fetch(`/api/project/${activeProjectID}`, GET_API_CONFIG);
                const projectBasicInfo: ProjectListItemInfo = await res.json();

                projectListContext.updateActiveProject({
                    ...projectBasicInfo,
                });
            } catch (error) {
                // TODO redirect to error page
                console.error(error);
            }
        }
    }
    useEffect(() => {
        if (!activeProjectID) {
            projectListContext.updateActiveProject(undefined);
            return;
        }

        getActiveProjectInfo(activeProjectID.toString());
        setExpanded(activeProjectID.toString());

        const routeSegments = router.asPath.split('/');
        setActiveSubRoute(routeSegments[3]);
    }, [activeProjectID]);

    const getProjectList = async () => {
        try {
            const res = await fetch('/api/project/basic-info-list', GET_API_CONFIG);
            const data: { projectList: ProjectListItemInfo[] } = await res.json();
            if (!data.projectList || !data.projectList.length) {
                router.replace('/project/create');
            }
            projectListContext.setProjectList([...data.projectList]);
        } catch (error) {
            // TODO redirect to error page
        }
    };

    useEffect(() => {
        // Check in the context
        if (!projectListContext.projectList.length) {
            getProjectList();
            return;
        }

        const subMenuList = [
            { title: 'Overview', route: 'overview' },
            // { title: 'Languages', route: 'languages' },
            { title: 'Resources', route: 'resources' },
            { title: 'Settings', route: 'settings' },
        ];

        const menuItems = projectListContext.projectList.map(project => {
            return {
                projectId: project.id,
                title: project.name,
                subMenus: [...subMenuList],
            };
        });
        menuItems.unshift({
            projectId: null,
            title: 'All Projects',
            subMenus: [],
        });
        setMenuList(menuItems);
    }, [projectListContext.projectList]);

    function addNewProject(event) {
        router.push('/project/create');
    }

    const handleChange =
        (projectId: string) => (event: React.ChangeEvent<{}>, newExpanded: boolean) => {
            if (!projectId) {
                router.push('/');
            }
            setExpanded(newExpanded ? projectId : false);
        };

    const getMenuList = () => {
        return menuList.map(menuItem => {
            return (
                <Accordion
                    key={menuItem.projectId || 'all-projects'}
                    square
                    expanded={expanded === menuItem.projectId}
                    onChange={handleChange(menuItem.projectId)}
                >
                    <AccordionSummary id='accordion-summary'>
                        <Typography color='inherit'>{menuItem.title}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <List component='nav' className={classes.listRoot}>
                            {menuItem.subMenus.map((submenu, index) => {
                                return (
                                    <ListItem
                                        key={index}
                                        button
                                        component='a'
                                        className={classes.listItemRoot}
                                        selected={
                                            activeProjectID === menuItem.projectId &&
                                            activeSubRoute === submenu.route
                                        }
                                    >
                                        <Link
                                            href={`/project/${menuItem.projectId}/${submenu.route}`}
                                        >
                                            <ListItemText className={classes.listItemTextRoot}>
                                                <Typography color='inherit'>
                                                    {submenu.title}
                                                </Typography>
                                            </ListItemText>
                                        </Link>
                                    </ListItem>
                                );
                            })}
                        </List>
                    </AccordionDetails>
                </Accordion>
            );
        });
    };
    return (
        <LoggedInUserLayoutContainer>
            {!!projectListContext.projectList.length && (
                <Drawer
                    className={classes.drawer}
                    variant='permanent'
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                    anchor='left'
                >
                    {menuList ? getMenuList() : 'Loading'}
                    <Button
                        className={classes.addProjectButtomRoot}
                        variant='contained'
                        fullWidth={true}
                        color='secondary'
                        onClick={addNewProject}
                        disableElevation
                        size='small'
                    >
                        Add New Project
                    </Button>
                </Drawer>
            )}
            <div className={classes.content}>{props.children}</div>
        </LoggedInUserLayoutContainer>
    );
};
export default UserDashboardLayout;
