import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
          // Variants
          variant === "default" &&
            "bg-blue-500 text-white hover:bg-blue-600",
          variant === "destructive" &&
            "bg-red-500 text-white hover:bg-red-600",
          variant === "outline" &&
            "border border-gray-300 bg-white hover:bg-gray-100 text-gray-800",
          variant === "secondary" &&
            "bg-blue-100 text-blue-900 hover:bg-blue-200",
          variant === "ghost" &&
            "hover:bg-gray-100 hover:text-gray-900",
          variant === "link" &&
            "text-blue-500 underline-offset-4 hover:underline",
          // Sizes
          size === "default" && "h-10 px-4 py-2",
          size === "sm" && "h-8 rounded-md px-3 text-xs",
          size === "lg" && "h-11 rounded-md px-8",
          size === "icon" && "h-9 w-9",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button }; 