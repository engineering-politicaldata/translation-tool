import { NextApiRequest, NextApiResponse } from 'next';
import { corsForPost } from '@backend-config';
import { getClient } from '@database';
import { UpdateProjectBasicDetailsInput } from '@data-model';
import { runMiddleware } from '../../../lib/middleware/run-middleware';
import { CustomErrorHandler } from '@backend-utils';
import { authGuard } from '@backend-guards';
import { validateAdminAccessToProject } from '@backend-validations';

async function updateProjectDetails(input: UpdateProjectBasicDetailsInput) {
    const data = await getClient();

    const updated = await data
        .pg('project')
        .update({
            name: input.name,
            description: input.description,
            updated: `now()`,
        })
        .returning('id')
        .where({
            id: input.id,
        });
    return updated[0];
}

async function updateProjectHandler(req: NextApiRequest, res: NextApiResponse<any>) {
    await runMiddleware(req, res, corsForPost);
    if (req.method !== 'POST') {
        return;
    }

    try {
        const { userId, isSuperAdmin } = await authGuard(req);
        await validateAdminAccessToProject(userId, req.body.id, isSuperAdmin);
        const id = await updateProjectDetails({ ...req.body });
        res.status(200).json({
            id,
        });
    } catch (error) {
        CustomErrorHandler(res, error, 'Error while updating the project details');
    }
}

export default updateProjectHandler;
