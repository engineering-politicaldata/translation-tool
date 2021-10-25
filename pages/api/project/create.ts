import { NextApiRequest, NextApiResponse } from 'next';
import { corsForPost } from '../../../lib/backend.config';
import { CustomErrorHandler, CustomException } from '../../../lib/backend.utils';
import { ErrorCodes } from '../../../lib/backend.constants';
import DataProvider, { DataClient } from '../../../lib/data/DataProvider';
import { CreateProjectInput } from '../../../lib/model';
import { runMiddleware } from '../../../lib/run-middleware';

async function createProjectWithDetails(input: CreateProjectInput) {
    const data: DataClient = await DataProvider.client();

    const projectAlreadyExists = await data.pg
        .select('id')
        .from('project')
        .where('name ILIKE input.name')
        .first();

    if (projectAlreadyExists) {
        throw new CustomException('Project Already Exits', ErrorCodes.PROJECT_ALREADY_EXISTS);
    }

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
