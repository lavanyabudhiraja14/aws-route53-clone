"use client";

export function AwsSmile({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      className={`aws-wordmark ${className}`}
      aria-label="AWS"
      role="img"
    >
      <span className="aws-wordmark-text">aws</span>

      <svg
        className="aws-wordmark-smile"
        viewBox="0 0 80 32"
        aria-hidden="true"
      >
        <path
          d="M8 8 C25 25, 55 29, 72 8"
          fill="none"
          stroke="#ff9900"
          strokeWidth="5"
          strokeLinecap="round"
        />

        <path
          d="M63 7 L73 8 L68 16"
          fill="none"
          stroke="#ff9900"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export function Route53Mark() {
  return (
    <div className="route53-mark" aria-label="Route 53">
      <span className="route53-mark-text">Route 53</span>
    </div>
  );
}