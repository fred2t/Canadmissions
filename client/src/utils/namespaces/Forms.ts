import { DeepRequired, FieldErrorsImpl, UseFormRegister } from "react-hook-form";
import * as yup from "yup";

import { objectFill } from "../methods/objectHelpers";

const MAX_USERNAME_LENGTH = 15;

const MAX_EMAIL_LENGTH = 50;

const MIN_PASSWORD_LENGTH = 3;
const MAX_PASSWORD_LENGTH = 100;

const USERNAME_YUP = yup
    .string()
    .required("Username is required")
    .max(MAX_USERNAME_LENGTH, `Username must be less than ${MAX_USERNAME_LENGTH} characters`);
const EMAIL_YUP = yup
    .string()
    .required("Email is required")
    .email("Email is invalid")
    .max(MAX_EMAIL_LENGTH, `Email must be less than ${MAX_EMAIL_LENGTH} characters`);
const PASSWORD_YUP = yup
    .string()
    .required("Password is required")
    // .min(MIN_PASSWORD_LENGTH, `Password must be at least ${MIN_PASSWORD_LENGTH} characters`)
    .max(MAX_PASSWORD_LENGTH, `Password must be less than ${MAX_PASSWORD_LENGTH} characters`);

export interface SignUpSchema {
    username: string;
    email: string;
    password: string;
}
export const SIGNUP_SCHEMA = yup.object().shape({
    username: USERNAME_YUP,
    email: EMAIL_YUP,
    password: PASSWORD_YUP,
});

export interface LoginSchema {
    username: string;
    password: string;
}
export const LOGIN_SCHEMA = yup.object().shape({
    username: USERNAME_YUP,
    password: PASSWORD_YUP,
});

export interface ChangePasswordSchema {
    username: string;
    oldPassword: string;
    newPassword: string;
}
export const CHANGE_PASSWORD_SCHEMA = yup.object().shape({
    username: USERNAME_YUP,
    oldPassword: PASSWORD_YUP,
    newPassword: PASSWORD_YUP,
});

// react-hook-form's library's helper methods
export function RHFEmptyForm<O extends object>(values: O): Record<keyof O, ""> {
    /**
     * Use with reset and getValues() from RHF's useForm() hook.
     *
     * reset(RHFEmptyForm(getValues())) clears the form.
     */

    return objectFill(values, "");
}

export function RHFRegisterWithMessageHelpers<S extends object>(
    registerer: UseFormRegister<S>,
    identifier: keyof S,
    errors: FieldErrorsImpl<DeepRequired<S>>
) {
    return {
        // @ts-ignore
        ...registerer(identifier),
        error: !!errors[identifier]?.message,
        helperText: errors[identifier]?.message,
    };
}
