import { LucideProps } from "lucide-react";

export function NairaIcon({ className, size = 24, ...props }: LucideProps) {
  return (
    <svg
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

