import Image from 'next/image';
import { useState } from 'react';

export default function Logo({ size = 36 }: { size?: number }) {
  const [src, setSrc] = useState('/tradforge-logo.png');

  return (
    <Image
      src={src}
      alt="TradForge logo"
      width={size}
      height={size}
      priority
      onError={() => {
        if (src !== '/tradforge-log.png') setSrc('/tradforge-log.png');
      }}
    />
  );
}

