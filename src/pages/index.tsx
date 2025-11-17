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
        <div className="mt-6 mb-4 p-4 bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg">
          <h3 className="text-lg font-semibold">Meet Angel - Your TradForge Assistant</h3>
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
            . Ask her anything about the DAO&rsquo;s values, curriculum, soulbound NFTs, or how to join the mission.
          </p>
        </div>

        {/* Assistant UI (ForgeAgent vIz) */}
        <div className="mt-8">
          <Assistant />
        </div>

        {/* Mission */}
        <section id="mission" className="mt-12 p-6 bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg">
          <h2 className="text-2xl font-semibold">Mission</h2>
          <p className="mt-4 leading-relaxed">
            TradForge is a decentralized autonomous organization (DAO) with a mission to promote biologically and socially optimal life paths. It emphasizes traditional gender roles, soulbound NFT credentialing for identity and skill verification, and decentralized education. The DAO aims to foster community resilience and identity, support family formation, and align modern technologies with timeless values. TradForge operates diverse initiatives such as GenesisMen and HearthMaidens subDAOs, each focused on providing members with pathways that support their natural strengths, roles, and societal contributions in accordance with traditional perspectives. By integrating blockchain technology into the preservation and nourishment of cultural heritage, TradForge seeks to empower individuals to collaborate, learn, and build within a framework that honors human nature and societal well-being.
          </p>
        </section>

        {/* Vision */}
        <section id="vision" className="mt-8 p-6 bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg">
          <h2 className="text-2xl font-semibold">Vision</h2>
          <p className="mt-4 leading-relaxed">
            The vision of TradForge is to create a thriving, intergenerational community that harmonizes modern decentralized technology with enduring cultural values. It looks to a future where families are the cornerstone of society, where people engage in biologically complementary roles, and where education and credentialing are personalized and decentralized, ensuring the integrity and identity of each individual within the digital landscape. TradForge envisions a world where its members flourish through adherence to natural law and wisdom traditions, unifying under a shared purpose of cultural preservation, fertility, and legacy. By leveraging soulbound NFTs, TradForge aims to provide a template for how societies can recognize and nurture the intrinsic qualities and contributions of each gender, foster strong familial bonds, and build a resilient civilization that can withstand the pressures of modernity.
          </p>
        </section>

      </main>
    </div>
  )
}
