import { NextApiRequest, NextApiResponse } from 'next';
import { runMiddleware } from '../../../lib/run-middleware';
import Cors from 'cors';
import DataProvider, { DataClient } from '../../../lib/data/DataProvider';
import { Project } from 'knex/types/tables';

// Initializing the cors middleware
const cors = Cors({
    methods: ['GET'],
    origin: true,
});

async function getProjectsList() {
    const data: DataClient = await DataProvider.client();
    return data.pg.select('id', 'name', 'description').from<Project>('project');
}

async function basicInfoList(req: NextApiRequest, res: NextApiResponse<any>) {
    await runMiddleware(req, res, cors);

    if (req.method !== 'GET') {
        return;
    }

    try {
        const projectList = await getProjectsList();
        res.status(200).json({
            projectList,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Error while getting project list',
        });
    }
}

export default basicInfoList;
