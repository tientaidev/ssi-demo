import type { ChangeEvent, FC, MouseEvent } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TablePagination,
  TableRow,
  Typography
} from '@mui/material';
import type { IIdentifier } from '@veramo/core';
import { truncate } from '../../../utils/truncate';

interface IdentifierListTableProps {
  onOpenDrawer: (did: string) => void;
  onPageChange: (event: MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
  onRowsPerPageChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  identifiers: IIdentifier[];
  identifiersCount: number;
  page: number;
  rowsPerPage: number;
}

export const IdentifierListTable: FC<IdentifierListTableProps> = (props) => {
  const {
    onOpenDrawer,
    onPageChange,
    onRowsPerPageChange,
    identifiers,
    identifiersCount,
    page,
    rowsPerPage,
    ...other
  } = props;

  return (
    <div {...other}>
      <Table>
        <TableBody>
          {identifiers.map((identifier) => (
            <TableRow
              hover
              key={identifier.did}
              onClick={() => onOpenDrawer(identifier.did)}
              sx={{ cursor: 'pointer' }}
            >
              <TableCell
                sx={{
                  alignItems: 'center',
                  display: 'flex'
                }}
              >
                <Box sx={{ ml: 2 }}>
                  <Typography variant="subtitle2">
                    {identifier.alias}
                  </Typography>
                  <Typography
                    color="textSecondary"
                    variant="body2"
                  >
                    {truncate(identifier.did)}
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={identifiersCount}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </div>
  );
};

IdentifierListTable.propTypes = {
  onOpenDrawer: PropTypes.func.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onRowsPerPageChange: PropTypes.func,
  identifiers: PropTypes.array.isRequired,
  identifiersCount: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired
};
