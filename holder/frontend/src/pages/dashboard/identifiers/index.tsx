import { useEffect, useRef, useState } from 'react';
import NextLink from 'next/link';
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
import { Plus as PlusIcon } from '../../../icons/plus';
// type
import type { ChangeEvent, MouseEvent } from 'react';
import type { NextPage } from 'next';
import type { IIdentifier } from '@veramo/core';
// components
import { DashboardLayout } from '../../../components/dashboard/layout/dashboard-layout';
import { IdentifierDrawer } from '../../../components/dashboard/identifier/identifier-drawer';
import { IdentifierListTable } from '../../../components/dashboard/identifier/identifier-list-table';

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
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [identifiers, setIdentifiers] = useState<IIdentifier[]>([]);
  const [drawer, setDrawer] = useState<{ isOpen: boolean; did: string; }>({
    isOpen: false,
    did: ''
  });

  const getIdentifiers = async () => {
    try {
      const response = await fetch('http://localhost:5001/dids');
      const data = await response.json();
      setIdentifiers(data);
    } catch (err) {
      toast.error('Error when fetching identifiers');
    }
  };

  const handleDeleteIdentifier = async (did: string) => {
    const response: Response = await fetch(`http://localhost:5001/dids/${did}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (response.status === 200) toast.success('Identifier deleted!');
    else toast.error(response.statusText)
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
            handleDeleteIdentifier={() => handleDeleteIdentifier(drawer.did)}
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
