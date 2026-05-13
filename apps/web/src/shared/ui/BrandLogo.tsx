import logoUrl from "@/assets/images/logo.svg";
import { cn } from "@/shared/lib/utils";

type BrandLogoProps = {
  className?: string;
  alt?: string;
};

export default function BrandLogo({ className, alt = "XROSS" }: BrandLogoProps) {
  return (
    <img
      src={logoUrl}
      alt={alt}
      width={40}
      height={40}
      decoding="async"
      className={cn(
        "size-10 shrink-0 rounded-[14px] object-contain shadow-brand",
        className,
      )}
    />
  );
}
