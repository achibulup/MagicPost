type InputProps = {
  label: string;
  id: string;
  name: string;
  type: string;
  defaultValue?: string;
  step?: string;
  placeholder?: string;
  className?: string;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;


export default function Input({
  label,
  id,
  name,
  type,
  defaultValue,
  step,
  placeholder,
  className = '',
  error,
  required,
  disabled,
}: InputProps) {
  return (
    <div className={'mb-4 ' + (className ?? '')} >
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
      </label>
      <div className="relative mt-2 rounded-md">
        <div className="relative">
          <input
            id={id}
            name={name}
            type={type}
            defaultValue={defaultValue}
            step={step}
            placeholder={placeholder}
            className={'p-3 '}
            required={required}
            disabled={disabled}
          />
        </div>
      </div>

      <div aria-live="polite" aria-atomic="true">
        {error && 
          <p className="mt-2 text-sm text-red-500">
            {error}
          </p>
        }
      </div>
    </div>
  );
};