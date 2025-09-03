import Head from 'next/head'
import Assistant from "@/components/Assistant";

export default function Home() {
  return (
    <div>
      <Head>
        <title>TradForge</title>
      </Head>
      <main className="p-6">
        <h1 className="text-3xl font-bold">Welcome to TradForge</h1>
        <p className="mt-4">This is the official frontend for the cultural DAO.</p>

        {/* Assistant UI (ForgeAgent vΞ) */}
        <div className="mt-8">
          <Assistant />
        </div>
      </main>
    </div>
  )
}
