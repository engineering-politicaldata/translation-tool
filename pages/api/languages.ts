import { NextApiRequest, NextApiResponse } from 'next';
import { corsForGet } from '../../lib/backend.config';
import DataProvider from '../../lib/data/DataProvider';
import { Database } from '../../lib/data/PostgresProvider';
import { Language } from '../../model';
import { runMiddleware } from '../../lib/run-middleware';

async function getLanguages(): Promise<Language[]> {
    const client = await DataProvider.client();
    const s = Database.schema;
    const { rows } = await client.pg.raw(`select * from ${s}.language`);
    return rows;
}

async function supportingLanguagesHandler(req: NextApiRequest, res: NextApiResponse<any>) {
    await runMiddleware(req, res, corsForGet);

    if (req.method !== 'GET') {
        return;
    }

    try {
        const languages = await getLanguages();

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

export default supportingLanguagesHandler;
