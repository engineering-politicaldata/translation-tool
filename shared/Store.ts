import Cookies from 'js-cookie';
import { KEY_TOKEN } from './Constants';

const USER_ID = 'user_id';

export default class Store {
    static getToken(isEmbedded: boolean = false): string {
        if (Cookies.get(KEY_TOKEN)) {
            return String(Cookies.get(KEY_TOKEN));
        }
        return '';
    }

    static setToken(token: string): void {
        if (process.browser && localStorage) localStorage.setItem(KEY_TOKEN, token);
    }

    static setUserId(userId: string): void {
        if (process.browser && localStorage) localStorage.setItem(USER_ID, userId);
    }

    static getUserId(): string | null {
        return process.browser && localStorage ? localStorage.getItem(USER_ID) : '';
    }

    static isUserLoggedIn(): boolean {
        return !!Store.getToken();
    }
}
