import React from "react";
import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  variant?: "light" | "dark" | "monogram" | "footer";
  showText?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

// Studio brand monogram and typography logo component
export const Logo: React.FC<LogoProps> = ({
  variant = "light",
  showText = true,
  size = "md",
  className = ""
}) => {
  // Dimension and typography size presets
  const sizeMap = {
    sm: { img: 32, text: "text-base", sub: "text-[9px]" },
    md: { img: 44, text: "text-lg", sub: "text-[10px]" },
    lg: { img: 56, text: "text-2xl", sub: "text-xs" },
    xl: { img: 80, text: "text-3xl", sub: "text-sm" },
  };

  const currentSize = sizeMap[size];
  const isDarkBg = variant === "light";
  // Select light or dark monogram logo based on background variant
  const logoSrc = isDarkBg ? "/logos/cb-logo-cream.jpeg" : "/logos/cb-logo-brown.jpeg";

  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-3 group focus:outline-none transition-opacity duration-200 hover:opacity-90 ${className}`}
      aria-label="Camryn Burger Photography Home"
    >
      <div className="relative overflow-hidden rounded-md border border-[#bea683]/20 shadow-sm transition-transform duration-300 group-hover:scale-105">
        <Image
          src={logoSrc}
          alt="CB Monogram"
          width={currentSize.img * 1.2}
          height={currentSize.img * 1.2}
          className="object-cover"
          priority
        />
      </div>

      {showText && (
        <div className="flex flex-col leading-tight">
          <span
            className={`font-serif-heading font-semibold tracking-wider uppercase ${
              isDarkBg ? "text-[#f7f3ed]" : "text-[#402615]"
            } ${currentSize.text}`}
          >
            Camryn Burger
          </span>
          <span
            className={`tracking-[0.25em] font-medium uppercase text-[#878679] ${currentSize.sub}`}
          >
            Photography
          </span>
        </div>
      )}
    </Link>
  );
};
