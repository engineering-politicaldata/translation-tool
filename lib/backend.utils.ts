import { NextApiResponse } from 'next';
import { ErrorCodes } from './backend.constants';

export function CustomException(message, errorCode: ErrorCodes) {
    this.message = message;
    this.errorCode = errorCode;
}

export function CustomErrorHandler(res: NextApiResponse<any>, error: any, message?: string) {
    if (error && error.errorCode) {
        res.status(200).json({
            backendError: error,
        });
        return;
    }
    res.status(500).json({
        message,
    });
}
