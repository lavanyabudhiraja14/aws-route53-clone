export function ComingSoon({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div>
      <h1 className="mb-4 text-[28px] font-normal text-[#16191f]">{title}</h1>
      <div className="rounded-sm border border-[#d5dbdb] bg-white px-8 py-16 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#f3f3f3] text-[#ec7211]">
          <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
            <path
              d="M12 7v5l3 2"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>
        <h2 className="text-lg font-bold text-[#16191f]">Coming soon</h2>
        <p className="mx-auto mt-2 max-w-lg text-[13px] leading-6 text-[#545b64]">
          {description}
        </p>
      </div>
    </div>
  );
}
