import { useState, useEffect } from "react";
import ProfileSection from "@/features/setting/components/ProfileSection";
import SecuritySection from "@/features/setting/components/SecuritySection";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { useMe } from "@/features/auth/hooks/useMe";

import SaveIcon from "@/assets/icons/save.svg?react";
import LogOutIcon from "@/assets/icons/log-out.svg?react";

const ROLE_LABEL: Record<string, string> = {
  OWNER: "점주",
  ADMIN: "관리자",
};

export default function AccountTab() {
  const logout = useLogout();
  const { data: me } = useMe();
  const [profile, setProfile] = useState({
    name: "",
    role: "",
    storeCode: "",
    email: "",
    phone: "",
  });

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
    // TODO: API 연동
    console.log("저장:", profile);
  };

  return (
    <div className="flex flex-col gap-8">
      <ProfileSection
        name={profile.name}
        role={profile.role}
        storeCode={profile.storeCode}
        email={profile.email}
        phone={profile.phone}
        onNameChange={(value) =>
          setProfile((prev) => ({ ...prev, name: value }))
        }
        onEmailChange={(value) =>
          setProfile((prev) => ({ ...prev, email: value }))
        }
        onPhoneChange={(value) =>
          setProfile((prev) => ({ ...prev, phone: value }))
        }
      />

      <SecuritySection lastPasswordChangeDays={30} isOtpEnabled={true} />

      {/* 액션 버튼 */}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={handleSave}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand-primary px-6 shadow-[0_0_20px_rgba(21,93,252,0.35)] transition-all hover:shadow-[0_0_28px_rgba(21,93,252,0.5)] hover:brightness-110 sm:w-auto sm:justify-start"
        >
          <span className="relative size-4 shrink-0 text-white">
            <SaveIcon className="absolute block size-full max-w-none" />
          </span>
          <span className="text-[14px] leading-5 font-semibold tracking-[-0.15px] text-white">
            변경 저장
          </span>
        </button>

        <button
          type="button"
          onClick={logout}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[rgba(251,44,54,0.25)] bg-[rgba(251,44,54,0.07)] px-5 transition-all hover:border-[rgba(251,44,54,0.45)] hover:bg-[rgba(251,44,54,0.12)] sm:w-auto sm:justify-start"
        >
          <span className="relative size-4 shrink-0 text-[#fb2c36]">
            <LogOutIcon className="absolute block size-full max-w-none" />
          </span>
          <span className="text-[14px] leading-5 font-semibold tracking-[-0.15px] text-[#fb2c36]">
            로그아웃
          </span>
        </button>
      </div>
    </div>
  );
}
