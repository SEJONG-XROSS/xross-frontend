interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
}

export default function SettingsSection({ title, children }: SettingsSectionProps) {
  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-monitor-text-dim tracking-caps font-mono text-11 font-semibold uppercase">
        {title}
      </h3>
      <div className="border-monitor-border bg-monitor-card-bg overflow-hidden rounded-card border">
        {children}
      </div>
    </section>
  );
}
