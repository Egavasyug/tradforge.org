import Image from 'next/image';

export default function Logo({ size = 36 }: { size?: number }) {
  return (
    <Image
      src="/tradforge-logo.png"
      alt="TradForge logo"
      width={size}
      height={size}
      priority
    />
  );
}

