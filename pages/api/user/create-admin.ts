import { NextApiRequest, NextApiResponse } from 'next';
import { ErrorCodes } from '../../../error-codes';
import {
    authGuard,
    CustomErrorHandler,
    CustomException,
    CustomExceptionWithStatus,
    generateEncrypedPassword,
} from '../../../lib';
import { corsForPost } from '../../../lib/backend.config';
import DataProvider, { DataClient } from '../../../lib/data/DataProvider';
import { runMiddleware } from '../../../lib/run-middleware';
import { isEmailValid, isPasswordValid } from '../../../lib/validations';
import { CreateAdminInput } from '../../../model';

function validateCreateAdminInput(email: string, password: string) {
    if (!isEmailValid(email)) {
        throw new CustomException('Invalid email', ErrorCodes.INVALID_EMAIL);
    }
    if (!isPasswordValid(password, 5)) {
        throw new CustomException('Invalid password', ErrorCodes.INVALID_PASSWORD);
    }
}

async function createAdminWithDetails(input: CreateAdminInput) {
    // TODO Validate if admin input is correct - email and password
    // TODO validate and email is in correct format - Regx
    validateCreateAdminInput(input.email, input.password);

    const data: DataClient = await DataProvider.client();
    const encryptedPassword = await generateEncrypedPassword(input.password);
    const result = await data
        .pg('user')
        .insert({
            email: input.email,
            password: encryptedPassword,
            first_name: input.firstName,
            last_name: input.lastName,
        })
        .returning('*');

    return result[0];
}

async function createAdminHandler(req: NextApiRequest, res: NextApiResponse<any>) {
    await runMiddleware(req, res, corsForPost);
    if (req.method !== 'POST') {
        return;
    }

    try {
        const { userId, isSuperAdmin } = await authGuard(req);
        if (!isSuperAdmin) {
            throw new CustomExceptionWithStatus(
                'Permission denied',
                ErrorCodes.PERMISSION_DENIED,
                403,
            );
        }

        const newAdmin = await createAdminWithDetails({ ...req.body });

        res.status(200).json({
            email: newAdmin.email,
        });
    } catch (error) {
        CustomErrorHandler(res, error, 'Error while creating admins');
    }
}

export default createAdminHandler;
