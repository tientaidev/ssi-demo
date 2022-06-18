import { useState, useEffect } from 'react';
import type { ChangeEvent, MouseEvent } from 'react';
import toast from 'react-hot-toast';
import NextLink from 'next/link';
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
import { DashboardLayout } from '../../../components/dashboard/layout/dashboard-layout';
import { PresentationListTable } from 'src/components/dashboard/presentation/presentation-list-table';
import { Plus as PlusIcon } from '../../../icons/plus';
import type { UniqueVerifiablePresentation } from '@veramo/data-store';

const applyPagination = (
  presentations: UniqueVerifiablePresentation[],
  page: number,
  rowsPerPage: number
): UniqueVerifiablePresentation[] => presentations.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

const PresentationList: NextPage = () => {
  const [presentations, setPresentations] = useState<UniqueVerifiablePresentation[]>([]);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  const getPresentations = async () => {
    try {
      const response: Response = await fetch('http://localhost:5001/presentations');

      if (response.status !== 200) {
        toast.error('Error when fetching data!');
        return;
      }

      const data = await response.json();
      setPresentations(data);
    } catch (err) {
      toast.error(err);
    }
  };


  useEffect(
    () => {
      getPresentations();
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

  const paginatedPresentations = applyPagination(presentations, page, rowsPerPage);

  return (
    <>
      <Head>
        <title>
          Dashboard: Presentation List
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
                  Presentations
                </Typography>
              </Grid>
              <Grid item>
                <NextLink
                  href='/dashboard/presentations/new'
                  passHref
                >
                  <Button
                    startIcon={<PlusIcon fontSize="small" />}
                    sx={{ mr: 2 }}
                    variant="contained"
                  >
                    Issue
                  </Button>
                </NextLink>
              </Grid>
            </Grid>
          </Box>
          <Card>
            <PresentationListTable
              presentations={paginatedPresentations}
              presentationsCount={presentations.length}
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

PresentationList.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default PresentationList;
