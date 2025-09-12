import Link from 'next/link';
import Logo from '@/components/Logo';

export default function Header() {
  return (
    <header className="site-header p-4">
      <div className="mx-auto max-w-5xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Logo size={36} />
          <h1 className="text-xl font-semibold">TradForge</h1>
        </div>
        <nav className="flex items-center gap-4 text-sm" aria-label="Primary">
          <Link href="/#mission" className="hover:no-underline">Mission</Link>
          <Link href="/#vision" className="hover:no-underline">Vision</Link>
        </nav>
      </div>
    </header>
  )
}
