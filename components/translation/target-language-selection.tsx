import {
    Button,
    CircularProgress,
    FormControl,
    IconButton,
    makeStyles,
    MenuItem,
    Select,
    Toolbar,
    Typography,
    useTheme,
} from '@material-ui/core';
import { ArrowBack, ArrowForward } from '@material-ui/icons';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import useSWR from 'swr';
import { ProjectLanguage } from '../../model';
import { GET_API_CONFIG } from '../../shared/ApiConfig';
import { handleBack } from '../../shared/Utils';

const TargetLanguageSelectionView = styled(Toolbar)`
    .go-back {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
    }
    .language-toggler {
        flex: 1;
        display: inline-flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 12px;
        justify-content: center;
        .source-language-label {
            font-size: 20px;
        }
    }

    padding: ${props => props.theme.spacing(1)}px;
    color: ${props => props.theme.grey[500]};
    background-color: ${props => props.theme.grey[100]};
`;

const useStyles = makeStyles(theme => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

interface Props {
    projectId: string;
    targetLanguageId: string;
    sourceLanguageId: string;
    changeTargetLanguage: (id: string) => void;
    setSourceLanguageId: (id: string) => void;
}
const TargetLanguageSelection = (props: Props) => {
    const theme = useTheme();
    const classes = useStyles();
    const router = useRouter();
    const { data, error } = useSWR<{ languages: ProjectLanguage[] }>([
        `/api/project/${props.projectId}/languages`,
        GET_API_CONFIG,
    ]);
    if (error)
        return (
            <TargetLanguageSelectionView theme={theme}>
                <div className='progress'>
                    <div>failed to load languages</div>
                </div>
            </TargetLanguageSelectionView>
        );

    if (!data) {
        return (
            <TargetLanguageSelectionView theme={theme}>
                <div className='create-project-container'>
                    <div className='progress'>
                        <CircularProgress size={'25px'} />
                    </div>
                </div>
            </TargetLanguageSelectionView>
        );
    }
    let allLanguages = data.languages;
    let selectedTargetLanguage = allLanguages.find(
        item => item.language.id === props.targetLanguageId,
    );
    if (!selectedTargetLanguage) {
        selectedTargetLanguage = allLanguages.find(item => !item.isSourceLanguage);
        setTimeout(() => {
            props.changeTargetLanguage(selectedTargetLanguage.language.id);
        });
    }
    const sourceLanguage = allLanguages.find(item => item.isSourceLanguage);
    if (!props.sourceLanguageId) {
        setTimeout(() => {
            props.setSourceLanguageId(sourceLanguage.language.id);
        });
    }
    return (
        <TargetLanguageSelectionView theme={theme}>
            <Button aria-label='Go Back' variant='text' onClick={() => handleBack(router)}>
                <Typography className='go-back'>
                    <ArrowBack fontSize='medium' /> Back
                </Typography>
            </Button>
            <div className='language-toggler'>
                <Typography className='source-language-label' color={'inherit'}>
                    {sourceLanguage.language.name}{' '}
                </Typography>
                <ArrowForward color={'inherit'} />
                <FormControl variant='outlined' className={classes.formControl}>
                    <Select
                        labelId='demo-simple-select-label'
                        id='demo-simple-select'
                        value={props.targetLanguageId}
                        onChange={e => {
                            props.changeTargetLanguage(e.target.value as string);
                        }}
                    >
                        {allLanguages.map(item => {
                            if (item.isSourceLanguage) {
                                return null;
                            }
                            return (
                                <MenuItem key={item.language.id} value={item.language.id}>
                                    {item.language.name} ({item.language.code})
                                </MenuItem>
                            );
                        })}
                    </Select>
                </FormControl>
            </div>
        </TargetLanguageSelectionView>
    );
};

export default TargetLanguageSelection;
