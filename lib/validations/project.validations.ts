import { CustomExceptionWithStatus } from '..';
import { ErrorCodes } from '../../error-codes';
import DataProvider, { DataClient } from '../data/DataProvider';

export async function validateAdminAccessToProject(
    userId: string,
    projectId: string,
    isSuperAdmin: boolean,
) {
    let hasAccess = false;
    if (isSuperAdmin) {
        hasAccess = true;
    }

    if (!hasAccess) {
        const data: DataClient = await DataProvider.client();
        const result = await data.pg.count('*').from('user__project').where({
            id_user: userId,
            id_project: projectId,
        });

        hasAccess = result.length && Number(result[0].count) > 0;
    }

    if (!hasAccess) {
        throw new CustomExceptionWithStatus(
            'Admin does not have permission to update ',
            ErrorCodes.PERMISSION_DENIED,
            403,
        );
    }
}
