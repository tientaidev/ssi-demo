import { useCallback, useState, useEffect } from 'react';
import type { ChangeEvent } from 'react';
import type { NextPage } from 'next';
import NextLink from 'next/link';
import Head from 'next/head';
import {
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Grid,
  Link,
  Tab,
  Tabs,
  Typography
} from '@mui/material';
import { identifierApi } from '../../../../__fake-api__/did-api';
import { AuthGuard } from '../../../../components/authentication/auth-guard';
import { DashboardLayout } from '../../../../components/dashboard/dashboard-layout';
import { useMounted } from '../../../../hooks/use-mounted';
import { gtm } from '../../../../lib/gtm';
import { useRouter } from 'next/router';
import { IIdentifier } from '@veramo/core';

const IdentifierDetails: NextPage = () => {
  const isMounted = useMounted();
  const [identifier, setIdentifier] = useState<IIdentifier>(null);
  const router = useRouter();
  const { identifierDID } = router.query;

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const getIdentifier = useCallback(async () => {
    try {
      const data = await identifierApi.getIdentifier();

      if (isMounted()) {
        setIdentifier(data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted]);

  useEffect(
    () => {
      getIdentifier();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  if (!identifier) {
    return null;
  }

  return (
    <>
      <Head>
        <title>
          Dashboard: DID Details
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        {identifierDID}
      </Box>
    </>
  );
};

IdentifierDetails.getLayout = (page) => (
  <AuthGuard>
    <DashboardLayout>
      {page}
    </DashboardLayout>
  </AuthGuard>
);

export default IdentifierDetails;

