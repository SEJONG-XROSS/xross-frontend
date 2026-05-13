export interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export default function FeatureCard({
  icon,
  title,
  description,
}: FeatureCardProps) {
  return (
    <div className="flex items-center gap-4 rounded-[10px] border border-feature-border bg-feature-bg px-4 py-3.5">
      <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-feature-icon-bg">
        {icon}
      </div>
      <div className="flex flex-col gap-1.5">
        <span className="text-sm leading-5 tracking-tight text-feature-title">
          {title}
        </span>
        <span className="text-xs leading-4 text-feature-desc">{description}</span>
      </div>
    </div>
  );
}
