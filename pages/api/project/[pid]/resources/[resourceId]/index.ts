import { NextApiRequest, NextApiResponse } from 'next';
import { authGuard, CustomErrorHandler } from '../../../../../../lib';
import { corsForGet } from '../../../../../../lib/backend.config';
import DataProvider, { DataClient } from '../../../../../../lib/data/DataProvider';
import { Database } from '../../../../../../lib/data/PostgresProvider';
import { runMiddleware } from '../../../../../../lib/run-middleware';
import { validateAdminAccessToProject } from '../../../../../../lib/validations';
import { ResourceSummary, ResourceSummaryByLanguage } from '../../../../../../model';

async function getResourceSummary(projectId: string, resourceId: string): Promise<ResourceSummary> {
    const data: DataClient = await DataProvider.client();
    const schema = Database.schema;
    const resource = await data.pg('resource').select('resource_name').first().where({
        id: resourceId,
    });

    const { rows } = await data.pg.raw(
        `
        SELECt  l.id , l.code ,l."name", COUNT(DISTINCT kr.id) AS key_count , (select 
            pl.is_source_language
            FROM ${schema}.project__language pl  
            INNER JOIN ${schema}.resource r ON r.id  = kr.id_resource 
            WHERE pl.id_language = l.id AND pl.id_project = r.id_project) AS is_source_language 
        FROM ${schema}.key_record kr 
        INNER JOIN ${schema}.key_record__translation krt ON kr.id = krt.id_key_record 
        INNER JOIN ${schema}."language" l ON krt.id_language = l.id 
        WHERE kr.id_resource  = :resourceId
        GROUP BY l.id, kr.id_resource
    `,
        {
            resourceId,
        },
    );
    const projectLanguages = await data
        .pg('project__language')
        .select('*')
        .join('language', 'language.id', '=', 'project__language.id_language')
        .where({
            id_project: projectId,
        });

    const summaryList: ResourceSummaryByLanguage[] = [];
    projectLanguages.forEach(plItem => {
        const languageSummary = rows.find(item => item.id === plItem.id_language);
        if (!languageSummary) {
            summaryList.push({
                languageCode: plItem.code,
                languageId: plItem.id,
                isSourceLanguage: plItem.is_source_language,
                translatedKeyCount: 0,
                languageName: plItem.name,
            });
            return;
        }
        summaryList.push({
            languageCode: languageSummary.code,
            languageId: languageSummary.id,
            isSourceLanguage: languageSummary.is_source_language,
            translatedKeyCount: languageSummary.key_count,
            languageName: languageSummary.name,
        });
    });
    return {
        resourceName: resource.resource_name,
        resourceSummaryListByLanguage: summaryList,
    };
}
export default async function resourceSummaryHandler(
    req: NextApiRequest,
    res: NextApiResponse<any>,
) {
    await runMiddleware(req, res, corsForGet);

    if (req.method !== 'GET') {
        return;
    }

    try {
        const { userId, isSuperAdmin } = await authGuard(req);
        const { pid, resourceId } = req.query;
        await validateAdminAccessToProject(userId, pid.toString(), isSuperAdmin);
        const resourceSummary = await getResourceSummary(pid.toString(), resourceId.toString());
        res.status(200).json(resourceSummary);
    } catch (error) {
        CustomErrorHandler(res, error, 'Error while getting resource summary');
    }
}
