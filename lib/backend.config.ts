import Cors from 'cors';

export const GET_API_CONFIG = {
    method: 'GET',
    headers: {
        'Content-type': 'application/json; charset=UTF-8',
    },
};

export const corsForPost = Cors({
    methods: ['POST'],
    origin: true,
});

export const corsForGet = Cors({
    methods: ['GET'],
    origin: true,
});
