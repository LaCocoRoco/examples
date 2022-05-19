import Head from 'next/head';
import { serialize } from 'cookie';
import { GetServerSideProps } from 'next';
import { useRef, useEffect } from 'react';

export const getServerSideProps: GetServerSideProps = async context => {
  // remove token from cookie on refresh
  context.res.setHeader('Set-Cookie', serialize('token', ''))

  return {
    props: {
      token: context.req.cookies.token || null
    },
  }
}

export default function Home({ token }: { token: string }) {
  const textArea = useRef<HTMLTextAreaElement>(null);

  const event = () => {
    // copy token to clipboard
    textArea.current!.blur();
    navigator.clipboard.writeText(textArea.current!.textContent!);
  }

  useEffect(() => {
    // set textarea to scroll height
    if (textArea.current) {
      textArea.current.style.height = textArea.current.scrollHeight + 'px';
    }
  });

  return (
    <>
      <Head>
        <title>NextJS Typeorm Passport JWT Postgres</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="container">
        <a href="/api/authenticate/login/facebook">
          <button className="button btn btn-primary">Facebook</button>
        </a>

        <a href="/api/authenticate/login/github">
          <button className="button btn btn-primary">Github</button>
        </a>

        <a href="/api/authenticate/login/google">
          <button className="button btn btn-primary">Google</button>
        </a>
      </div>

      {token && <textarea readOnly ref={textArea} value={token} onClick={event} className="textarea" />}
    </>
  )
}