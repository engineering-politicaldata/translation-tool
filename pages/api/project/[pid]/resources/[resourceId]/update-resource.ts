import { KeyRecordTranslation } from 'knex/types/tables';
import { NextApiRequest, NextApiResponse } from 'next';
import { authGuard, CustomErrorHandler } from '../../../../../../lib';
import { corsForGet } from '../../../../../../lib/backend.config';
import DataProvider, { DataClient } from '../../../../../../lib/data/DataProvider';
import { Database } from '../../../../../../lib/data/PostgresProvider';
import { runMiddleware } from '../../../../../../lib/run-middleware';
import { validateAdminAccessToProject } from '../../../../../../lib/validations';
import { UpdateResourceInput } from '../../../../../../model';

async function updateTranslationsForTragetLanguage(
    data: DataClient,
    resourceId: string,
    input: UpdateResourceInput,
) {
    let resourceData = null;
    const keyIds = input.translationKeyValueList.map(item => item.key);
    const keyRecordListResult = await data
        .pg('key_record')
        .select('*')
        .whereIn('key', keyIds)
        .andWhere('id_resource', resourceId);

    const keyRecordTranslationList: KeyRecordTranslation[] = input.translationKeyValueList
        .map(item => {
            const record = keyRecordListResult.find(keyValItem => keyValItem.key == item.key);
            if (!record) {
                return null;
            }
            return {
                id_key_record: record.id,
                id_language: input.languageId,
                value: item.text,
            };
        })
        .filter(item => item !== null);

    await data.pg
        .insert(keyRecordTranslationList, ['id_key_record'])
        .into('key_record__translation')
        .onConflict()
        .ignore();

    return {
        updated: true,
    };
}

async function updateResourceWithNewKeys(
    pid: string,
    resourceId: string,
    input: UpdateResourceInput,
) {
    const data: DataClient = await DataProvider.client();
    const schema = Database.schema;

    if (!input.isSourceLanguage) {
        const resourceData = await updateTranslationsForTragetLanguage(data, resourceId, input);
        return resourceData;
    }

    await data.pg.transaction(async trx => {
        try {
            // insert into key_record
            let resourceKeys = input.translationKeyValueList.map(item => ({
                id_resource: resourceId,
                key: item.key,
            }));

            const existingKeyRecordListResult = await data
                .pg('key_record')
                .select(['key'])
                .andWhere('id_resource', resourceId);

            resourceKeys = resourceKeys.filter(key => {
                const existing = existingKeyRecordListResult.find(item => item.key === key.key);
                return !existing;
            });

            if (!resourceKeys.length) {
                await trx.commit();
                return {
                    updated: false,
                };
            }
            const keyRecordListResult = await trx.insert(resourceKeys, '*').into('key_record');

            // insert translation into key_record__translation
            const keyRecordTranslationList: KeyRecordTranslation[] = keyRecordListResult.map(
                item => {
                    const keyValueObject = input.translationKeyValueList.find(
                        keyValItem => keyValItem.key == item.key,
                    );
                    return {
                        id_key_record: item.id,
                        id_language: input.languageId,
                        value: keyValueObject.text,
                    };
                },
            );
            await trx.insert(keyRecordTranslationList).into('key_record__translation');

            await trx.commit();
        } catch (e) {
            console.error(e);
            await trx.rollback();
        }
    });

    return {
        updated: true,
    };
}

export default async function updateResourceHandler(
    req: NextApiRequest,
    res: NextApiResponse<any>,
) {
    await runMiddleware(req, res, corsForGet);

    if (req.method !== 'POST') {
        return;
    }

    try {
        const { userId, isSuperAdmin } = await authGuard(req);
        const { pid, resourceId } = req.query;
        await validateAdminAccessToProject(userId, pid.toString(), isSuperAdmin);

        const resourceSummary = await updateResourceWithNewKeys(
            pid.toString(),
            resourceId.toString(),
            { ...req.body },
        );

        res.status(200).json(resourceSummary);
    } catch (error) {
        CustomErrorHandler(res, error, 'Error while updating the resource');
    }
}
