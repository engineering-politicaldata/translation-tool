import { Project } from 'knex/types/tables';
import { NextApiRequest, NextApiResponse } from 'next';
import { corsForGet } from '../../../../lib/backend.config';
import DataProvider, { DataClient } from '../../../../lib/data/DataProvider';
import { runMiddleware } from '../../../../lib/run-middleware';

async function getProjectBasicInfo(projectId: string) {
    const data: DataClient = await DataProvider.client();
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
        const { pid } = req.query;
        const project = await getProjectBasicInfo(pid.toString());
        res.status(200).json(project);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Error while getting project basic info',
        });
    }
}

export default basicInfoHandler;
