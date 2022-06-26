import type { ChangeEvent, FC, MouseEvent } from 'react';
import NextLink from 'next/link';
import PropTypes from 'prop-types';
import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
} from '@mui/material';
import { ArrowRight as ArrowRightIcon } from '../../../icons/arrow-right';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Scrollbar } from '../../misc/scrollbar';
import type { UniqueVerifiablePresentation } from '@veramo/core';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { toast } from 'react-hot-toast';
import { truncate } from 'src/utils/truncate';

interface PresentationListTableProps {
  presentations: UniqueVerifiablePresentation[];
  presentationsCount: number;
  onPageChange: (event: MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
  onRowsPerPageChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  page: number;
  rowsPerPage: number;
}

export const PresentationListTable: FC<PresentationListTableProps> = (props) => {
  const {
    presentations,
    presentationsCount,
    onPageChange,
    onRowsPerPageChange,
    page,
    rowsPerPage,
    ...other
  } = props;

  return (
    <div {...other}>
      <Scrollbar>
        <Table sx={{ minWidth: 700 }}>
          <TableHead>
            <TableRow>
              <TableCell>
                Name
              </TableCell>
              <TableCell>
                Issuance Date
              </TableCell>
              <TableCell>
                Challenge
              </TableCell>
              <TableCell>
                Holder
              </TableCell>
              <TableCell align="right">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {presentations.map((presentation) => {
              return (
                <TableRow
                  hover
                  key={presentation.hash}
                >
                  <TableCell>
                    {presentation.verifiablePresentation.name}
                  </TableCell>
                  <TableCell>
                    {new Date(presentation.verifiablePresentation.issuanceDate as string).toDateString()}
                  </TableCell>
                  <TableCell>
                    {presentation.verifiablePresentation.nonce || 'Not set'}
                  </TableCell>
                  <TableCell>
                    {truncate(presentation.verifiablePresentation.holder)}
                  </TableCell>
                  <TableCell align="right">
                    <CopyToClipboard 
                      text={presentation.verifiablePresentation.proof.jwt}
                      onCopy={() => toast.success('Sucessfully copied presentation')}
                    >
                      <IconButton component="a">
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                    </CopyToClipboard>
                    
                    <NextLink
                      href={`/dashboard/presentations/${presentation.hash}`}
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
        count={presentationsCount}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </div>
  );
};

PresentationListTable.propTypes = {
  presentations: PropTypes.array.isRequired,
  presentationsCount: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired
};
