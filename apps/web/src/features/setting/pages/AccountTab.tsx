import { useState, useEffect, useRef } from "react";
import ProfileSection from "@/features/setting/components/ProfileSection";
import SecuritySection from "@/features/setting/components/SecuritySection";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { useMe } from "@/features/auth/hooks/useMe";
import { updateProfileApi } from "@xross/core";

import SaveIcon from "@/assets/icons/save.svg?react";
import LogOutIcon from "@/assets/icons/log-out.svg?react";
import KeyIcon from "@/assets/icons/key.svg?react";

const ROLE_LABEL: Record<string, string> = {
  OWNER: "점주",
  ADMIN: "관리자",
};

function PasswordModal({ onClose }: { onClose: () => void }) {
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!currentPw) { setError("현재 비밀번호를 입력하세요."); return; }
    if (newPw.length < 6) { setError("새 비밀번호는 6자 이상이어야 합니다."); return; }
    if (newPw !== confirmPw) { setError("비밀번호가 일치하지 않습니다."); return; }
    setLoading(true);
    try {
      await updateProfileApi({ currentPassword: currentPw, newPassword: newPw });
      setSuccess(true);
      setTimeout(onClose, 1200);
    } catch {
      setError("비밀번호 변경에 실패했습니다. 현재 비밀번호를 확인하세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-monitor-card-bg border-monitor-border w-full max-w-sm rounded-card border p-6 shadow-2xl">
        <div className="mb-5 flex items-center gap-3">
          <div className="bg-brand-primary/10 border-brand-primary/20 flex h-9 w-9 items-center justify-center rounded-control border">
            <KeyIcon className="text-monitor-accent-blue h-4 w-4" />
          </div>
          <div>
            <h2 className="text-monitor-text text-14 font-bold">비밀번호 변경</h2>
            <p className="text-monitor-text-dim text-12">새 비밀번호를 입력하세요</p>
          </div>
        </div>

        {success ? (
          <div className="flex flex-col items-center gap-2 py-4">
            <div className="bg-monitor-accent-green/10 flex h-10 w-10 items-center justify-center rounded-full">
              <svg className="text-monitor-accent-green h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-monitor-text text-14 font-medium">변경 완료</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-monitor-text-dim tracking-caps font-mono text-11 font-medium uppercase">현재 비밀번호</label>
              <input
                ref={inputRef}
                type="password"
                value={currentPw}
                onChange={(e) => setCurrentPw(e.target.value)}
                placeholder="현재 비밀번호 입력"
                className="bg-monitor-bg border-monitor-border text-monitor-text placeholder:text-monitor-text-dim focus:border-brand-primary h-10 rounded-control border px-3 text-14 transition-colors focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-monitor-text-dim tracking-caps font-mono text-11 font-medium uppercase">새 비밀번호</label>
              <input
                type="password"
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                placeholder="6자 이상"
                className="bg-monitor-bg border-monitor-border text-monitor-text placeholder:text-monitor-text-dim focus:border-brand-primary h-10 rounded-control border px-3 text-14 transition-colors focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-monitor-text-dim tracking-caps font-mono text-11 font-medium uppercase">비밀번호 확인</label>
              <input
                type="password"
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
                placeholder="동일하게 입력"
                className="bg-monitor-bg border-monitor-border text-monitor-text placeholder:text-monitor-text-dim focus:border-brand-primary h-10 rounded-control border px-3 text-14 transition-colors focus:outline-none"
              />
            </div>

            {error && <p className="text-event-critical text-12">{error}</p>}

            <div className="mt-1 flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="border-monitor-border text-monitor-text-dim hover:text-monitor-text flex h-10 flex-1 items-center justify-center rounded-control border text-13 transition-colors"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-brand-primary flex h-10 flex-1 items-center justify-center rounded-control text-13 font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {loading ? "저장 중…" : "변경"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function AccountTab() {
  const logout = useLogout();
  const { data: me } = useMe();
  const [profile, setProfile] = useState({ name: "", role: "", storeCode: "", email: "", phone: "" });
  const [pwModalOpen, setPwModalOpen] = useState(false);

  useEffect(() => {
    if (me) {
      setProfile({
        name: me.name ?? "",
        role: ROLE_LABEL[me.role] ?? me.role,
        storeCode: me.storeName,
        email: me.email,
        phone: "",
      });
    }
  }, [me]);

  const handleSave = () => {
    console.log("저장:", profile);
  };

  return (
    <div className="flex flex-col gap-8">
      {pwModalOpen && <PasswordModal onClose={() => setPwModalOpen(false)} />}

      <ProfileSection
        name={profile.name}
        role={profile.role}
        storeCode={profile.storeCode}
        email={profile.email}
        phone={profile.phone}
        onNameChange={(value) => setProfile((prev) => ({ ...prev, name: value }))}
        onEmailChange={(value) => setProfile((prev) => ({ ...prev, email: value }))}
        onPhoneChange={(value) => setProfile((prev) => ({ ...prev, phone: value }))}
      />

      <SecuritySection
        lastPasswordChangeDays={30}
        isOtpEnabled={true}
        onChangePassword={() => setPwModalOpen(true)}
      />

      {/* 액션 버튼 */}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={handleSave}
          className="bg-brand-primary shadow-button hover:bg-brand-primary-hover flex h-11 w-full items-center justify-center gap-2 rounded-control px-6 transition-colors sm:w-auto sm:justify-start"
        >
          <span className="relative size-4 shrink-0 text-white">
            <SaveIcon className="absolute block size-full max-w-none" />
          </span>
          <span className="text-14 font-semibold text-white">변경 저장</span>
        </button>

        <button
          type="button"
          onClick={logout}
          className="border-event-critical/25 bg-event-critical/7 hover:border-event-critical/45 hover:bg-event-critical/12 flex h-11 w-full items-center justify-center gap-2 rounded-control border px-5 transition-all sm:w-auto sm:justify-start"
        >
          <span className="text-event-critical relative size-4 shrink-0">
            <LogOutIcon className="absolute block size-full max-w-none" />
          </span>
          <span className="text-event-critical text-14 font-semibold">로그아웃</span>
        </button>
      </div>
    </div>
  );
}
