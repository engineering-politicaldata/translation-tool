import { Project } from 'knex/types/tables';
import { NextApiRequest, NextApiResponse } from 'next';
import { authGuard, CustomErrorHandler } from '../../../lib';
import { corsForGet } from '../../../lib/backend.config';
import DataProvider, { DataClient } from '../../../lib/data/DataProvider';
import { runMiddleware } from '../../../lib/run-middleware';

async function getProjectsList() {
    const data: DataClient = await DataProvider.client();
    return data.pg.select('id', 'name', 'description').from<Project>('project').orderBy('created');
}

async function basicInfoListHandler(req: NextApiRequest, res: NextApiResponse<any>) {
    await runMiddleware(req, res, corsForGet);

    if (req.method !== 'GET') {
        return;
    }

    try {
        await authGuard(req);
        const projectList = await getProjectsList();
        res.status(200).json({
            projectList,
        });
    } catch (error) {
        CustomErrorHandler(res, error, 'Error while getting project list');
    }
}

export default basicInfoListHandler;
