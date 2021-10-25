// import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
// import * as sha256 from 'sha256';
import { JWT_SECRET } from '.';
// export function generateEncrypedPassword(password: string) {
//     return bcrypt.hash(sha256(password), 10);
// }

// export function comparePassword(passwordInput: string, dbPassword: string) {
//     return new Promise((resolve, reject) => {
//         bcrypt.compare(sha256(passwordInput), dbPassword, (_, res) => {
//             resolve(res);
//         });
//     });
// }

export function generateToken(input: object) {
    return jwt.sign(input, JWT_SECRET);
}

export function decodeToken(token: string) {
    try {
        if (token && jwt.verify(token, JWT_SECRET)) {
            const decoded = jwt.decode(token);
            console.log('decoded', decoded);

            return decoded['user_id'];
        }
    } catch (error) {
        console.log(error);
    }
}
