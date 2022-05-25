import { useEffect, useState } from 'react';
import type { ChangeEvent, FC, MouseEvent } from 'react';
import NextLink from 'next/link';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  IconButton,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from '@mui/material';
import { ArrowRight as ArrowRightIcon } from '../../../icons/arrow-right';
import { PencilAlt as PencilAltIcon } from '../../../icons/pencil-alt';
import { Scrollbar } from '../../scrollbar';
import type { IIdentifier } from '@veramo/core';
import { truncate } from '../../../utils/truncate'

interface DIDListTableProps {
  identifiers: IIdentifier[];
  identifiersCount: number;
  onPageChange: (event: MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
  onRowsPerPageChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  page: number;
  rowsPerPage: number;
}

export const DIDListTable: FC<DIDListTableProps> = (props) => {
  const {
    identifiers,
    identifiersCount,
    onPageChange,
    onRowsPerPageChange,
    page,
    rowsPerPage,
    ...other
  } = props;
  const [selectedIdentifiers, setSelectedIdentifiers] = useState<string[]>([]);

  

  return (
    <div {...other}>
      <Scrollbar>
        <Table sx={{ minWidth: 700 }}>
          <TableHead>
            <TableRow>
              <TableCell>
                Alias
              </TableCell>
              <TableCell>
                DID
              </TableCell>
              <TableCell>
                Controller Key Id
              </TableCell>
              <TableCell align="right">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {identifiers.map((identifier) => {
              const isIdentifierSelected = selectedIdentifiers.includes(identifier.did);

              return (
                <TableRow
                  hover
                  key={identifier.did}
                  selected={isIdentifierSelected}
                >
                  <TableCell>
                    {`${identifier.alias}`}
                  </TableCell>
                  <TableCell>
                    {`${truncate(identifier.did)}`}
                  </TableCell>
                  <TableCell>
                    {`${truncate(identifier.controllerKeyId)}`}
                  </TableCell>
                  <TableCell align="right">
                    <NextLink
                      href="/dashboard/customers/1/edit"
                      passHref
                    >
                      <IconButton component="a">
                        <PencilAltIcon fontSize="small" />
                      </IconButton>
                    </NextLink>
                    <NextLink
                      href="/dashboard/identifiers/[did]" 
                      as={`/dashboard/identifiers/${identifier.did}`}
                      passHref
                    >
                      <IconButton component="a">
                        <ArrowRightIcon fontSize="small" />
                      </IconButton>
                    </NextLink>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Scrollbar>
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

DIDListTable.propTypes = {
  identifiers: PropTypes.array.isRequired,
  identifiersCount: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired
};
