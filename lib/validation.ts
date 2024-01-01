export type Validator = (value?: string) => string | undefined;

export type FormErrors<T extends FormValidator> = {
  [key in keyof T]?: string;
}

export type FormValidator = {
  [key: string]: Validator | Validator[];
}


export const email: Validator = (email?: string) => {
  if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) return "Invalid email";
};

export function minLength(length: number) {
  const func: Validator = (value?: string) => {
    if (!value || value.length < length) return `Should be at least ${length} characters`;
  }
  return func;
}

export const nonNegative: Validator = (value?: string) => {
  if (!value || Number(value) < 0) return "Should be non-negative";
}

export const required: Validator = (value?: string) => {
  if (!value) return "Required";
}

export const phone: Validator = (value?: string) => {
  if (!value || !value.match(/^\d{10,11}$/)) return "Invalid phone number";
}

export function optional(validator: Validator): Validator {
  return function (value?: string) {
    if (!value) return;
    return validator(value);
  }
}

export function validateForm<T extends FormValidator>(form: FormData, validator: T): FormErrors<T> {
  const errors: FormErrors<T> = {};
  for (const key in validator) {
    const field = form.get(key) as string | undefined;
    const fieldValidator = validator[key];
    const validators: Validator[] = isValidatorArray(fieldValidator) ? fieldValidator : [fieldValidator];
    let error: string | undefined;
    for (const validator of validators) {
      const err = validator(field);
      if (err) {
        error = err;
        break;
      }
    }
    if (error) errors[key] = error;
  }
  return errors;
}


function isValidatorArray(validator: Validator | Validator[]): validator is Validator[] {
  return Array.isArray(validator);
}


