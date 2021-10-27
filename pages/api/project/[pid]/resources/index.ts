import { NextApiRequest, NextApiResponse } from 'next';
import { authGuard, CustomErrorHandler } from '../../../../../lib';
import { corsForGet } from '../../../../../lib/backend.config';
import DataProvider, { DataClient } from '../../../../../lib/data/DataProvider';
import { Database } from '../../../../../lib/data/PostgresProvider';
import { runMiddleware } from '../../../../../lib/run-middleware';
import { validateAdminAccessToProject } from '../../../../../lib/validations';

async function getResourcesList(projectId: string) {
    const data: DataClient = await DataProvider.client();

    const schema = Database.schema;
    const resources = await data.pg.raw(
        `
        SELECT r.*, count(DISTINCT kr.id) AS source_key_count, (SELECT count(id_key_record) FROM  (
            SELECT id_key_record, 
                count(id_key_record) 
                FROM ${schema}.key_record__translation krt 
                INNER JOIN ${schema}.key_record kr ON kr.id = krt.id_key_record WHERE kr.id_resource = r.id
                GROUP BY id_key_record 
                HAVING count(id_key_record) >= (SELECT count(1) FROM ${schema}.project__language pl WHERE pl.id_project = r.id_project) 
        ) AS x) AS translated_key_count
        FROM ${schema}.resource r 
        LEFT JOIN ${schema}.key_record kr ON kr.id_resource = r.id 
        GROUP BY r.id
        HAVING r.id_project = :projectId
    `,
        { projectId },
    );

    const resourceIds = resources.rows.map(item => item.id);

    const totalSourceKeys = await data.pg
        .select(data.pg.raw('count(distinct id)'))
        .from('key_record as kr')
        .whereIn('kr.id_resource', resourceIds);

    const totalTranslatedKeys = await data.pg.raw(
        `
        SELECT count(id_key_record) FROM  (
            SELECT id_key_record, 
                count(id_key_record) 
                FROM ${schema}.key_record__translation krt 
                GROUP BY id_key_record 
                HAVING count(id_key_record) >= (SELECT count(1) FROM ${schema}.project__language pl WHERE pl.id_project = :projectId) 
        ) AS x
    `,
        { projectId },
    );

    return {
        totalResourcesCount: resourceIds.length,
        totalSourceKeys: Number((totalSourceKeys[0] as any)?.count) || 0,
        translatedKeysCount: Number(totalTranslatedKeys.rows[0]?.count) || 0, // Total number of translated strings/keys
        resources: resources.rows?.map(resource => ({
            id: resource.id,
            created: resource.created,
            sourceName: resource.resource_name,
            totalSourceKeys: Number(resource.source_key_count) || 0,
            translatedKeysCount: Number(resource.translated_key_count) || 0,
        })),
    };
}
export default async function resourcesSummarythandler(
    req: NextApiRequest,
    res: NextApiResponse<any>,
) {
    await runMiddleware(req, res, corsForGet);

    if (req.method !== 'GET') {
        return;
    }

    try {
        const { userId, isSuperAdmin } = await authGuard(req);
        const { pid } = req.query;
        await validateAdminAccessToProject(userId, pid.toString(), isSuperAdmin);
        const resourceSummary = await getResourcesList(pid.toString());
        res.status(200).json(resourceSummary);
    } catch (error) {
        CustomErrorHandler(res, error, 'Error while getting project resource list');
    }
}
