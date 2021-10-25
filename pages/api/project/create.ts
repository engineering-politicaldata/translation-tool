import { NextApiRequest, NextApiResponse } from 'next';
import { authGuard } from '../../../lib';
import { corsForPost } from '../../../lib/backend.config';
import { CustomErrorHandler } from '../../../lib/backend.utils';
import DataProvider, { DataClient } from '../../../lib/data/DataProvider';
import { CreateProjectInput } from '../../../lib/model';
import { runMiddleware } from '../../../lib/run-middleware';

async function createProjectWithDetails(input: CreateProjectInput) {
    const data: DataClient = await DataProvider.client();
    let projectId = null;
    await data.pg.transaction(async trx => {
        try {
            // FIXME move table name to mapper function
            const result = await trx('project').returning('id').insert({
                name: input.name,
                description: input.description,
            });
            projectId = result[0];
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
    if (!projectId) {
        throw Error('Error while creating project');
    }
    return projectId;
}

async function createProjectHandler(req: NextApiRequest, res: NextApiResponse<any>) {
    await runMiddleware(req, res, corsForPost);
    if (req.method !== 'POST') {
        return;
    }
    try {
        await authGuard(req);
        // TODO throw error name already exists or name is empty https://votercircle.atlassian.net/browse/TT-3
        const projectId = await createProjectWithDetails({ ...req.body });
        res.status(200).json({
            id: projectId,
        });
    } catch (error) {
        CustomErrorHandler(res, error, 'Error while creating project');
    }
}

export default createProjectHandler;
