import { NextApiRequest } from 'next';
import { CustomExceptionWithStatus, decodeToken, ErrorCodes, USER_TOKEN } from '.';
import DataProvider, { DataClient } from './data/DataProvider';

export async function authGuard(req: NextApiRequest) {
    const userId = decodeToken(req.cookies[USER_TOKEN]);
    if (!userId) {
        throw new CustomExceptionWithStatus(
            'Invalid user token',
            ErrorCodes.INVALID_USER_TOKEN,
            403,
        );
    }
    const data: DataClient = await DataProvider.client();
    const result = await data.pg('user').select('id').where({
        id: userId,
    });
    if (!result.length) {
        throw new CustomExceptionWithStatus('Invalid user', ErrorCodes.INVALID_USER, 403);
    }
    return userId;
}

export async function superAdminAuthorizationGuard(req: NextApiRequest, userId: string) {
    const data: DataClient = await DataProvider.client();
    const result = await data.pg('super_admin').select('*').where({
        id_user: userId,
    });
    if (!result.length) {
        throw new CustomExceptionWithStatus('Permission denied', ErrorCodes.PERMISSION_DENIED, 403);
    }
}
