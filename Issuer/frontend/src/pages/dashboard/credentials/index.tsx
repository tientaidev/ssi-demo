import { useState, useEffect, useCallback, useRef } from 'react';
import NextLink from 'next/link';
import type { ChangeEvent, MouseEvent } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import {
  Box,
  Button,
  Card,
  Container,
  Grid,
  Typography
} from '@mui/material'; ``
import { DashboardLayout } from '../../../components/dashboard/dashboard-layout';
import { CredentialListTable } from '../../../components/dashboard/credential/credential-list-table';
import { useMounted } from '../../../hooks/use-mounted';
import { Plus as PlusIcon } from '../../../icons/plus';
import { gtm } from '../../../lib/gtm';
import type { UniqueVerifiableCredential } from '@veramo/data-store';

const applyPagination = (
  credentials: UniqueVerifiableCredential[],
  page: number,
  rowsPerPage: number
): UniqueVerifiableCredential[] => credentials.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

const CredentialList: NextPage = () => {
  const isMounted = useMounted();
  const queryRef = useRef<HTMLInputElement | null>(null);
  const [credentials, setCredentials] = useState<UniqueVerifiableCredential[]>([]);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const getCredentials = useCallback(async () => {
    try {
      const response: Response = await fetch('http://localhost:5000/credentials');
      const data = await response.json();

      if (isMounted()) {
        setCredentials(data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted]);


  useEffect(
    () => {
      getCredentials();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handlePageChange = (event: MouseEvent<HTMLButtonElement> | null, newPage: number): void => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const paginatedCredentials = applyPagination(credentials, page, rowsPerPage);

  return (
    <>
      <Head>
        <title>
          Dashboard: Credential List
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
                  Credentials
                </Typography>
              </Grid>
              <Grid item>
                <NextLink
                  href='/dashboard/credentials/new'
                  passHref
                >
                  <Button
                    startIcon={<PlusIcon fontSize="small" />}
                    variant="contained"
                  >
                    Issue
                  </Button>
                </NextLink>

              </Grid>
            </Grid>
          </Box>
          <Card>
            <CredentialListTable
              credentials={paginatedCredentials}
              credentialsCount={credentials.length}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              rowsPerPage={rowsPerPage}
              page={page}
            />
          </Card>
        </Container>
      </Box>
    </>
  );
};

CredentialList.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default CredentialList;
