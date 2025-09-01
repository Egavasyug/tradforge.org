import Head from 'next/head'

export default function Home() {
  return (
    <div>
      <Head>
        <title>TradForge</title>
      </Head>
      <main className="p-6">
        <h1 className="text-3xl font-bold">Welcome to TradForge</h1>
        <p className="mt-4">This is the official frontend for the cultural DAO.</p>
      </main>
    </div>
  )
}
