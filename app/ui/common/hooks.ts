import { useReducer, useState } from "react";
import { FormErrors, FormValidator, validateForm,  } from "@/lib/validation";

export function useRerender() {
  const [_, force] = useReducer((x) => x + 1, 0);
  return force;
}

export function useFormValidator<T extends FormValidator>(validator: T) {
  const [errors, setError] = useState<FormErrors<T>>({});
  return [errors, 
    (form: FormData) => {
      const errors = validateForm(form, validator);
      const ok = Object.keys(errors).length === 0;
      setError(errors);
      return ok;
    }
  ] as const;
}

type Action = (form: FormData) => void | Promise<void>;

export function useForm<T extends FormValidator>(validator: T, action: Action) {
  const [errors, validate] = useFormValidator(validator);
  const [serverError, setServerError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const submit = (form: FormData) => {
    (async () => {
      setServerError(undefined);
      if (!validate(form)) return;
      setLoading(true);
      try {
        await action(form);
      } catch (err: any) {
        console.log(err);
        setServerError(err.message ?? err.error ?? err)
      } finally {
        setLoading(false);
      }
    })();
  }
  return { errors, serverError, loading, submit } as const;
}