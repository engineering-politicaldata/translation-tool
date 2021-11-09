import { NextApiRequest, NextApiResponse } from 'next';
import DataProvider from '../../../../lib/data/DataProvider';
import { Database } from '../../../../lib/data/PostgresProvider';
import { runMiddleware } from '../../../../lib/run-middleware';
import { corsForGet } from './../../../../lib/backend.config';
import { ProjectLanguage } from './../../../../model/project';

async function getProjectLanguages(projectId: string): Promise<ProjectLanguage[]> {
    const client = await DataProvider.client();
    const s = Database.schema;
    const { rows } = await client.pg.raw(
        `
        SELECT * 
	        FROM ${s}.project__language pl 
	        INNER JOIN ${s}."language" l on l.id = pl.id_language 
	        WHERE pl.id_project = :projectId;
    `,
        {
            projectId,
        },
    );

    return rows.map(row => ({
        language: {
            id: row.id_language,
            code: row.code,
            name: row.name,
        },
        isSourceLanguage: row.is_source_language,
    }));
}

async function projectLanguagesHandler(req: NextApiRequest, res: NextApiResponse<any>) {
    await runMiddleware(req, res, corsForGet);

    if (req.method !== 'GET') {
        return;
    }

    try {
        const { pid } = req.query;
        const languages = await getProjectLanguages(pid.toString());

        res.status(200).json({
            languages,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Error while getting language list',
        });
    }
}

export default projectLanguagesHandler;
