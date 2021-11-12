import { authGuard } from '@backend-guards';
import { CustomErrorHandler } from '@backend-utils';
import { NextApiRequest, NextApiResponse } from 'next';
import { corsForGet } from '@backend-config';
import { getClient } from '@database';
import { Database } from '../../../../../../lib/data/PostgresProvider';
import { runMiddleware } from '../../../../../../lib/middleware/run-middleware';
import { validateAdminAccessToProject } from '@backend-validations';

async function downloadResourceAsJSON(resourceId: string, languageId: string) {
    const data = await getClient();
    const schema = Database.schema;
    const { rows } = await data.pg.raw(
        `SELECT json_agg(
                    format('{%s : %s}',
                    to_json(kr."key"::text), 
                    to_json(krt.value::text) 
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
