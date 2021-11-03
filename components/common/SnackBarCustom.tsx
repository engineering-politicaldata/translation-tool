import { Snackbar, Fade, SnackbarContent, withStyles } from '@material-ui/core';
import React from 'react';
import { SnackbarProps } from '@material-ui/core/Snackbar';

const SnackbarContentStyled = withStyles({
    message: {
        textAlign: 'center',
        width: '100%',
    },
})(SnackbarContent);

interface Props {
    message: string; // Message tobe displayed
    snackbarProps: SnackbarProps; // additional snackbar properties
    bottomPercent?: number;
}
const SnackBarCustom = (props: Props) => {
    return (
        <Snackbar
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            autoHideDuration={6000}
            TransitionComponent={Fade}
            style={{ position: 'fixed', bottom: `${props.bottomPercent}%`, margin: 'auto' }}
            {...props.snackbarProps}
        >
            <SnackbarContentStyled
                style={{
                    borderRadius: '5px',
                }}
                message={props.message}
            />
        </Snackbar>
    );
};

const DEFAULT_BOTTOM_PERCENT = 5;
SnackBarCustom.defaultProps = {
    bottomPercent: DEFAULT_BOTTOM_PERCENT,
};
export default SnackBarCustom;
