import React from "react";
import { LucideProps } from "lucide-react";

export const NairaIcon = React.forwardRef<SVGSVGElement, LucideProps>(
  ({ className, size = 24, ...props }, ref) => {
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width={size}
        height={size}
        className={className}
        {...props}
      >
        <text
          x="12"
          y="18"
          dominantBaseline="middle"
          textAnchor="middle"
          fontSize="20"
          fontWeight="bold"
          fill="currentColor"
          fontFamily="Arial, sans-serif"
        >
          ₦
        </text>
      </svg>
    );
  }
);

NairaIcon.displayName = "NairaIcon";

