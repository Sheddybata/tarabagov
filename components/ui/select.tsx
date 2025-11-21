"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  placeholder?: string
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, placeholder, value, onChange, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          className={cn(
            "flex h-10 w-full appearance-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          value={value}
          onChange={onChange}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {children}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 pointer-events-none text-muted-foreground" />
      </div>
    )
  }
)
Select.displayName = "Select"

const SelectTrigger = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, ...props }, ref) => {
    return <Select ref={ref} className={className} {...props} />
  }
)
SelectTrigger.displayName = "SelectTrigger"

const SelectContent = ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return <div {...props}>{children}</div>
}

const SelectValue = ({ placeholder }: { placeholder?: string }) => {
  return <option value="">{placeholder}</option>
}

const SelectItem = ({ value, children, ...props }: { value: string; children: React.ReactNode } & React.OptionHTMLAttributes<HTMLOptionElement>) => {
  return (
    <option value={value} {...props}>
      {children}
    </option>
  )
}

export { Select, SelectTrigger, SelectContent, SelectValue, SelectItem }

