import Image from 'next/image';

export default function Header() {
  return (
    <header className="site-header p-4">
      <div className="mx-auto max-w-5xl flex items-center gap-3">
        <Image
          src="/tradforge-logo.png"
          alt="TradForge logo"
          width={36}
          height={36}
          priority
        />
        <h1 className="text-xl font-semibold">TradForge</h1>
      </div>
    </header>
  )
}
