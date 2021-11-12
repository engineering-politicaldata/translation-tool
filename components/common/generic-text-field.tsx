import { FormHelperText } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import TextField, { TextFieldProps } from '@material-ui/core/TextField';
import React, { useEffect, useRef, useState } from 'react';
import { CustomTheme } from '../../styles/MuiTheme';

const useStyles = makeStyles((theme: CustomTheme) => ({
    root: {
        '& .MuiTextField-root': {
            height: '56px',
        },
        '& .MuiFormLabel-root': {
            lineHeight: '18px',
        },
        '& .MuiInputLabel-formControl': {
            left: '-5px',
        },
        '& .MuiFilledInput-root': {
            background: theme.contrastColor,
            '&.Mui-focused': {
                background: theme.contrastColor,
            },
        },

        '& .MuiFilledInput-input': {
            paddingLeft: '8px',
            paddingRight: '8px',
        },
        '& .MuiFilledInput-multiline': {
            paddingLeft: '0',
        },
        '& .MuiFilledInput-inputMultiline': {
            paddingLeft: '8px',
            paddingRight: '8px',
        },
        '& .MuiFormHelperText-root': {
            minHeight: '20px',
            fontSize: '13px',
            lineHeight: '18px',
        },
        '& .MuiFilledInput-underline:before': {
            borderBottom: `2px solid ${theme.grey[500]}`,
        },
        '& .MuiFilledInput-underline:after': {
            borderBottom: `3px solid ${theme.secondary[500]}`,
        },
        '& .MuiFilledInput-underline:hover:before': {
            borderBottomColor: theme.grey[500],
        },
        '& .MuiFilledInput-underline.Mui-error:after': {
            borderBottomColor: '#FF1744',
            borderBottomWidth: '2px',
        },
        '& .MuiInputBase-root': {
            height: 'inherit',
            paddingRight: '32px',
        },
    },
    helperView: {
        display: 'flex',
        justifyContent: 'flex-end',
        padding: '0 2px',
        '& .MuiFormHelperText-root': {
            flex: 1,
        },
        '& .counter': {
            fontSize: '12px',
            flex: 'none',
            color: '#777777',
            lineHeight: '18px',
            marginTop: '3px',
        },
    },
}));

export interface GenericTextFieldInputProps {
    isControlledField?: boolean;
    label: string;
    helperMessage?: any; // This can be either a view or simple string value
    error?: boolean;
    fieldName: string;
    textFieldProps: TextFieldProps;
    onChange: (field: string, value: any, event: any) => void;
    onReset?: (field: string) => void;
    handleBlur?: (event: any) => void;
    handleFocus?: (event: any) => void;
    defaultValue: string;
    inputStyles?: any;
    charCounter?: number; // show char counter if char counter is > 0
}
export default function GenericTextField(props: GenericTextFieldInputProps) {
    const classes = useStyles();
    const [cancelIconVisibilty, toggleCancelIconVisibility] = useState<boolean>(
        !!props.defaultValue,
    );
    const [value, setValue] = useState<string>(props.defaultValue);
    const [clearButtonTop, setClearButtonTop] = useState<number>(25);

    const textfieldRef = useRef(null);
    useEffect(() => {
        if (props.isControlledField && props.defaultValue !== value) {
            setValue(props.defaultValue);
            if (props.defaultValue) {
                toggleCancelIconVisibility(true);
            }
        }
    }, [props.defaultValue]);

    useEffect(() => {
        calculateClearTop();
    }, []);

    function calculateClearTop() {
        setTimeout(() => {
            if (textfieldRef.current) {
                const inputHeight = (textfieldRef.current as any).clientHeight;
                const top = inputHeight - 56 + 25;
                if (top !== clearButtonTop) {
                    setClearButtonTop(top);
                }
            }
        });
    }
    const onFieldChange = (event: any) => {
        setValue(event.target.value);

        if (props.textFieldProps.multiline) {
            calculateClearTop();
        }

        props.onChange(props.fieldName, event.target.value, event);
        toggleCancelIconVisibility(!!event.target.value);
    };
    const clearField = () => {
        setValue('');
        toggleCancelIconVisibility(false);
        if (props.onReset) props.onReset(props.fieldName);
    };
    const customStyle: any = {};
    const customInputStyle = props.inputStyles;
    if (props.textFieldProps.multiline) {
        customStyle['height'] = 'auto';
    }

    return (
        <div className={classes.root}>
            <div style={{ position: 'relative' }}>
                <TextField
                    {...props.textFieldProps}
                    id={props.fieldName}
                    name={props.fieldName}
                    label={props.label}
                    variant='filled'
                    onChange={e => onFieldChange(e)}
                    onBlur={props.handleBlur}
                    onFocus={props.handleFocus}
                    fullWidth={true}
                    value={value}
                    autoComplete='off'
                    style={customStyle}
                    error={props.error}
                    InputProps={{
                        style: customInputStyle,
                    }}
                    ref={textfieldRef}
                    color={'secondary'}
                />
                <div className={classes.helperView}>
                    <FormHelperText component='div' error={!!props.error}>
                        {props.helperMessage ? props.helperMessage : ' '}
                    </FormHelperText>
                    {!!props.charCounter && (
                        <span className='counter'>
                            {value.length} / {props.charCounter} chars
                        </span>
                    )}
                </div>
                {props.onReset && cancelIconVisibilty && (
                    <img
                        src='/images/icons/clear-button-icon.svg'
                        onClick={() => clearField()}
                        style={{
                            color: '#ADADAD',
                            position: 'absolute',
                            top: clearButtonTop + 'px',
                            right: '8px',
                            fontSize: '20px',
                        }}
                    />
                )}
            </div>
        </div>
    );
}

GenericTextField.defaultProps = {
    isControlledField: false,
};
