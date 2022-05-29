import { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import type { ChangeEvent, MouseEvent } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import {
  Box,
  Button,
  Divider,
  Grid,
  InputAdornment,
  TextField,
  Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { credentialApi } from '../../../__fake-api__/credential-api';
import { DashboardLayout } from '../../../components/dashboard/dashboard-layout';
import { CredentialDrawer } from '../../../components/dashboard/credential/credential-drawer';
import { CredentialListTable } from '../../../components/dashboard/credential/credential-list-table';
import { useMounted } from '../../../hooks/use-mounted';
import { Plus as PlusIcon } from '../../../icons/plus';
import { Search as SearchIcon } from '../../../icons/search';
import { gtm } from '../../../lib/gtm';
import type { Order, OrderStatus } from '../../../types/order';
import type { VerifiableCredential } from '@veramo/core';

interface Filters {
  query?: string;
  status?: OrderStatus;
}

const applyPagination = (
  credentials: VerifiableCredential[],
  page: number,
  rowsPerPage: number
): VerifiableCredential[] => credentials.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

const CredentialListInner = styled(
  'div',
  { shouldForwardProp: (prop) => prop !== 'open' }
)<{ open?: boolean; }>(
  ({ theme, open }) => ({
    flexGrow: 1,
    overflow: 'hidden',
    paddingBottom: theme.spacing(8),
    paddingTop: theme.spacing(8),
    zIndex: 1,
    [theme.breakpoints.up('lg')]: {
      marginRight: -500
    },
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    ...(open && {
      [theme.breakpoints.up('lg')]: {
        marginRight: 0
      },
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen
      })
    })
  })
);

const CredentialList: NextPage = () => {
  const isMounted = useMounted();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const queryRef = useRef<HTMLInputElement | null>(null);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [credentials, setCredentials] = useState<VerifiableCredential[]>([]);
  const [filters, setFilters] = useState<Filters>({
    query: '',
    status: undefined
  });

  const [drawer, setDrawer] = useState<{ isOpen: boolean; hash?: string; }>({
    isOpen: false,
    hash: undefined
  });

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const getOrders = useCallback(async () => {
    try {
      const data = await credentialApi.getOrders();

      if (isMounted()) {
        setCredentials(data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted]);

  useEffect(
    () => {
      getOrders();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handleQueryChange = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setFilters((prevState) => ({
      ...prevState,
      query: queryRef.current?.value
    }));
  };

  const handlePageChange = (event: MouseEvent<HTMLButtonElement> | null, newPage: number): void => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleOpenDrawer = (orderId: string): void => {
    setDrawer({
      isOpen: true,
      orderId
    });
  };

  const handleCloseDrawer = () => {
    setDrawer({
      isOpen: false,
      orderId: undefined
    });
  };

  // Usually query is done on backend with indexing solutions
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
        ref={rootRef}
        sx={{
          backgroundColor: 'background.paper',
          display: 'flex',
          flexGrow: 1,
          overflow: 'hidden'
        }}
      >
        <CredentialListInner open={drawer.isOpen}>
          <Box sx={{ px: 3 }}>
            <Grid
              container
              justifyContent="space-between"
              spacing={3}
              sx={{ mb:3 }}
            >
              <Grid item>
                <Typography variant="h4">
                  Credentials
                </Typography>
              </Grid>
              <Grid item>
                <Button
                  startIcon={<PlusIcon fontSize="small" />}
                  variant="contained"
                >
                  Add
                </Button>
              </Grid>
            </Grid>
          </Box>
          <Divider />
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              flexWrap: 'wrap',
              m: -1.5,
              p: 3
            }}
          >
            <Box
              component="form"
              onSubmit={handleQueryChange}
              sx={{
                flexGrow: 1,
                m: 1.5
              }}
            >
              <TextField
                defaultValue=""
                fullWidth
                inputProps={{ ref: queryRef }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  )
                }}
                placeholder="Search by content"
              />
            </Box>
          </Box>
          <Divider />
          <CredentialListTable
            onOpenDrawer={handleOpenDrawer}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            credentials={paginatedCredentials}
            credentialsCount={credentials.length}
            page={page}
            rowsPerPage={rowsPerPage}
          />
        </CredentialListInner>
        <CredentialDrawer
          containerRef={rootRef}
          onClose={handleCloseDrawer}
          open={drawer.isOpen}
          credential={credentials.find((credential) => credential.hash === drawer.hash)}
        />
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
