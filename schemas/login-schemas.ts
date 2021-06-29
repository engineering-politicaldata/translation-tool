import * as Yup from 'yup';
import { EMAIL_VALIDATION_REGEX } from '../shared/Constants';

export const LoginSchema = Yup.object().shape({
    email: Yup.string()
        .trim()
        .required('Required')
        .matches(EMAIL_VALIDATION_REGEX, 'Invalid email address'),
    password: Yup.string()
        .required('Password is required')
        .min(6, 'Should be at least 6 characters'),
});
