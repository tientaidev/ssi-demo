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
import type { UniqueVerifiableCredential } from '@veramo/data-store';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { toast } from 'react-hot-toast';
import { truncate } from 'src/utils/truncate';

interface CredentialListTableProps {
  credentials: UniqueVerifiableCredential[];
  credentialsCount: number;
  onPageChange: (event: MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
  onRowsPerPageChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  page: number;
  rowsPerPage: number;
}

export const CredentialListTable: FC<CredentialListTableProps> = (props) => {
  const {
    credentials,
    credentialsCount,
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
                Expiration Date
              </TableCell>
              <TableCell>
                Issuer
              </TableCell>
              <TableCell align="right">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {credentials.map((credential) => {
              return (
                <TableRow
                  hover
                  key={credential.hash}
                >
                  <TableCell>
                    {credential.verifiableCredential.name}
                  </TableCell>
                  <TableCell>
                    {new Date(credential.verifiableCredential.issuanceDate).toDateString()}
                  </TableCell>
                  <TableCell>
                    {credential.verifiableCredential.expirationDate || 'Not set'}
                  </TableCell>
                  <TableCell>
                    {truncate(credential.verifiableCredential.issuer.id)}
                  </TableCell>
                  <TableCell align="right">
                    <CopyToClipboard 
                      text={credential.verifiableCredential.proof.jwt}
                      onCopy={() => toast.success('Sucessfully copied credential')}
                    >
                      <IconButton component="a">
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                    </CopyToClipboard>
                    
                    <NextLink
                      href={`/dashboard/credentials/${credential.hash}`}
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
  credentials: PropTypes.array.isRequired,
  credentialsCount: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired
};
