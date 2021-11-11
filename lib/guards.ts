import { CustomExceptionWithStatus, decodeToken } from '@backend-utils';
import { NextApiRequest } from 'next';
import { ErrorCodes } from '../error-codes';
import { USER_TOKEN } from './config';
import { getClient } from '@database';

export async function authGuard(req: NextApiRequest) {
    const userId: string = decodeToken(req.cookies[USER_TOKEN]);
    if (!userId) {
        throw new CustomExceptionWithStatus(
            'Invalid user token',
            ErrorCodes.INVALID_USER_TOKEN,
            403,
        );
    }
    const data = await getClient();
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
