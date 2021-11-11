import { Project } from 'knex/types/tables';
import { authGuard } from '@backend-guards';
import { CustomErrorHandler } from '@backend-utils';
import { NextApiRequest, NextApiResponse } from 'next';
import { corsForGet } from '@backend-config';
import { getClient } from '@database';
import { runMiddleware } from '../../../../lib/middleware/run-middleware';
import { validateAdminAccessToProject } from '@backend-validations';

async function getProjectBasicInfo(projectId: string) {
    const data = await getClient();

    const project = data.pg
        .select('id', 'name', 'description')
        .from<Project>('project')
        .where({
            id: projectId,
        })
        .first();
    return project;
}

async function basicInfoHandler(req: NextApiRequest, res: NextApiResponse<any>) {
    await runMiddleware(req, res, corsForGet);

    if (req.method !== 'GET') {
        return;
    }

    try {
        const { userId, isSuperAdmin } = await authGuard(req);
        const { pid } = req.query;
        await validateAdminAccessToProject(userId, pid.toString(), isSuperAdmin);
        const project = await getProjectBasicInfo(pid.toString());
        res.status(200).json(project);
    } catch (error) {
        CustomErrorHandler(res, error, 'Error while getting project basic info');
    }
}

export default basicInfoHandler;
