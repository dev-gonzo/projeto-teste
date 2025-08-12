import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export class PasswordValidators {
    constructor() { }

    static patternValidator(regex: RegExp, error: ValidationErrors): ValidatorFn | null | undefined {
        return (control: AbstractControl): { [key: string]: any } | null => {
            if (!control.value) {
                // if the control value is empty return no error.
                return null;
            }

            // test the value of the control against the regexp supplied.
            const valid = regex.test(control.value);

            // if true, return no error, otherwise return the error object passed in the second parameter.
            return valid ? null : error;
        };
    }

    static MatchValidator(control: AbstractControl) {
        const password: string = control.get("password")?.value; // get password from our password form control
        const confirmPassword: string = control.get("password_confirm")?.value; // get password from our confirmPassword form control

        // if the confirmPassword value is null or empty, don't return an error.
        if (!confirmPassword?.length) {
            return null;
        }

        // if the confirmPassword length is < 6, set the minLength error.
        if (confirmPassword.length < 6) {
            control.get('password_confirm')?.setErrors({ minLength: true });
            return control;
        } else {
            // compare the passwords and see if they match.
            if (password !== confirmPassword) {
                control.get("password_confirm")?.setErrors({ mismatch: true });
                return control;
            } else {
                // if passwords match, don't return an error.
                return null;
            }
        }

    }
}