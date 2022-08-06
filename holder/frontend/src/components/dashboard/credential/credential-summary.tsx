import toast from 'react-hot-toast';
import type { FC } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import {
  Button,
  Card,
  CardHeader,
  Divider,
  Theme,
  CardContent,
  useMediaQuery
} from '@mui/material';
import { PropertyList } from '../../misc/property-list';
import { PropertyListItem } from '../../misc/property-list-item';
import type { VerifiableCredential } from '@veramo/core';
import { truncate } from '../../../utils/truncate';

interface CredentialDetailsProps {
  credential: VerifiableCredential;
  hash: string;
}

export const CredentialSummary: FC<CredentialDetailsProps> = (props) => {
  const { credential, hash, ...other } = props;
  const smDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  const align = smDown ? 'vertical' : 'horizontal';
  const router = useRouter();

  const handleDelete = async (hash: string) => {
    try {
      const response = await fetch(`http://localhost:5001/credentials/${hash}`, {
        method: 'DELETE'
      });
      toast.success('Credential deleted!');
      router.push('/dashboard/credentials');
    } catch (err) {
      toast.error('Something went wrong!');
    }
  }

  return (
    <>
      <Card {...other}>
        <CardHeader title="Basic Details" />
        <Divider />
        <PropertyList>
          <PropertyListItem
            align={align}
            label="Name"
            value={credential.name}
          />
          <Divider />
          <PropertyListItem
            align={align}
            label="Description"
            value={credential.description}
          />
          <Divider />
        </PropertyList>
      </Card>

      <Card {...other}
        sx={{ mt: 3 }}
      >
        <CardHeader title="Credential Subject" />
        <Divider />
        <PropertyList>
          <PropertyListItem
            align={align}
            label="Subject DID"
            value={truncate(credential.credentialSubject.id as string)}
          />
          <Divider />
          <PropertyListItem
            align={align}
            label="Name"
            value={credential.credentialSubject.name}
          />
          <Divider />
          <PropertyListItem
            align={align}
            label="Course"
            value={credential.credentialSubject.course}
          />
          <Divider />
        </PropertyList>
      </Card>

      <Card {...other}
        sx={{ mt: 3 }}
      >
        <CardHeader title="Issuer" />
        <Divider />
        <PropertyList>
          <PropertyListItem
            align={align}
            label="Issuer did"
            value={typeof credential.issuer == 'object' ? truncate(credential.issuer.id) : ''}
          />
          <Divider />
          <PropertyListItem
            align={align}
            label="Alias"
            value={typeof credential.issuer == 'object' ? credential.issuer.alias : ''}
          />
          <Divider />
        </PropertyList>
      </Card>
      <Card {...other}
        sx={{ mt: 3 }}
      >
        <CardHeader title="Date" />
        <Divider />
        <PropertyList>
          <PropertyListItem
            align={align}
            label="Issuance date"
            value={new Date(credential.issuanceDate).toDateString()}
          />
          <Divider />
        </PropertyList>
      </Card>

      <Card {...props}
        sx={{ mt: 3 }}>
        <CardHeader title="Data Management" />
        <Divider />
        <CardContent>
          <Button
            color="error"
            variant="outlined"
            onClick={() => handleDelete(hash)}
          >
            Delete Credential
          </Button>
        </CardContent>
      </Card>
    </>
  );
};

CredentialSummary.propTypes = {
  // @ts-ignore
  credential: PropTypes.object.isRequired,
  hash: PropTypes.string.isRequired
};
