import { initializeApp } from '@firebase/app';
import Head from 'next/head';

const app = initializeApp(process.env.firebase);

export default function Home() {
  return (
    <Head>
      <title>NextJS Config</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>
  )
}
