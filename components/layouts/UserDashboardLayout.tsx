import { Drawer, makeStyles, createStyles, List, ListItem, ListItemText } from '@material-ui/core';
import { Component, useEffect, useState } from 'react';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import Link from 'next/link';
import { useRouter } from 'next/router';

const LoggedInUserLayoutContainer = styled.div`
    display: flex;
`;

const drawerWidth = 240;

const useStyles = makeStyles(theme =>
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
        },
        content: {
            flexGrow: 1,
        },
        listRoot: {
            width: '100%',
            padding: 0,
            backgroundColor: theme.palette.background.paper,
        },
    }),
);

const Accordion = withStyles({
    root: {
        border: '1px solid rgba(0, 0, 0, .125)',
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
})(MuiAccordion);

const AccordionSummary = withStyles({
    root: {
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
})(MuiAccordionSummary);

const AccordionDetails = withStyles(theme => ({
    root: {
        padding: theme.spacing(2),
    },
}))(MuiAccordionDetails);

const UserDashboardLayout = props => {
    const classes = useStyles();
    const router = useRouter();
    const { projectId } = router.query;
    const [expanded, setExpanded] = useState<string | false>(false);
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

    useEffect(() => {
        if (!projectId) {
            return;
        }
        setExpanded(router.query['projectId'] ? router.query['projectId'].toString() : false);
    }, [projectId]);

    useEffect(() => {
        // get projectList api
        const dummyProjectList = [
            {
                id: 'project_id_1',
                projectName: 'Project Name 1',
                // projectDescription: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                // malesuada lacus ex, sit amet blandit leo lobortis eget. Lorem ipsum
                // dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus
                // ex, sit amet blandit leo lobortis eget.`
            },
            {
                id: 'project_id_2',
                projectName: 'Project Name 2',
                // projectDescription: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                // malesuada lacus ex, sit amet blandit leo lobortis eget.`
            },
            {
                id: 'project_id_3',
                projectName: 'Project Name 3',
                // projectDescription: `Suspendisse malesuada lacus
                // ex, sit amet blandit leo lobortis eget.`
            },
        ];
        const subMenuList = [
            { title: 'Overview', route: 'overview' },
            { title: 'Languages', route: 'languages' },
            { title: 'Resources', route: 'resources' },
            { title: 'Settings', route: 'settings' },
        ];
        setMenuList(
            dummyProjectList.map(project => {
                return {
                    projectId: project.id,
                    title: project.projectName,
                    subMenus: [...subMenuList],
                };
            }),
        );
    }, []);
    const handleChange =
        (panel: string) => (event: React.ChangeEvent<{}>, newExpanded: boolean) => {
            setExpanded(newExpanded ? panel : false);
        };
    const getMenuList = () => {
        return menuList.map(menuItem => {
            return (
                <Accordion
                    square
                    expanded={expanded === menuItem.projectId}
                    onChange={handleChange(menuItem.projectId)}
                >
                    <AccordionSummary aria-controls='panel1d-content' id='panel1d-header'>
                        <Typography>{menuItem.title}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <List component='nav' className={classes.listRoot}>
                            {menuItem.subMenus.map(submenu => {
                                return (
                                    <ListItem button component='a'>
                                        <Link
                                            href={`/project/${menuItem.projectId}/${submenu.route}`}
                                        >
                                            <ListItemText primary={submenu.title} />
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
            <Drawer
                className={classes.drawer}
                variant='permanent'
                classes={{
                    paper: classes.drawerPaper,
                }}
                anchor='left'
            >
                All Projects
                {menuList ? getMenuList() : 'Loading'}
            </Drawer>
            <div className={classes.content}>{props.children}</div>
        </LoggedInUserLayoutContainer>
    );
};
export default UserDashboardLayout;
