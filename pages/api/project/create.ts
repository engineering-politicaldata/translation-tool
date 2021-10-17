import Cors from 'cors';
import { NextApiRequest, NextApiResponse } from 'next';
import DataProvider, { DataClient } from '../../../lib/data/DataProvider';
import { Database } from '../../../lib/data/PostgresProvider';
import { runMiddleware } from '../../../lib/run-middleware';
import { CreateProjectInput } from '../../../lib/model';
// Initializing the cors middleware
const cors = Cors({
    methods: ['POST'],
    origin: true,
});

async function createProjectWithDetails(input: CreateProjectInput) {
    const data: DataClient = await DataProvider.client();
    let projectId = null;
    await data.pg.transaction(async trx => {
        try {
            // FIXME move table name to mapper function
            const newProject = await trx('project').returning('id').insert({
                name: input.name,
                description: input.description,
            });
            projectId = newProject[0];
            // update project source language
            await trx('project__language').insert({
                id_project: projectId,
                id_language: input.sourceLanguageId,
                is_source_language: true,
            });
            // update project target language
            for (const id_language of input.targetLanguageIds) {
                await trx('project__language').insert({
                    id_project: projectId,
                    id_language,
                });
            }
            trx();
            await trx.commit();
        } catch (e) {
            console.error(e);
            await trx.rollback();
        }
    });
    // create project

    return projectId;
}

async function createProjectHandler(req: NextApiRequest, res: NextApiResponse<any>) {
    await runMiddleware(req, res, cors);
    if (req.method !== 'POST') {
        return;
    }
    try {
        const projectId = await createProjectWithDetails({ ...req.body });
        res.status(200).json({
            id: projectId,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Error while creating project',
        });
    }
}

export default createProjectHandler;
