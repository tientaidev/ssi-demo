import { useEffect } from 'react';
import type { NextPage } from 'next';
import NextLink from 'next/link';
import Head from 'next/head';
import { Box, Breadcrumbs, Container, Link, Typography } from '@mui/material';
import { DashboardLayout } from '../../../components/dashboard/layout/dashboard-layout';
import { CredentialCreateForm } from '../../../components/dashboard/credential/credential-create-form';

const ProductCreate: NextPage = () => {

  return (
    <>
      <Head>
        <title>
          Dashboard: Issue Credential
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
              Issue a new credential
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
                Credentials
              </Typography>
            </Breadcrumbs>
          </Box>
          <CredentialCreateForm />
        </Container>
      </Box>
    </>
  );
};

ProductCreate.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default ProductCreate;
