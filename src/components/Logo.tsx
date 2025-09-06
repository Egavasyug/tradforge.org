import Image from 'next/image';
import { useState } from 'react';

export default function Logo({ size = 36 }: { size?: number }) {
  // Prefer the file name the user uploaded (`tradforge-log.png`),
  // then fall back to `tradforge-logo.png`.
  const [src, setSrc] = useState('/tradforge-log.png');

  return (
    <Image
      src={src}
      alt="TradForge logo"
      width={size}
      height={size}
      priority
      unoptimized
      onError={() => {
        if (src !== '/tradforge-logo.png') setSrc('/tradforge-logo.png');
      }}
    />
  );
}

