"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LucideIcon, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { FormikProps } from "formik";
import { cn } from "@/lib/utils";

interface FormInputProps<TValues> {
  label: string;
  name: keyof TValues & string;
  type?: string;
  placeholder?: string;
  icon?: LucideIcon;
  formik: FormikProps<TValues>;
  className?: string;
  disabled?: boolean;
}

export function FormInput<TValues>({
  label,
  name,
  type = "text",
  placeholder,
  icon: Icon,
  formik,
  className,
  disabled,
}: FormInputProps<TValues>) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  const touched = formik.touched[name];
  const error =
    touched && typeof formik.errors[name] === "string"
      ? formik.errors[name]
      : null;

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={name} className="text-sm font-medium">
        {label}
      </Label>
      <div className="relative group">
        {Icon && (
          <Icon
            className={cn(
              "absolute left-3 top-3 h-4 w-4 text-muted-foreground transition-colors",
              error ? "text-red-500" : "group-focus-within:text-primary",
            )}
          />
        )}
        <Input
          id={name}
          type={inputType}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "h-11 bg-slate-50 transition-all",
            Icon ? "pl-10" : "pl-3",
            isPassword ? "pr-10" : "pr-3",
            error
              ? "border-red-500 focus-visible:ring-red-500 bg-red-50/10"
              : "border-slate-200 focus:border-primary focus:bg-white",
          )}
          {...formik.getFieldProps(name)}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-slate-100"
            tabIndex={-1}
            disabled={disabled}>
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        )}
      </div>
      {error && (
        <p className="text-xs font-medium text-red-500 animate-in fade-in slide-in-from-top-1">
          {error}
        </p>
      )}
    </div>
  );
}
