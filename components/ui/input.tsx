import * as React from "react";

import { cn } from "@/lib/utils";
import { AiOutlineSearch } from "react-icons/ai";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <div className="absolute bg-gray-200 left-0 border-r flex items-center justify-center w-16 h-full  top-1/2 transform -translate-y-1/2">
          <AiOutlineSearch className="mt-1  text-neutral-400 text-2xl" />
        </div>

        <input
          type={type}
          className={cn(
            "h-10 w-full pl-[75px] pr-3 rounded-full border bg-white shadow-sm text-sm placeholder-neutral-500 focus:outline-none focus:border-gray-300 focus:ring-gray-300 transition duration-300 hover:shadow-sm",
            "dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-200 dark:placeholder-neutral-500 dark:focus:ring-primary-300",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
