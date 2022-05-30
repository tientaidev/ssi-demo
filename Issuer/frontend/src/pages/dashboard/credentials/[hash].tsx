import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import type { NextPage } from 'next';
import NextLink from 'next/link';
import Head from 'next/head';
import { Box, Button, Container, Grid, Link, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { DashboardLayout } from '../../../components/dashboard/dashboard-layout';
import { OrderSummary } from '../../../components/dashboard/credential/credential-summary';
import { useMounted } from '../../../hooks/use-mounted';
import { gtm } from '../../../lib/gtm';
import type { VerifiableCredential } from '@veramo/core';

const OrderDetails: NextPage = () => {
  const isMounted = useMounted();
  const router = useRouter();
  const { hash } = router.query;
  const [credential, setCredential] = useState<VerifiableCredential | null>(null);

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const getCredential = useCallback(async () => {
    try {
      const response: Response = await fetch(`http://localhost:5000/credentials/${router.query.hash}`);
      const data = await response.json();

      if (isMounted()) {
        setCredential(data);
      }
    } catch (err) {
      console.error(err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted]);

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
          <OrderSummary credential={credential} />
          {/* <Box sx={{ mt: 4 }}>
            <OrderItems orderItems={order.items || []} />
          </Box>
          <Box sx={{ mt: 4 }}>
            <OrderLogs order={order} />
          </Box> */}
        </Container>
      </Box>
    </>
  );
};

OrderDetails.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default OrderDetails;

