import { NextApiRequest, NextApiResponse } from 'next';
import { corsForPost } from '@backend-config';
import { CustomErrorHandler, CustomException } from '@backend-utils';
import { getClient } from '@database';
import { CreateProjectInput } from '@data-model';
import { runMiddleware } from '../../../lib/middleware/run-middleware';
import { ErrorCodes } from '../../../error-codes';
import { authGuard } from '@backend-guards';

async function createProjectWithDetails(input: CreateProjectInput, userId: string) {
    const data = await getClient();

    const projectAlreadyExists = await data.pg.select('id').from('project').where({
        name: input.name,
    });

    if (projectAlreadyExists.length !== 0) {
        throw new CustomException(
            'A Project with the given name already exists',
            ErrorCodes.PROJECT_ALREADY_EXISTS,
        );
    }

    let projectId = null;
    await data.pg.transaction(async trx => {
        try {
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

            await trx('user__project').insert({
                id_user: userId,
                id_project: projectId,
            });
            await trx.commit();
        } catch (e) {
            console.error(e);
            projectId = null;
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
        const { userId, isSuperAdmin } = await authGuard(req);
        // TODO throw error name already exists or name is empty https://votercircle.atlassian.net/browse/TT-3
        const projectId = await createProjectWithDetails({ ...req.body }, userId);
        res.status(200).json({
            id: projectId,
        });
    } catch (error) {
        CustomErrorHandler(res, error, 'Error while creating project');
    }
}

export default createProjectHandler;
