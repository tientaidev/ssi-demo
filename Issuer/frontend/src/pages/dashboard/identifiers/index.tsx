import { useCallback, useEffect, useRef, useState } from 'react';
import NextLink from 'next/link';
import type { ChangeEvent, MouseEvent } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import {
  Box,
  Button,
  Divider,
  Grid,
  Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import toast from 'react-hot-toast';
import { DashboardLayout } from '../../../components/dashboard/dashboard-layout';
import { IdentifierDrawer } from '../../../components/dashboard/identifier/identifier-drawer';
import { IdentifierListTable } from '../../../components/dashboard/identifier/identifier-list-table';
import { useMounted } from '../../../hooks/use-mounted';
import { Plus as PlusIcon } from '../../../icons/plus';
import { gtm } from '../../../lib/gtm';
import type { IIdentifier } from '@veramo/core';

const applyPagination = (
  identifiers: IIdentifier[],
  page: number,
  rowsPerPage: number
): IIdentifier[] => identifiers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

const IdentifierListInner = styled(
  'div',
  { shouldForwardProp: (prop) => prop !== 'open' }
)<{ open?: boolean; }>(
  ({ theme, open }) => ({
    flexGrow: 1,
    overflow: 'hidden',
    paddingBottom: theme.spacing(8),
    paddingTop: theme.spacing(4),
    zIndex: 1,
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

const IdentifierList: NextPage = () => {
  const isMounted = useMounted();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [identifiers, setIdentifiers] = useState<IIdentifier[]>([]);
  const [drawer, setDrawer] = useState<{ isOpen: boolean; did: string; }>({
    isOpen: false,
    did: undefined
  });

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const getIdentifiers = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5000/dids');
      const data = await response.json();

      if (isMounted()) {
        setIdentifiers(data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted]);

  const handleDeleteIdentifier = async (event, did: string) => {
    await fetch('http://localhost:5000/dids', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        did: did
      })
    }).then((response) => console.log(response))

    toast.success('Identifier deleted!');
    handleCloseDrawer();
    getIdentifiers();
  }

  useEffect(
    () => {
      getIdentifiers();
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

  const handleOpenDrawer = (did: string): void => {
    setDrawer({
      isOpen: true,
      did
    });
  };

  const handleCloseDrawer = () => {
    setDrawer({
      isOpen: false,
      did: ''
    });
  };

  // Usually query is done on backend with indexing solutions
  const paginatedIdentifiers = applyPagination(identifiers, page, rowsPerPage);

  return (
    <>
      <Head>
        <title>
          Dashboard: Identifiers List
        </title>
      </Head>
      <Box
        component='main'
        ref={rootRef}
        sx={{
          backgroundColor: 'background.paper',
          display: 'flex',
          flexGrow: 1,
          overflow: 'hidden'
        }}
      >
        <IdentifierListInner open={drawer.isOpen}>
          <Box sx={{ px: 3, mb: 3 }}>
            <Grid
              container
              justifyContent="space-between"
              spacing={3}
            >
              <Grid item>
                <Typography variant="h4">
                  Identifiers
                </Typography>
              </Grid>
              <Grid item>
                <NextLink
                  href='/dashboard/identifiers/new'
                  passHref
                >
                  <Button
                    startIcon={<PlusIcon fontSize="small" />}
                    variant="contained"
                  >
                    Add
                  </Button>
                </NextLink>
              </Grid>
            </Grid>
          </Box>
          <Divider />
          <IdentifierListTable
            onOpenDrawer={handleOpenDrawer}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            identifiers={paginatedIdentifiers}
            identifiersCount={identifiers.length}
            page={page}
            rowsPerPage={rowsPerPage}
          />
        </IdentifierListInner>
        {drawer.did &&
          <IdentifierDrawer
            containerRef={rootRef}
            onClose={handleCloseDrawer}
            handleDeleteIdentifier={handleDeleteIdentifier}
            open={drawer.isOpen}
            did={drawer.did}
          />
        }
      </Box>
    </>
  );
};

IdentifierList.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default IdentifierList;
