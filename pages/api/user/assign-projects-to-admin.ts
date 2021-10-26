import { UserProject } from 'knex/types/tables';
import { NextApiRequest, NextApiResponse } from 'next';
import {
    authGuard,
    CustomErrorHandler,
    CustomException,
    ErrorCodes,
    superAdminAuthorizationGuard,
} from '../../../lib';
import { corsForPost } from '../../../lib/backend.config';
import DataProvider, { DataClient } from '../../../lib/data/DataProvider';
import { AssginProjectsToAdminInput } from '../../../model';
import { runMiddleware } from '../../../lib/run-middleware';

async function assignProjectsToAdmin(input: AssginProjectsToAdminInput) {
    if (!input.adminEmail || !input.projectIds?.length) {
        throw new CustomException(
            'Invalid input for assigning projects to admin',
            ErrorCodes.INVALID_INPUT_FOR_ASSIGNING_PROJECTS,
        );
    }
    const data: DataClient = await DataProvider.client();
    const user = await data.pg
        .select('id')
        .from('user')
        .where({
            email: input.adminEmail,
        })
        .first();

    const projectAdminMapping = input.projectIds.map(projectId => ({
        id_user: user.id,
        id_project: projectId,
    }));

    return data.pg.insert(projectAdminMapping).into('user__project').onConflict().ignore();
}

async function assignProjectsToAdminHandler(req: NextApiRequest, res: NextApiResponse<any>) {
    await runMiddleware(req, res, corsForPost);
    if (req.method !== 'POST') {
        return;
    }

    try {
        const userId = await authGuard(req);
        await superAdminAuthorizationGuard(req, userId);

        await assignProjectsToAdmin({ ...req.body });
        res.status(200).send(true);
    } catch (error) {
        CustomErrorHandler(res, error, 'Error while assigning project to admins');
    }
}

export default assignProjectsToAdminHandler;
