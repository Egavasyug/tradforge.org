import Logo from '@/components/Logo';

export default function Header() {
  return (
    <header className="site-header p-4">
      <div className="mx-auto max-w-5xl flex items-center gap-3">
        <Logo size={36} />
        <h1 className="text-xl font-semibold">TradForge</h1>
      </div>
    </header>
  )
}
