import { NextApiRequest, NextApiResponse } from 'next';
import { authGuard, CustomErrorHandler } from '../../../../../../lib';
import { corsForGet } from '../../../../../../lib/backend.config';
import DataProvider, { DataClient } from '../../../../../../lib/data/DataProvider';
import { Database } from '../../../../../../lib/data/PostgresProvider';
import { runMiddleware } from '../../../../../../lib/run-middleware';
import { validateAdminAccessToProject } from '../../../../../../lib/validations';

async function downloadResourceAsJSON(resourceId: string, languageId: string) {
    const data: DataClient = await DataProvider.client();
    const schema = Database.schema;
    const { rows } = await data.pg.raw(
        `SELECT json_agg(
                (
                    '{
                        "' || kr."key" || '":"' || krt.value || '"
                    }'
                )::json
            )
            FROM ${schema}.key_record__translation krt 
            INNER JOIN ${schema}.key_record kr ON krt.id_key_record = kr.id 
            WHERE kr.id_resource = :resourceId AND krt.id_language = :languageId`,
        {
            resourceId,
            languageId,
        },
    );

    if (rows[0].json_agg) {
        return Object.assign({}, ...rows[0].json_agg);
    }

    return {};
}
export default async function downloadResourceHandler(
    req: NextApiRequest,
    res: NextApiResponse<any>,
) {
    await runMiddleware(req, res, corsForGet);

    if (req.method !== 'GET') {
        return;
    }

    try {
        const { userId, isSuperAdmin } = await authGuard(req);
        const { pid, resourceId, languageId } = req.query;
        await validateAdminAccessToProject(userId, pid.toString(), isSuperAdmin);
        const resourceFile = await downloadResourceAsJSON(
            resourceId.toString(),
            languageId.toString(),
        );
        res.status(200).json(resourceFile);
    } catch (error) {
        CustomErrorHandler(res, error, 'Error while downloading resource for language');
    }
}
