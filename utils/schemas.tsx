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

export const RegistrationSchema = Yup.object().shape({
    fullName: Yup.string().required('This field is required'),
    email: Yup.string()
        .trim()
        .required('Required')
        .matches(EMAIL_VALIDATION_REGEX, 'Invalid email address'),
    password: Yup.string()
        .required('Password is required')
        .min(6, 'Should be at least 6 characters'),
    confirmPassword: Yup.string()
        .required('You need to confirm your password')
        .oneOf([Yup.ref('password'), null], 'Both password should match'),
});
