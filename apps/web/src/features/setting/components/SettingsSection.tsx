interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
}

export default function SettingsSection({ title, children }: SettingsSectionProps) {
  return (
    <section className="flex flex-col gap-4">
      <h3 className="text-[12px] font-medium uppercase leading-4 tracking-[1.2px] text-monitor-text-dim">
        {title}
      </h3>
      <div className="overflow-hidden rounded-[14px] border border-monitor-border bg-monitor-bg">
        {children}
      </div>
    </section>
  );
}
