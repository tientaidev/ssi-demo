import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/router'
import type { NextPage } from 'next';
import NextLink from 'next/link';
import Head from 'next/head';
import { Box, Container, Grid, Link, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { DashboardLayout } from '../../../components/dashboard/layout/dashboard-layout';
import { CredentialSummary } from '../../../components/dashboard/credential/credential-summary';
import type { VerifiableCredential } from '@veramo/core';

const CredentialDetails: NextPage = () => {
  const router = useRouter();
  const hash = router.query.hash as string;
  const [credential, setCredential] = useState<VerifiableCredential | null>(null);

  const getCredential = async () => {
    try {
      const response: Response = await fetch(`http://localhost:5000/credentials/${router.query.hash}`);
      if (response.status === 400) {
        toast.error('Error when loading credential');
        router.push('/dashboard/credentials');
        return;
      }

      const data = await response.json();
      setCredential(data);
    } catch (err) {
      toast.error(err);
    }
  };

  useEffect(
    () => {
      if (!hash) return;
      getCredential();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [hash]
  );

  if (!hash || !credential) {
    return null;
  }

  console.log(credential)

  return (
    <>
      <Head>
        <title>
          Dashboard: Credential Detail
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
          <Box sx={{ mb: 4 }}>
            <NextLink
              href="/dashboard/credentials"
              passHref
            >
              <Link
                color="textPrimary"
                component="a"
                sx={{
                  alignItems: 'center',
                  display: 'flex'
                }}
              >
                <ArrowBackIcon
                  fontSize="small"
                  sx={{ mr: 1 }}
                />
                <Typography variant="subtitle2">
                  Credentials
                </Typography>
              </Link>
            </NextLink>
          </Box>
          <Box sx={{ mb: 4 }}>
            <Grid
              container
              justifyContent="space-between"
              spacing={3}
            >
              <Grid item>
                <Typography variant="h4">
                  {credential.name}
                </Typography>
              </Grid>
            </Grid>
          </Box>
          <CredentialSummary
            credential={credential}
            hash={hash} />
        </Container>
      </Box>
    </>
  );
};

CredentialDetails.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default CredentialDetails;

