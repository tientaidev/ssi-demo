import { useCallback, useState, useEffect, ChangeEvent } from 'react';
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
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { ChevronDown as ChevronDownIcon } from '../../../../icons/chevron-down';
import { PencilAlt as PencilAltIcon } from '../../../../icons/pencil-alt';
import { identifierApi } from '../../../../__fake-api__/did-api';
import { AuthGuard } from '../../../../components/authentication/auth-guard';
import { DashboardLayout } from '../../../../components/dashboard/dashboard-layout';
import { useMounted } from '../../../../hooks/use-mounted';
import { gtm } from '../../../../lib/gtm';
import { useRouter } from 'next/router';
import { IIdentifier } from '@veramo/core';
import { truncate } from '../../../../utils/truncate'
import { IdentifierBasicDetails } from '../../../../components/dashboard/did/did-basic-detail'
import { DidKeysSummary } from '../../../../components/dashboard/did/did-keys-summary'

const IdentifierDetails: NextPage = () => {
  const isMounted = useMounted();
  const [identifier, setIdentifier] = useState<IIdentifier>(null);
  const [currentTab, setCurrentTab] = useState<string>('details');
  const router = useRouter();
  const { identifierDID } = router.query;

  const tabs = [
    { label: 'Details', value: 'details' },
    { label: 'Keys', value: 'keys' },
    { label: 'Logs', value: 'logs' }
  ];

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const handleTabsChange = (event: ChangeEvent<{}>, value: string): void => {
    setCurrentTab(value);
  };

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
        <Container maxWidth="md">
          <div>
            <Box sx={{ mb: 4 }}>
              <NextLink
                href="/dashboard/identifiers"
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
                    Identifiers
                  </Typography>
                </Link>
              </NextLink>
            </Box>
            <Grid
              container
              justifyContent="space-between"
              spacing={3}
            >
              <Grid
                item
                sx={{
                  alignItems: 'center',
                  display: 'flex',
                  overflow: 'hidden'
                }}
              >
                <div>
                  <Typography variant="h4">
                    {truncate(identifier.did)}
                  </Typography>
                </div>
              </Grid>
              <Grid
                item
                sx={{ m: -1 }}
              >
                <NextLink
                  href="/dashboard/customers/1/edit"
                  passHref
                >
                  <Button
                    component="a"
                    endIcon={(<PencilAltIcon fontSize="small" />)}
                    sx={{ m: 1 }}
                    variant="outlined"
                  >
                    Edit
                  </Button>
                </NextLink>
              </Grid>
            </Grid>
            <Tabs
              indicatorColor="primary"
              onChange={handleTabsChange}
              scrollButtons="auto"
              sx={{ mt: 3 }}
              textColor="primary"
              value={currentTab}
              variant="scrollable"
            >
              {tabs.map((tab) => (
                <Tab
                  key={tab.value}
                  label={tab.label}
                  value={tab.value}
                />
              ))}
            </Tabs>
          </div>
          <Divider />
          <Box sx={{ mt: 3 }}>
            {currentTab === 'details' && (
              <IdentifierBasicDetails
                did={identifier.did} 
                alias={identifier.alias}
              />
            )}
            {currentTab === 'keys' && <DidKeysSummary controllerKeyId={identifier.controllerKeyId} />}
            {/* {currentTab === 'logs' && <CustomerLogs />} */}
          </Box>
        </Container>
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

