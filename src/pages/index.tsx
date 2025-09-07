import Head from 'next/head'
import Assistant from "@/components/Assistant";
import Header from "@/components/Header";

export default function Home() {
  return (
    <div>
      <Head>
        <title>TradForge</title>
      </Head>
      <Header />
      <main className="p-6">
        <h1 className="text-3xl font-bold">Welcome to TradForge</h1>
        <p className="mt-4">This is the official frontend for the cultural DAO.</p>

        {/* Intro: Angel assistant with whitepaper link */}
        <div className="mt-6 mb-4 p-4 bg-[#fffdf8] border border-[var(--color-border)] rounded-lg">
          <h3 className="text-lg font-semibold">🤖 Meet Angel — Your TradForge Assistant</h3>
          <p className="mt-2">
            Angel is an AI assistant powered by our <strong>RAG (Retrieval-Augmented Generation)</strong> model, built on the{' '}
            <a
              href="/TradForge_Whitepaper_Soulbound.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              TradForge whitepaper
            </a>
            . Ask her anything about the DAO’s values, curriculum, soulbound NFTs, or how to join the mission.
          </p>
        </div>

        {/* Assistant UI (ForgeAgent vIz) */}
        <div className="mt-8">
          <Assistant />
        </div>
      </main>
    </div>
  )
}

