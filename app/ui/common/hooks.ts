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