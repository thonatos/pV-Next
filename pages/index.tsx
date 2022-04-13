import type { NextPage, NextPageContext } from 'next';
import Head from 'next/head';
import styles from './index.module.css';

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Home - ρV</title>
        <meta name="description" content="undefined project - ρV" />
        <link rel="icon" href="//s.implements.io/a/f/favicon.png" />
      </Head>

      <main className={styles.main}>ρV - undefined project</main>
    </div>
  );
};

export default Home;

export async function getServerSideProps(context: NextPageContext) {
  console.log('===index.context', context.query);
  return {
    props: {}, // will be passed to the page component as props
  };
}
