import { type FormikTouched, type FormikErrors } from 'formik'

declare global {
    type FieldErrorType = {
        error: boolean | FormikErrors<any> | FormikErrors<any>[] | undefined;
    }
}

declare global {
    type FieldTouchType = {
        touched: boolean | FormikTouched<any> | FormikTouched<any>[] | undefined;
    }
}

export { }; // Prevents file from being treated as a script
