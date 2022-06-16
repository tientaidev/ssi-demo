import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/router'
import type { NextPage } from 'next';
import NextLink from 'next/link';
import Head from 'next/head';
import { Box, Container, Grid, Link, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { DashboardLayout } from '../../../components/dashboard/layout/dashboard-layout';
import type { VerifiablePresentation } from '@veramo/core';
import { PresentationSummary } from 'src/components/dashboard/presentation/presentation-summary';

const CredentialDetails: NextPage = () => {
  const router = useRouter();
  const hash = router.query.hash as string;
  const [presentation, setPresentation] = useState<VerifiablePresentation | null>(null);

  const getPresentation = async () => {
    try {
      const response: Response = await fetch(`http://localhost:5001/presentations/${router.query.hash}`);

      if (response.status !== 200) {
        toast.error('Error when loading presentation');
        router.push('/dashboard/presentations');
        return;
      }

      const data = await response.json();
      setPresentation(data);
    } catch (err) {
      toast.error(err);
    }
  };

  useEffect(
    () => {
      if (!hash) return;
      getPresentation();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [hash]
  );

  if (!hash || !presentation) {
    return null;
  }

  return (
    <>
      <Head>
        <title>
          Dashboard: Presentation Detail
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
                  {presentation.name}
                </Typography>
              </Grid>
            </Grid>
          </Box>
          <PresentationSummary
            presentation={presentation}
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

