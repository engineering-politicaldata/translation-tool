import { NextApiResponse } from 'next';
import { ErrorCodes } from './backend.constants';

export function CustomException(message, errorCode: ErrorCodes) {
    this.message = message;
    this.errorCode = errorCode;
}

export function CustomExceptionWithStatus(message, errorCode: ErrorCodes, statusCode: number) {
    this.message = message;
    this.errorCode = errorCode;
    this.statusCode = statusCode;
}

export function CustomErrorHandler(res: NextApiResponse<any>, error: any, message?: string) {
    console.log(error);

    if (error && error.errorCode) {
        res.status(error.statusCode || 200).json({
            backendError: error,
        });
        return;
    }
    res.status(500).json({
        message,
    });
}
