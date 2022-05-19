import Head from 'next/head'

export default function Home() {
  return (
    <>
      <Head>
        <title>NextJS TypeGraphQL JWT Cors</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <iframe src="/api/graphql" frameBorder="0"></iframe>
    </>
  )
}