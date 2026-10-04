import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
}

export const TextInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        <label className="font-tech text-accent-primary uppercase text-xs tracking-[1px] font-bold">
          {label} {props.required && <span className="text-status-error">*</span>}
        </label>
        <input
          ref={ref}
          className={`w-full py-2.5 px-3.5 bg-[rgba(13,13,20,0.85)] border ${
            error ? 'border-status-error shadow-[0_0_8px_rgba(255,0,127,0.3)]' : 'border-border-color'
          } text-text-primary rounded font-body text-sm transition-all duration-200 outline-none focus:border-accent-secondary focus:shadow-[0_0_10px_rgba(255,0,127,0.25)] ${className}`}
          {...props}
        />
        {error && <span className="text-status-error font-tech text-xs uppercase tracking-[0.5px]">{error}</span>}
        {helperText && !error && <span className="text-text-secondary text-xs">{helperText}</span>}
      </div>
    );
  }
);
TextInput.displayName = 'TextInput';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
  error?: string;
  helperText?: string;
}

export const SelectInput = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, helperText, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        <label className="font-tech text-accent-primary uppercase text-xs tracking-[1px] font-bold">
          {label} {props.required && <span className="text-status-error">*</span>}
        </label>
        <select
          ref={ref}
          className={`w-full py-2.5 px-3.5 bg-[rgba(13,13,20,0.85)] border ${
            error ? 'border-status-error' : 'border-border-color'
          } text-text-primary rounded font-body text-sm transition-all duration-200 outline-none focus:border-accent-secondary focus:shadow-[0_0_10px_rgba(255,0,127,0.25)] ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-surface-color text-text-primary">
              {opt.label}
            </option>
          ))}
        </select>
        {error && <span className="text-status-error font-tech text-xs uppercase tracking-[0.5px]">{error}</span>}
        {helperText && !error && <span className="text-text-secondary text-xs">{helperText}</span>}
      </div>
    );
  }
);
SelectInput.displayName = 'SelectInput';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  helperText?: string;
}

export const TextAreaInput = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        <label className="font-tech text-accent-primary uppercase text-xs tracking-[1px] font-bold">
          {label} {props.required && <span className="text-status-error">*</span>}
        </label>
        <textarea
          ref={ref}
          className={`w-full py-2.5 px-3.5 bg-[rgba(13,13,20,0.85)] border ${
            error ? 'border-status-error' : 'border-border-color'
          } text-text-primary rounded font-body text-sm transition-all duration-200 outline-none focus:border-accent-secondary focus:shadow-[0_0_10px_rgba(255,0,127,0.25)] resize-y min-h-[90px] ${className}`}
          {...props}
        />
        {error && <span className="text-status-error font-tech text-xs uppercase tracking-[0.5px]">{error}</span>}
        {helperText && !error && <span className="text-text-secondary text-xs">{helperText}</span>}
      </div>
    );
  }
);
TextAreaInput.displayName = 'TextAreaInput';

interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  description?: string;
}

export function ToggleSwitch({ label, checked, onChange, description }: ToggleProps) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border-color/50 last:border-b-0">
      <div>
        <div className="font-tech text-text-primary text-sm font-bold uppercase tracking-[1px]">{label}</div>
        {description && <div className="text-text-secondary text-xs font-body">{description}</div>}
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out cursor-pointer ${
          checked ? 'bg-accent-secondary shadow-[0_0_10px_rgba(255,0,127,0.4)]' : 'bg-surface-color-light border border-border-color'
        }`}
      >
        <div
          className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ease-in-out transform ${
            checked ? 'translate-x-6' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}
