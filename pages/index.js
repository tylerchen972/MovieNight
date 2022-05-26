import Head from 'next/head'
import Navbar from '../lib/components/Navbar'

export default function Home() {
  return (
    
    <div className="container">
      <Head>
        <title>Vid.io</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
      <Navbar/>
      </main>
    </div>
  )
}
