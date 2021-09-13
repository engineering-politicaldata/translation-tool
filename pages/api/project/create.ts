import Cors from 'cors';
import { NextApiRequest, NextApiResponse } from 'next';
import { runMiddleware } from '../../../lib/run-middleware';

// Initializing the cors middleware
const cors = Cors({
    methods: ['POST', 'OPTIONS'],
    origin: true,
});

export default async (req: NextApiRequest, res: NextApiResponse<any>) => {
    await runMiddleware(req, res, cors);
    if (req.method !== 'POST') {
        return;
    }

    res.status(200).json({});
};
