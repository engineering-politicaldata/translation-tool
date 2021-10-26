import { NextApiRequest, NextApiResponse } from 'next';
import { authGuard, CustomErrorHandler } from '../../../lib';
import { corsForPost } from '../../../lib/backend.config';
import DataProvider, { DataClient } from '../../../lib/data/DataProvider';
import { UpdateProjectBasicDetailsInput } from '../../../model';
import { runMiddleware } from '../../../lib/run-middleware';

async function updateProjectDetails(input: UpdateProjectBasicDetailsInput) {
    const data: DataClient = await DataProvider.client();
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
        await authGuard(req);
        const id = await updateProjectDetails({ ...req.body });
        res.status(200).json({
            id,
        });
    } catch (error) {
        CustomErrorHandler(res, error, 'Error while updating the project details');
    }
}

export default updateProjectHandler;
