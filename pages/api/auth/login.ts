import * as bcrypt from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';
import * as sha256 from 'sha256';
import {
    CustomErrorHandler,
    CustomException,
    ErrorCodes,
    generateToken,
    USER_TOKEN,
} from '../../../lib';
import { corsForPost } from '../../../lib/backend.config';
import DataProvider, { DataClient } from '../../../lib/data/DataProvider';
import { User, UserLoginInput } from '../../../lib/model';
import { runMiddleware } from '../../../lib/run-middleware';
import { isEmailValid, isPasswordValid } from '../../../lib/validations';
import { setCookie } from './../../../lib/cookies.utils';

function comparePassword(passwordInput: string, dbPassword: string) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(sha256(passwordInput), dbPassword, (_, res) => {
            resolve(res);
        });
    });
}
function validateAdminLoginInput(email: string, password: string) {
    if (!isEmailValid(email)) {
        throw new CustomException('Invalid user email', ErrorCodes.INVALID_PASSWORD);
    }
    if (!isPasswordValid(password, 5)) {
        throw new CustomException('Invalid user password', ErrorCodes.INVALID_PASSWORD);
    }
}

async function verifyAndLoginUser(input: UserLoginInput): Promise<{
    user: User;
    token: string;
}> {
    validateAdminLoginInput(input.email, input.password);

    const data: DataClient = await DataProvider.client();

    const result = await data.pg('user').select('*').where({
        email: input.email,
    });
    if (!result.length) {
        throw new CustomException('User not found', ErrorCodes.USER_NOT_FOUND);
    }
    const dbUser = result[0];
    const passwordVerified = await comparePassword(input.password, dbUser.password);
    if (!passwordVerified) {
        throw new CustomException(
            'Invalid user login credentials',
            ErrorCodes.INVALID_LOGIN_CREDENTIALS,
        );
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
