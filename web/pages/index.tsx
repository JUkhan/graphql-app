import Head from 'next/head'

import Layout from '../components/layout';
import { useAllPostsQuery } from '../generated/graphql';



export default function Home() {
  const { data } = useAllPostsQuery()
  console.log(data);
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <div>Hello world</div>
        {data?.allPost.map(p => <div key={p.id}>{p.title}</div>)}
      </Layout>
    </>
  )
}
