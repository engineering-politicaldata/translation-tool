import Cors from 'cors';

export const USER_TOKEN = '__tt_token';

export const corsForPost = Cors({
    methods: ['POST'],
    origin: true,
});

export const corsForGet = Cors({
    methods: ['GET'],
    origin: true,
});
