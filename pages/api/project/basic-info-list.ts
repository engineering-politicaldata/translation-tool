import { Project } from 'knex/types/tables';
import { authGuard } from '@backend-guards';
import { CustomErrorHandler } from '@backend-utils';
import { NextApiRequest, NextApiResponse } from 'next';
import { corsForGet } from '@backend-config';
import { getClient } from '@database';
import { runMiddleware } from '../../../lib/middleware/run-middleware';

async function getProjectsList(userId: string, isSuperAdmin: boolean) {
    const data = await getClient();
    if (isSuperAdmin) {
        return data.pg
            .select('id', 'name', 'description')
            .from<Project>('project')
            .orderBy('created');
    }

    return data.pg
        .select('prj.id', 'prj.name', 'prj.description')
        .from<Project>('project as prj')
        .innerJoin('user__project as usrprj', 'prj.id', 'usrprj.id_project')
        .whereRaw('usrprj.id_user = :userId', { userId })
        .orderBy('prj.created');
}

async function basicInfoListHandler(req: NextApiRequest, res: NextApiResponse<any>) {
    await runMiddleware(req, res, corsForGet);

    if (req.method !== 'GET') {
        return;
    }

    try {
        const { userId, isSuperAdmin } = await authGuard(req);
        const projectList = await getProjectsList(userId, isSuperAdmin);
        res.status(200).json({
            projectList,
        });
    } catch (error) {
        CustomErrorHandler(res, error, 'Error while getting project list');
    }
}

export default basicInfoListHandler;
