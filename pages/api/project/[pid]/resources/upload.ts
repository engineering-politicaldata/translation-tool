import { KeyRecordTranslation } from 'knex/types/tables';
import { NextApiRequest, NextApiResponse } from 'next';
import { corsForPost } from '../../../../../lib/backend.config';
import DataProvider, { DataClient } from '../../../../../lib/data/DataProvider';
import { UploadResourcForProjectInput } from '../../../../../lib/model';
import { runMiddleware } from '../../../../../lib/run-middleware';

async function saveResourceData(input: UploadResourcForProjectInput) {
    const data: DataClient = await DataProvider.client();
    let resourceData = null;
    await data.pg.transaction(async trx => {
        try {
            // create resource
            const newResource: {
                id: string;
                created: string;
            }[] = await trx('resource').returning(['id', 'created']).insert({
                resource_name: input.sourceName,
                id_project: input.projectId,
            });
            const resourceId = newResource[0].id;

            // insert into key_record
            const resourceKeys = input.translationKeyValueList.map(item => ({
                id_resource: resourceId,
                key: item.key,
            }));
            const keyRecordList = await trx.insert(resourceKeys, '*').into('key_record');

            // insert translation into key_record__translation
            const sourceLanguage = await trx.select('id_language').from('project__language').where({
                id_project: input.projectId,
                is_source_language: true,
            });

            const keyRecordTranslationList: KeyRecordTranslation[] = keyRecordList.map(item => {
                const keyValueObject = input.translationKeyValueList.find(
                    keyValItem => keyValItem.key == item.key,
                );
                return {
                    id_key_record: item.id,
                    id_language: sourceLanguage[0].id_language,
                    value: keyValueObject.text,
                };
            });
            await trx.insert(keyRecordTranslationList).into('key_record__translation');

            resourceData = newResource[0];

            trx();
            await trx.commit();
        } catch (e) {
            console.error(e);
            await trx.rollback();
        }
    });

    return resourceData;
}

async function uploadResourceHandler(req: NextApiRequest, res: NextApiResponse<any>) {
    await runMiddleware(req, res, corsForPost);
    if (req.method !== 'POST') {
        return;
    }

    try {
        const resourceData = await saveResourceData({ ...req.body });
        console.log(resourceData);

        res.status(200).json(resourceData);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Error while updating the project details',
        });
    }
}

export default uploadResourceHandler;
