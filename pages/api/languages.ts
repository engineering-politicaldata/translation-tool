import Cors from 'cors';
import { NextApiRequest, NextApiResponse } from 'next';
import DataProvider from '../../lib/data/DataProvider';
import { Database } from '../../lib/data/PostgresProvider';
import { Language } from '../../lib/model';
import { runMiddleware } from '../../lib/run-middleware';

// Initializing the cors middleware
const cors = Cors({
    methods: ['GET'],
    origin: true,
});

async function getLanguages(): Promise<Language[]> {
    const client = await DataProvider.client();
    const s = Database.schema;
    const { rows } = await client.pg.raw(`select * from ${s}.language`);
    return rows;
}

async function supportingLanguages(req: NextApiRequest, res: NextApiResponse<any>) {
    await runMiddleware(req, res, cors);

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

export default supportingLanguages;
