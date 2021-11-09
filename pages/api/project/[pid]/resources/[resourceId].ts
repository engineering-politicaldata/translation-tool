import { NextApiRequest, NextApiResponse } from 'next';
import { authGuard, CustomErrorHandler } from '../../../../../lib';
import { corsForGet } from '../../../../../lib/backend.config';
import DataProvider, { DataClient } from '../../../../../lib/data/DataProvider';
import { Database } from '../../../../../lib/data/PostgresProvider';
import { runMiddleware } from '../../../../../lib/run-middleware';
import { validateAdminAccessToProject } from '../../../../../lib/validations';

async function getResourceSummary(resourceId: string) {
    const data: DataClient = await DataProvider.client();

    const schema = Database.schema;
}
export default async function resourceSummaryhandler(
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
        const resourceSummary = await getResourceSummary(resourceId.toString());
        res.status(200).json(resourceSummary);
    } catch (error) {
        CustomErrorHandler(res, error, 'Error while getting project resource list');
    }
}
