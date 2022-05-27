import { useEffect } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { Divider } from '@mui/material';
import { MainLayout } from '../components/main-layout';
import { gtm } from '../lib/gtm';

const Home: NextPage = () => {
  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  return (
    <>
      <Head>
        <title>
          Index page
        </title>
      </Head>
      <main>
        Index
      </main>
    </>
  );
};

Home.getLayout = (page) => (
  <MainLayout>
    {page}
  </MainLayout>
);

export default Home;
