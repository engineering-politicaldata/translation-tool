import { NextApiRequest, NextApiResponse } from 'next';
import { authGuard, CustomErrorHandler, joinAndQuote } from '../../../../../../lib';
import { corsForGet } from '../../../../../../lib/backend.config';
import DataProvider, { DataClient } from '../../../../../../lib/data/DataProvider';
import { Database } from '../../../../../../lib/data/PostgresProvider';
import { runMiddleware } from '../../../../../../lib/run-middleware';
import { validateAdminAccessToProject } from '../../../../../../lib/validations';
import { TranslationKeyRecord } from '../../../../../../model';

async function getTranslationRecords(
    resourceId: string,
    input: { languageIds: string[] },
): Promise<TranslationKeyRecord[]> {
    const data: DataClient = await DataProvider.client();
    const schema = Database.schema;

    const { rows } = await data.pg.raw(
        `
        select kr.id, kr."key", json_agg(
            format('{"languageId": %s,"value": %s}',
                to_json(l.id::text), 
                to_json(krt.value::text) 
            )::json
            
        ) 
        from ${schema}.key_record__translation krt 
        inner join ${schema}."language" l on krt.id_language = l.id 
        inner join ${schema}.key_record kr on krt.id_key_record = kr.id 
        where kr.id_resource = :resourceId and l.id in (${joinAndQuote(input.languageIds)})
        group by kr.id
    `,
        {
            resourceId,
        },
    );

    return rows.map(row => {
        return {
            keyRecordId: row.id,
            key: row.key,
            translations: row.json_agg,
        };
    });
}
export default async function translationRecordHandler(
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
        const translationRecords = await getTranslationRecords(resourceId.toString(), {
            ...req.body,
        });
        res.status(200).json(translationRecords);
    } catch (error) {
        CustomErrorHandler(res, error, 'Error while getting record translations');
    }
}
