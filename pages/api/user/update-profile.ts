import { NextApiRequest, NextApiResponse } from 'next';
import { authGuard, CustomErrorHandler } from '../../../lib';
import { corsForPost } from '../../../lib/backend.config';
import { User } from '../../../model';
import { runMiddleware } from '../../../lib/run-middleware';

async function saveUserProfile(input: User) {}

async function userProfileHandler(req: NextApiRequest, res: NextApiResponse<any>) {
    await runMiddleware(req, res, corsForPost);
    if (req.method !== 'POST') {
        return;
    }

    try {
        const userId = await authGuard(req);

        await saveUserProfile({ ...req.body });
        res.status(200).send(true);
    } catch (error) {
        CustomErrorHandler(res, error, 'Error while assigning project to admins');
    }
}

export default userProfileHandler;
