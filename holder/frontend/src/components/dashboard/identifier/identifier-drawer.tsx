import { SyntheticEvent, useState, useCallback, useEffect } from 'react';
import type { FC, MutableRefObject } from 'react';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import NextLink from 'next/link';
import {
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField, Theme,
  Typography, useMediaQuery
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { styled } from '@mui/material/styles';
import { SeverityPill } from '../../severity-pill'
import { Plus as PlusIcon } from '../../../icons/plus';;
import { Close as CloseIcon, Edit as EditIcon, ArrowUpward as ArrowUpwardIcon, AddLink as AddLinkIcon } from '@mui/icons-material';
import Link from '@mui/material/Link';
import { X as XIcon } from '../../../icons/x';
import { PropertyList } from '../../property-list';
import { PropertyListItem } from '../../misc/property-list-item';
import type { IIdentifier } from '@veramo/core';
import { Scrollbar } from '../../scrollbar';
import { truncate } from '../../../utils/truncate';
import { computeAddress } from '@ethersproject/transactions'
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

interface IdentifierDrawerProps {
  containerRef?: MutableRefObject<HTMLDivElement | null>;
  open?: boolean;
  onClose?: () => void;
  handleDeleteIdentifier: (did: string) => void;
  did?: string;
}

interface IdentifierPreviewProps {
  lgUp: boolean;
  onEdit?: () => void;
  handleDeleteIdentifier: (did: string) => void;
  handleAddKey: (did: string) => void;
  handleRemoveKey: (did: string, kid: string) => void;
  identifier: IIdentifier;
  loadingAddButton: boolean;
  loadingRemoveButtonKid: string;
}

const IdentifierPreview: FC<IdentifierPreviewProps> = (props) => {
  const { lgUp, onEdit, identifier, handleDeleteIdentifier, handleAddKey, handleRemoveKey, loadingAddButton, loadingRemoveButtonKid } = props;
  const align = lgUp ? 'horizontal' : 'vertical';

  const ethereumAddress = computeAddress('0x' + identifier.controllerKeyId);

  return (
    <>
      <Box
        sx={{
          alignItems: 'center',
          backgroundColor: (theme) => theme.palette.mode === 'dark'
            ? 'neutral.800'
            : 'neutral.100',
          borderRadius: 1,
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          px: 3,
          py: 2.5
        }}
      >
        <Typography
          color="textSecondary"
          sx={{ mr: 2 }}
          variant="overline"
        >
          Actions
        </Typography>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexWrap: 'wrap',
            m: -1,
            '& > button': {
              m: 1
            }
          }}
        >
          <Button
            onClick={onEdit}
            size="small"
            startIcon={(<EditIcon fontSize="small" />)}
          >
            Edit
          </Button>
        </Box>
      </Box>
      <Typography
        sx={{ my: 3 }}
        variant="h6"
      >
        Details
      </Typography>
      <PropertyList>
        <PropertyListItem
          align={align}
          disableGutters
          label="ID"
          value={truncate(identifier.did)}
        />
        <PropertyListItem
          align={align}
          disableGutters
          label="Ethereum address"
          value={truncate(ethereumAddress)}
        />
        <PropertyListItem
          align={align}
          disableGutters
          label="Alias"
          value={identifier.alias}
        />
      </PropertyList>
      <Divider sx={{ mt: 3 }} />
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography
          sx={{ my: 3 }}
          variant="h6">
          Keys
        </Typography>
        <Box>
          <LoadingButton
            loadingPosition="start"
            loading={loadingAddButton}
            onClick={() => handleAddKey(identifier.did)}
            size="small"
            startIcon={(<PlusIcon fontSize="small" />)}
          >
            Add
          </LoadingButton>
          <Button
            onClick={onEdit}
            size="small"
            startIcon={(<ArrowUpwardIcon fontSize="small" />)}
          >
            Import
          </Button>
          <Button
            onClick={() => console.log('hello world')}
            size='small'
            startIcon={(<AddLinkIcon />)}
          >
            Link key
          </Button>
        </Box>

      </Box>
      <Scrollbar>
        <Table sx={{ minWidth: 400 }}>
          <TableHead>
            <TableRow>
              <TableCell>
                Public key
              </TableCell>
              <TableCell>
                System
              </TableCell>
              <TableCell>
                Role
              </TableCell>
              <TableCell>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(identifier.keys || []).map((item) => (
              <TableRow key={item.publicKeyHex}>
                <TableCell>
                  {truncate(item.publicKeyHex)}
                </TableCell>
                <TableCell>
                  Internal
                </TableCell>
                <TableCell>
                  <SeverityPill color={identifier.controllerKeyId === item.publicKeyHex ? 'info' : 'warning'}>
                    {identifier.controllerKeyId === item.publicKeyHex ? 'Controller' : 'Delegate'}
                  </SeverityPill>
                </TableCell>
                <TableCell>
                  {
                    (identifier.controllerKeyId !== item.publicKeyHex) &&
                    <LoadingButton
                      loadingPosition='center'
                      loading={loadingRemoveButtonKid === item.publicKeyHex}
                      onClick={() => handleRemoveKey(identifier.did, item.publicKeyHex)}
                      size='small'
                      startIcon={(<CloseIcon fontSize="small" />)}
                    >
                    </LoadingButton>
                  }
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Link
          href={`https://rinkeby.etherscan.io/address/${ethereumAddress}`}
          target='_blank'
          underline='none'
        >
          <Button
            color="info"
            sx={{ mt: 3 }}
          >
            View on Etherscan
          </Button>
        </Link>
        <Button
          color="error"
          sx={{ mt: 3 }}
          onClick={() => handleDeleteIdentifier(identifier.did)}
        >
          Delete identifier
        </Button>
      </Scrollbar>
    </>
  );
};

interface IdentifierFormProps {
  onCancel?: () => void;
  onSave?: () => void;
  identifier: IIdentifier;
}

const IdentifierForm: FC<IdentifierFormProps> = (props) => {
  const { onCancel, onSave, identifier } = props;

  return (
    <>
      <Box
        sx={{
          alignItems: 'center',
          backgroundColor: (theme) => theme.palette.mode === 'dark'
            ? 'neutral.800'
            : 'neutral.100',
          borderRadius: 1,
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          px: 3,
          py: 2.5
        }}
      >
        <Typography
          variant="overline"
          sx={{ mr: 2 }}
          color="textSecondary"
        >
          Key
        </Typography>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            m: -1,
            '& > button': {
              m: 1
            }
          }}
        >
          <Button
            color="primary"
            onClick={onSave}
            size="small"
            variant="contained"
          >
            Save changes
          </Button>
          <Button
            onClick={onCancel}
            size="small"
            variant="outlined"
          >
            Cancel
          </Button>
        </Box>
      </Box>
      <TextField
        disabled
        fullWidth
        label="ID"
        margin="normal"
        name="id"
        value={identifier.did}
      />
      <TextField
        disabled
        fullWidth
        label="Alias"
        margin="normal"
        name="alias"
        defaultValue={identifier.alias}
      />
      <TextField
        fullWidth
        label="Public key hex"
        margin="normal"
        name="pubKey"
      />
    </>
  );
};

const IdentifierDrawerDesktop = styled(Drawer)({
  width: 500,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    position: 'relative',
    width: 500
  }
});

const IdentifierDrawerMobile = styled(Drawer)({
  flexShrink: 0,
  maxWidth: '100%',
  height: 'calc(100% - 64px)',
  width: 500,
  '& .MuiDrawer-paper': {
    height: 'calc(100% - 64px)',
    maxWidth: '100%',
    top: 64,
    width: 500
  }
});

export const IdentifierDrawer: FC<IdentifierDrawerProps> = (props) => {
  const { containerRef, onClose, handleDeleteIdentifier, open, did, ...other } = props;
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [identifier, setIdentifier] = useState<IIdentifier>();
  const [loadingAddButton, setLoadingAddButton] = useState<boolean>(false);
  const [loadingRemoveButtonKid, setLoadingRemoveButtonKid] = useState<string>('');
  const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const getIdentifier = async (did: string) => {
    try {
      const response = await fetch(`http://localhost:5001/dids/${did}`);
      const data = await response.json();
      setIdentifier(data);
    } catch (error) {
      toast.error((error as Error).message);
    }
  }

  useEffect(
    () => {
      getIdentifier(did as string);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [did]
  );

  const handleAddKey = async (did: string) => {
    setLoadingAddButton(true);
    const result = await fetch('http://localhost:5001/dids/add-key', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        did: did,
      })
    })

    setLoadingAddButton(false);
    if (result.status === 200) {
      toast.success('Key successfully added!');
    } else {
      toast.error('Insufficient fund. Please fund your Ethereum account');
    }

    getIdentifier(did);
  }

  const handleRemoveKey = async (did: string, kid: string) => {
    setLoadingRemoveButtonKid(kid);
    const result = await fetch('http://localhost:5001/dids/remove-key', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        did: did,
        kid: kid
      })
    })

    setLoadingRemoveButtonKid('');
    if (result.status === 200) {
      toast.success('Key successfully removed!');
    } else {
      toast.error('Insufficient fund. Please fund your Ethereum account');
    }

    getIdentifier(did);
  }


  // The reason for doing this, is that the persistent drawer has to be rendered, but not it's
  // content if an Identifier is not passed.
  const content = identifier
    ? (
      <>
        <Box
          sx={{
            alignItems: 'center',
            backgroundColor: 'primary.main',
            color: 'primary.contrastText',
            display: 'flex',
            justifyContent: 'space-between',
            px: 3,
            py: 2
          }}
        >
          <Typography
            color="inherit"
            variant="h6"
          >
            {identifier.alias}
          </Typography>
          <IconButton
            color="inherit"
            onClick={onClose}
          >
            <XIcon fontSize="small" />
          </IconButton>
        </Box>
        <Box
          sx={{
            px: 3,
            py: 4
          }}
        >
          {
            !isEditing
              ? (
                <IdentifierPreview
                  lgUp={lgUp}
                  onEdit={handleEdit}
                  identifier={identifier}
                  handleDeleteIdentifier={handleDeleteIdentifier}
                  handleAddKey={handleAddKey}
                  handleRemoveKey={handleRemoveKey}
                  loadingAddButton={loadingAddButton}
                  loadingRemoveButtonKid={loadingRemoveButtonKid}
                />
              )
              : (
                <IdentifierForm
                  onCancel={handleCancel}
                  onSave={handleCancel}
                  identifier={identifier}
                />
              )
          }
        </Box>
      </>
    )
    : null;

  if (lgUp) {
    return (
      <IdentifierDrawerDesktop
        anchor="right"
        open={open}
        SlideProps={{ container: containerRef?.current }}
        variant="persistent"
        {...other}
      >
        {content}
      </IdentifierDrawerDesktop>
    );
  }

  return (
    <IdentifierDrawerMobile
      anchor="right"
      ModalProps={{ container: containerRef?.current }}
      onClose={onClose}
      open={open}
      SlideProps={{ container: containerRef?.current }}
      variant="temporary"
      {...other}
    >
      {content}
    </IdentifierDrawerMobile>
  );
};

IdentifierDrawer.propTypes = {
  containerRef: PropTypes.any,
  onClose: PropTypes.func,
  handleDeleteIdentifier: PropTypes.func.isRequired,
  open: PropTypes.bool,
  // @ts-ignore
  did: PropTypes.string
};
