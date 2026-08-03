interface FieldInputProps {
  label: string;
  value: string;
  onChange?: (value: string) => void;
}

function FieldInput({ label, value, onChange }: FieldInputProps) {
  return (
    <div className="flex w-full flex-col gap-1.5">
      <label className="text-monitor-text-muted tracking-caps font-mono text-11 font-medium uppercase">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="border-monitor-border bg-monitor-bg text-monitor-text focus:border-brand-primary/50 h-10 w-full rounded-control border px-3 text-14 outline-none transition-colors"
      />
    </div>
  );
}

interface ProfileSectionProps {
  name: string;
  role: string;
  storeCode: string;
  email: string;
  phone: string;
  onNameChange?: (value: string) => void;
  onEmailChange?: (value: string) => void;
  onPhoneChange?: (value: string) => void;
}

export default function ProfileSection({
  name,
  role,
  storeCode,
  email,
  phone,
  onNameChange,
  onEmailChange,
  onPhoneChange,
}: ProfileSectionProps) {
  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-monitor-text-dim tracking-caps font-mono text-11 font-semibold uppercase">
        프로필
      </h3>
      <div className="border-monitor-border bg-monitor-card-bg overflow-hidden rounded-card border">
        {/* 아바타 행 */}
        <div className="border-monitor-border flex items-center gap-4 border-b px-4 py-5 sm:px-5">
          <div className="from-brand-primary to-monitor-accent-blue shadow-brand flex size-16 shrink-0 items-center justify-center rounded-full bg-linear-to-br">
            <span className="text-xl text-white">{name.charAt(0)}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-monitor-text text-16 font-semibold">
              {name}
            </span>
            <span className="text-monitor-text-dim text-12">
              {role} · {storeCode}
            </span>
          </div>
        </div>

        {/* 폼 필드 */}
        <div className="flex flex-col gap-4 p-4 sm:p-5">
          <FieldInput label="이름" value={name} onChange={onNameChange} />
          <FieldInput label="이메일" value={email} onChange={onEmailChange} />
          <FieldInput label="연락처" value={phone} onChange={onPhoneChange} />
        </div>
      </div>
    </section>
  );
}
