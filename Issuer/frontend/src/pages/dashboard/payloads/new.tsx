import { useEffect } from 'react';
import type { NextPage } from 'next';
import NextLink from 'next/link';
import Head from 'next/head';
import { Box, Breadcrumbs, Container, Link, Typography } from '@mui/material';
import { DashboardLayout } from '../../../components/dashboard/layout/dashboard-layout';
import { PayloadGenerateForm } from '../../../components/dashboard/payload/payload-generate-form';

const PayloadGenerate: NextPage = () => {
  return (
    <>
      <Head>
        <title>
          Generate Credential Payload
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4">
              Generate credential payload
            </Typography>
            <Breadcrumbs
              separator="/"
              sx={{ mt: 1 }}
            >
              <NextLink
                href="/dashboard"
                passHref
              >
                <Link variant="subtitle2">
                  Dashboard
                </Link>
              </NextLink>
              <NextLink
                href="/dashboard"
                passHref
              >
                <Link
                  color="primary"
                  variant="subtitle2"
                >
                  Management
                </Link>
              </NextLink>
              <Typography
                color="textSecondary"
                variant="subtitle2"
              >
                Payloads
              </Typography>
            </Breadcrumbs>
          </Box>
          <PayloadGenerateForm />
        </Container>
      </Box>
    </>
  );
};

PayloadGenerate.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default PayloadGenerate;
