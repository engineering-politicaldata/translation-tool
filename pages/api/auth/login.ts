import { USER_TOKEN } from '@backend-config';
import { NextApiRequest, NextApiResponse } from 'next';
import { corsForPost } from '@backend-config';
import { getClient } from '@database';
import { User, UserLoginInput } from '@data-model';
import { runMiddleware } from '../../../lib/middleware/run-middleware';
import { isEmailValid, isPasswordValid } from '@backend-validations';
import { ErrorCodes } from '../../../error-codes';
import {
    comparePassword,
    CustomErrorHandler,
    CustomException,
    generateToken,
    setCookie,
} from '@backend-utils';

function validateAdminLoginInput(email: string, password: string) {
    if (!isEmailValid(email)) {
        throw new CustomException('Invalid email', ErrorCodes.INVALID_EMAIL);
    }
    if (!isPasswordValid(password, 5)) {
        throw new CustomException('Invalid password', ErrorCodes.INVALID_PASSWORD);
    }
}

async function verifyAndLoginUser(input: UserLoginInput): Promise<{
    user: User;
    token: string;
}> {
    validateAdminLoginInput(input.email, input.password);

    const data = await getClient();

    const result = await data.pg('user').select('*').where({
        email: input.email,
    });
    if (!result.length) {
        throw new CustomException(`User with ${input.email} not found`, ErrorCodes.USER_NOT_FOUND);
    }
    const dbUser = result[0];
    const passwordVerified = await comparePassword(input.password, dbUser.password);
    if (!passwordVerified) {
        throw new CustomException('Invalid password', ErrorCodes.INVALID_PASSWORD);
    }
    // generate token
    const token = generateToken({
        user_id: dbUser.id,
    });
    return {
        user: {
            id: dbUser.id,
            email: dbUser.email,
            firstName: dbUser.first_name,
            lastName: dbUser.last_name,
        },
        token,
    };
}

async function userLoginHandler(req: NextApiRequest, res: NextApiResponse<any>) {
    await runMiddleware(req, res, corsForPost);
    if (req.method !== 'POST') {
        return;
    }

    try {
        const response = await verifyAndLoginUser({ ...req.body });
        // Calling our pure function using the `res` object, it will add the `set-cookie` header
        setCookie(res, USER_TOKEN, response.token);
        res.status(200).json(response);
    } catch (error) {
        CustomErrorHandler(res, error, 'Error while user login');
    }
}

export default userLoginHandler;
