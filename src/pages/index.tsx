import Head from 'next/head'
import Assistant from "@/components/Assistant";
import Header from "@/components/Header";

export default function Home() {
  return (
    <div>
      <Head>
        <title>TradForge — Raising Birthrates Through Family Formation</title>
      </Head>
      <Header />
      <main className="p-6">

        {/* Hero: mission-first — above the fold */}
        <section className="mt-4">
          <p className="text-xs uppercase tracking-widest text-gray-500 font-semibold">
            Charitable mission &middot; Public-interest community
          </p>
          <h1 className="text-3xl font-bold mt-2">
            TradForge
          </h1>
          <p className="mt-3 text-lg leading-relaxed max-w-2xl">
            A charitable mission to strengthen traditional family and gender roles &mdash; and{' '}
            <strong>raise birthrates in developed countries</strong> &mdash; through community,
            education, and family formation pathways.
          </p>
          <p className="mt-3 text-gray-600 max-w-2xl">
            We foster intergenerational communities where biologically complementary roles,
            decentralized education, and soulbound credentialing empower families to thrive.
          </p>
          <div className="mt-6 flex gap-3">
            <a href="#mission" className="bg-black text-white px-5 py-2 rounded font-medium hover:bg-gray-800">
              Read Mission
            </a>
            <a
              href="/TradForge_Whitepaper_Soulbound.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2 border border-gray-300 rounded font-medium hover:bg-gray-100"
            >
              Whitepaper
            </a>
          </div>
        </section>

        {/* Mission */}
        <section id="mission" className="mt-12 p-6 bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg">
          <h2 className="text-2xl font-semibold">Mission</h2>
          <p className="mt-4 leading-relaxed">
            TradForge is a charitable community with a mission to promote biologically and socially optimal life paths.
            Our primary outcome is <strong>raising birthrates in developed countries</strong> by strengthening traditional
            family and complementary gender roles through education, community, and family formation pathways.
          </p>
          <p className="mt-3 leading-relaxed">
            We operate as a decentralized organization that emphasizes soulbound NFT credentialing for identity and
            skill verification, decentralized education, and community resilience. TradForge runs initiatives such as
            <strong> GenesisMen</strong> and <strong>HearthMaidens</strong>, each providing members with pathways that
            support their natural strengths, roles, and societal contributions in accordance with traditional perspectives.
            By integrating blockchain technology into cultural heritage, we empower individuals to collaborate, learn,
            and build within a framework that honors human nature and societal well-being.
          </p>
        </section>

        {/* Vision */}
        <section id="vision" className="mt-8 p-6 bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg">
          <h2 className="text-2xl font-semibold">Vision</h2>
          <p className="mt-4 leading-relaxed">
            A thriving, intergenerational community that harmonizes decentralized technology with enduring cultural values.
            Families are the cornerstone of society. People engage in biologically complementary roles. Education and
            credentialing are personalized and decentralized.
          </p>
          <p className="mt-3 leading-relaxed">
            We envision members flourishing through natural law and wisdom traditions, unifying under a shared purpose of
            cultural preservation, <strong>fertility and legacy</strong>, and higher birthrates. Soulbound NFTs provide a
            template for how societies can recognize and nurture the intrinsic qualities of each gender, foster strong
            familial bonds, and build a resilient civilization that can withstand the pressures of modernity.
          </p>
        </section>

        {/* Angel assistant — below purpose, secondary */}
        <section id="angel" className="mt-12 p-6 bg-[var(--color-panel)] border border-[var(--color-border)] rounded-lg">
          <h2 className="text-2xl font-semibold">Ask Angel</h2>
          <p className="mt-2 text-gray-600">
            Angel is TradForge&rsquo;s AI assistant. Ask about the mission, whitepaper, or how to join.
          </p>
          <div className="mt-6">
            <Assistant />
          </div>
        </section>

      </main>
    </div>
  )
}
