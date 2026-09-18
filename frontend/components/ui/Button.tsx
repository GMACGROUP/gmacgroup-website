import { ButtonHTMLAttributes } from "react";

// TODO: add variants (primary/secondary/outline) and sizes
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
};

export function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
  const base = "rounded px-4 py-2 font-medium transition";
  const variants = {
    primary: "bg-brand text-white hover:bg-brand-dark",
    secondary: "border border-brand text-brand hover:bg-brand/10",
  };
  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
}
