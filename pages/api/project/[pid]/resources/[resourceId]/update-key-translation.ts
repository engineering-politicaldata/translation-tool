import { NextApiRequest, NextApiResponse } from 'next';
import { authGuard, CustomErrorHandler, CustomException, ErrorCodes } from '../../../../../../lib';
import { corsForGet } from '../../../../../../lib/backend.config';
import DataProvider, { DataClient } from '../../../../../../lib/data/DataProvider';
import { runMiddleware } from '../../../../../../lib/run-middleware';
import { validateAdminAccessToProject } from '../../../../../../lib/validations';
import { UpdateKeyTranslation } from '../../../../../../model';

async function updateResourceWithNewKeys(input: UpdateKeyTranslation) {
    const data: DataClient = await DataProvider.client();

    if (!input.languageId) {
        throw new CustomException('', ErrorCodes.BAD_REQUEST);
    }

    const updatedRecords = await data
        .pg('key_record__translation')
        .update(
            {
                value: input.value,
            },
            ['id_key_record'],
        )
        .where({ id_key_record: input.keyRecordId, id_language: input.languageId });

    if (updatedRecords.length == 0) {
        await data.pg('key_record__translation').insert({
            id_key_record: input.keyRecordId,
            id_language: input.languageId,
            value: input.value,
        });
    }
    return {
        translated: true,
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

        const resourceSummary = await updateResourceWithNewKeys({ ...req.body });

        res.status(200).json(resourceSummary);
    } catch (error) {
        CustomErrorHandler(res, error, 'Error while getting project resource list');
    }
}
