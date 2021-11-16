import { KeyRecordTranslation } from 'knex/types/tables';
import { NextApiRequest, NextApiResponse } from 'next';
import { corsForPost } from '@backend-config';
import { CustomErrorHandler, CustomException } from '@backend-utils';
import { getClient } from '@database';
import { UploadResourceInput } from '@data-model';
import { runMiddleware } from '../../../../../lib/middleware/run-middleware';
import { validateAdminAccessToProject } from '@backend-validations';
import { ErrorCodes } from '../../../../../error-codes';
import { authGuard } from '@backend-guards';

async function saveResourceData(input: UploadResourceInput) {
    const data = await getClient();
    let resourceData = null;
    await data.pg.transaction(async trx => {
        try {
            // create resource
            const createResourceResult: {
                id: string;
                created: string;
            }[] = await trx('resource').returning(['id', 'created']).insert({
                resource_name: input.sourceName,
                id_project: input.projectId,
            });
            const resourceId = createResourceResult[0].id;

            // insert into key_record
            const resourceKeys = input.translationKeyValueList.map(item => ({
                id_resource: resourceId,
                key: item.key,
            }));
            const keyRecordListResult = await trx.insert(resourceKeys, '*').into('key_record');

            // insert translation into key_record__translation
            const sourceLanguage = await trx.select('id_language').from('project__language').where({
                id_project: input.projectId,
                is_source_language: true,
            });

            const keyRecordTranslationList: KeyRecordTranslation[] = keyRecordListResult.map(
                item => {
                    const keyValueObject = input.translationKeyValueList.find(
                        keyValItem => keyValItem.key == item.key,
                    );
                    return {
                        id_key_record: item.id,
                        id_language: sourceLanguage[0].id_language,
                        value: keyValueObject.text,
                    };
                },
            );
            await trx.insert(keyRecordTranslationList).into('key_record__translation');

            resourceData = createResourceResult[0];

            await trx.commit();
        } catch (e) {
            console.error(e);
            await trx.rollback();
        }
    });

    return resourceData;
}

async function verifyIfResourceAlreadyExists(input: UploadResourceInput) {
    const data = await getClient();
    const existingResource = await data.pg
        .select('id')
        .from('resource')
        .where({
            id_project: input.projectId,
            resource_name: input.sourceName,
        })
        .first();
    if (existingResource) {
        throw new CustomException('Resource Already Exits', ErrorCodes.RESOURCE_ALREADY_EXITS);
    }
}

async function uploadResourceHandler(req: NextApiRequest, res: NextApiResponse<any>) {
    await runMiddleware(req, res, corsForPost);
    if (req.method !== 'POST') {
        return;
    }

    try {
        const { userId, isSuperAdmin } = await authGuard(req);
        await validateAdminAccessToProject(userId, req.body.projectId, isSuperAdmin);
        await verifyIfResourceAlreadyExists({ ...req.body });
        const resourceData = await saveResourceData({ ...req.body });

        res.status(200).json(resourceData);
    } catch (error) {
        CustomErrorHandler(res, error, 'Error while updating the project details');
    }
}

export default uploadResourceHandler;
