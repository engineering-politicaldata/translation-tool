import { NextApiRequest } from 'next';
import { CustomExceptionWithStatus, decodeToken, ErrorCodes, USER_TOKEN } from '.';
import DataProvider, { DataClient } from './data/DataProvider';

export async function authGuard(req: NextApiRequest) {
    const userId: string = decodeToken(req.cookies[USER_TOKEN]);
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
    const superAdminResult = await data.pg('super_admin').select('*').where({
        id_user: userId,
    });

    return {
        userId,
        isSuperAdmin: !!superAdminResult.length,
    };
}
