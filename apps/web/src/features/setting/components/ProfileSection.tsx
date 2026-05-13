interface FieldInputProps {
  label: string;
  value: string;
  onChange?: (value: string) => void;
}

function FieldInput({ label, value, onChange }: FieldInputProps) {
  return (
    <div className="relative h-[70px] w-full shrink-0">
      <label className="absolute left-0 top-[6.5px] text-[12px] font-medium uppercase leading-4 tracking-[0.6px] text-monitor-text-muted">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="absolute left-0 top-[30px] h-10 w-full rounded-[10px] border border-monitor-border bg-monitor-card-bg px-3 text-[14px] leading-5 tracking-[-0.15px] text-white outline-none transition-colors focus:border-[rgba(43,127,255,0.5)]"
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
    <section className="flex flex-col gap-4">
      <h3 className="text-[12px] font-medium uppercase leading-4 tracking-[1.2px] text-monitor-text-dim">
        프로필
      </h3>
      <div className="overflow-hidden rounded-[14px] border border-monitor-border bg-monitor-bg">
        {/* 아바타 행 */}
        <div className="flex min-h-[90px] items-center gap-4 border-b border-monitor-border px-4 py-4 sm:px-5 lg:h-[105px] lg:py-0">
          <div
            className="flex size-16 shrink-0 items-center justify-center rounded-full shadow-[0px_0px_20px_0px_rgba(59,130,246,0.2)]"
            style={{
              background:
                "linear-gradient(135deg, rgb(21, 93, 252) 0%, rgb(81, 162, 255) 100%)",
            }}
          >
            <span className="text-[20px] leading-7 text-white">{name.charAt(0)}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[16px] leading-6 tracking-[-0.31px] text-monitor-text">
              {name}
            </span>
            <span className="text-[12px] leading-4 text-monitor-text-dim">
              {role} · {storeCode}
            </span>
          </div>
        </div>

        {/* 폼 필드 */}
        <div className="flex flex-col gap-4 px-4 pb-4 pt-4 sm:px-5 sm:pb-5">
          <FieldInput label="이름" value={name} onChange={onNameChange} />
          <FieldInput label="이메일" value={email} onChange={onEmailChange} />
          <FieldInput label="연락처" value={phone} onChange={onPhoneChange} />
        </div>
      </div>
    </section>
  );
}
