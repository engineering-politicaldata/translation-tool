import { NextApiRequest, NextApiResponse } from 'next';
import { User } from '@data-model';
import { runMiddleware } from '../../../lib/middleware/run-middleware';
import { authGuard } from '@backend-guards';
import { CustomErrorHandler } from '@backend-utils';
import { corsForPost } from '@backend-config';

async function saveUserProfile(input: User) {}

async function userProfileHandler(req: NextApiRequest, res: NextApiResponse<any>) {
    await runMiddleware(req, res, corsForPost);
    if (req.method !== 'POST') {
        return;
    }

    try {
        const { userId, isSuperAdmin } = await authGuard(req);

        await saveUserProfile({ ...req.body });
        res.status(200).send(true);
    } catch (error) {
        CustomErrorHandler(res, error, 'Error while assigning project to admins');
    }
}

export default userProfileHandler;
