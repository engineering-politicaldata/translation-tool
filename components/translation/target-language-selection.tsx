import {
    CircularProgress,
    FormControl,
    makeStyles,
    MenuItem,
    Select,
    Typography,
    useTheme,
} from '@material-ui/core';
import { ArrowForward } from '@material-ui/icons';
import styled from 'styled-components';
import useSWR from 'swr';
import { ProjectLanguage } from '../../model';
import { GET_API_CONFIG } from '../../shared/ApiConfig';

const TargetLanguageSelectionView = styled.div`
    display: inline-flex;
    flex-wrap: wrap;
    gap: 12px;
    justify-content: center;
    align-items: center;
    padding: ${props => props.theme.spacing(1)}px;
    color: ${props => props.theme.grey[500]};
    background-color: ${props => props.theme.secondary[100]};
    .source-language-label {
        font-size: 20px;
    }
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
        </TargetLanguageSelectionView>
    );
};

export default TargetLanguageSelection;
