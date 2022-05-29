import type { ChangeEvent, FC, MouseEvent } from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import numeral from 'numeral';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TablePagination,
  TableRow,
  Typography
} from '@mui/material';
import type { Order } from '../../../types/order';
import { SeverityPill } from '../../severity-pill';
import type { SeverityPillColor } from '../../severity-pill';
import { VerifiableCredential } from '@veramo/core';

interface CredentialListTableProps {
  onOpenDrawer?: (orderId: string) => void;
  onPageChange: (event: MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
  onRowsPerPageChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  credentials: VerifiableCredential[];
  credentialsCount: number;
  page: number;
  rowsPerPage: number;
}

const severityMap: { [key: string]: SeverityPillColor; } = {
  complete: 'success',
  pending: 'info',
  canceled: 'warning',
  rejected: 'error'
};

export const CredentialListTable: FC<CredentialListTableProps> = (props) => {
  const {
    onOpenDrawer,
    onPageChange,
    onRowsPerPageChange,
    credentials,
    credentialsCount,
    page,
    rowsPerPage,
    ...other
  } = props;

  return (
    <div {...other}>
      <Table>
        <TableBody>
          {credentials.map((credential) => (
            <TableRow
              hover
              key={credential.hash}
              onClick={() => onOpenDrawer?.(credential.hash)}
              sx={{ cursor: 'pointer' }}
            >
              <TableCell
                sx={{
                  alignItems: 'center',
                  display: 'flex'
                }}
              >
                <Box
                  sx={{
                    backgroundColor: (theme) => theme.palette.mode === 'dark'
                      ? 'neutral.800'
                      : 'neutral.200',
                    borderRadius: 2,
                    maxWidth: 'fit-content',
                    ml: 3,
                    p: 1
                  }}
                >
                  <Typography
                    align="center"
                    variant="subtitle2"
                  >
                    {format(new Date(credential.issuanceDate), 'LLL').toUpperCase()}
                  </Typography>
                  <Typography
                    align="center"
                    variant="h6"
                  >
                    {format(new Date(credential.issuanceDate), 'd')}
                  </Typography>
                </Box>
                <Box sx={{ ml: 2 }}>
                  <Typography variant="subtitle2">
                    {credential.hash}
                  </Typography>
                  <Typography
                    color="textSecondary"
                    variant="body2"
                  >
                    {credential.type}
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={credentialsCount}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </div>
  );
};

CredentialListTable.propTypes = {
  onOpenDrawer: PropTypes.func,
  onPageChange: PropTypes.func.isRequired,
  onRowsPerPageChange: PropTypes.func,
  credentials: PropTypes.array.isRequired,
  credentialsCount: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired
};
