import { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import {
  Box,
  Container,
  Grid,
  Typography
} from '@mui/material';
import { DashboardLayout } from '../../components/dashboard/layout/dashboard-layout';

const Overview: NextPage = () => {

  return (
    <>
      <Head>
        <title>
          Dashboard: Overview
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ mb: 4 }}>
            <Grid
              container
              justifyContent="space-between"
              spacing={3}
            >
              <Grid item>
                <Typography variant="h4">
                  Gm &#9728;
                </Typography>
              </Grid>
            </Grid>
          </Box>
          <Grid
            container
            spacing={4}
          >
            {/* {displayBanner && (
              <Grid
                item
                xs={12}
              >
                <OverviewBanner onDismiss={handleDismissBanner} />
              </Grid>
            )} */}
            {/* <Grid
              item
              md={6}
              xs={12}
            >
              <OverviewCryptoWallet />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <OverviewPrivateWallet />
            </Grid>
            <Grid
              item
              md={8}
              xs={12}
            >
              <OverviewTotalTransactions />
            </Grid>
            <Grid
              item
              md={4}
              xs={12}
            >
              <OverviewTotalBalance />
            </Grid>
            <Grid
              item
              md={8}
              xs={12}
            >
              <OverviewLatestTransactions />
            </Grid>
            <Grid
              item
              md={4}
              xs={12}
            >
              <OverviewInbox />
            </Grid> */}
          </Grid>
        </Container>
      </Box>
    </>
  );
};

Overview.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Overview;
