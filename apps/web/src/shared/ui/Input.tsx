import { useState, useRef, type InputHTMLAttributes } from "react";
import EyeIcon from "@/assets/icons/eye.svg?react";
import EyeOffIcon from "@/assets/icons/eye-off.svg?react";
import CircleXIcon from "@/assets/icons/circle-x.svg?react";
import { cn } from "@/shared/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export default function Input({
  label,
  type = "text",
  className,
  onChange,
  ...props
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [hasValue, setHasValue] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isPassword = type === "password";
  const resolvedType = isPassword ? (showPassword ? "text" : "password") : type;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasValue(e.target.value.length > 0);
    onChange?.(e);
  };

  const handleClear = () => {
    if (!inputRef.current) return;
    const nativeSetter = Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      "value",
    )?.set;
    nativeSetter?.call(inputRef.current, "");
    inputRef.current.dispatchEvent(new Event("input", { bubbles: true }));
    inputRef.current.focus();
    setHasValue(false);
  };

  // 우측 패딩: 버튼 개수에 따라 조정
  const rightPadding =
    isPassword && hasValue ? "pr-16" : isPassword || hasValue ? "pr-10" : "";

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-label text-xs font-medium tracking-wider uppercase">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          ref={inputRef}
          type={resolvedType}
          onChange={handleChange}
          className={cn(
            "border-input-border bg-surface-elevated text-heading placeholder:text-placeholder focus:border-input-focus h-11 w-full rounded-[10px] border px-4 text-sm tracking-tight focus:outline-none",
            !isPassword && type === "email" && "border-input-border-email",
            rightPadding,
            className,
          )}
          {...props}
        />

        <div className="absolute top-1/2 right-3.5 flex -translate-y-1/2 items-center gap-1.5">
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="text-input-icon hover:text-input-icon-hover"
              aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
            >
              {showPassword ? (
                <EyeOffIcon className="size-4" />
              ) : (
                <EyeIcon className="size-4" />
              )}
            </button>
          )}
          {hasValue && (
            <button
              type="button"
              onClick={handleClear}
              className="text-input-icon hover:text-input-icon-hover"
              aria-label="입력 내용 지우기"
            >
              <CircleXIcon className="size-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
