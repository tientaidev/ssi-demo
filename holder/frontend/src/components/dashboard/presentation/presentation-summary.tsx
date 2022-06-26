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
import type { VerifiablePresentation } from '@veramo/core';
import { truncate } from '../../../utils/truncate';

interface PresentationDetailsProps {
  presentation: VerifiablePresentation;
  hash: string;
}

export const PresentationSummary: FC<PresentationDetailsProps> = (props) => {
  const { presentation, hash, ...other } = props;
  const smDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  const align = smDown ? 'vertical' : 'horizontal';
  const router = useRouter();

  const handleDelete = async (hash: string) => {
    try {
      const response = await fetch(`http://localhost:5001/presentations/${hash}`, {
        method: 'DELETE'
      });

      if (response.status !== 200) {
        toast.error('Error when deleting presentation !')
      } else {
        toast.success('Presentation deleted!');
      }

      router.push('/dashboard/presentations');
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
            value={presentation.name}
          />
          <Divider />
          <PropertyListItem
            align={align}
            label="Description"
            value={presentation.description}
          />
          <Divider />
          <PropertyListItem
            align={align}
            label="Challenge"
            value={presentation.challenge}
          />
          <Divider />
        </PropertyList>
      </Card>

      {
        presentation.verifiableCredential?.map((credential, index) =>
          <Card {...other}
            sx={{ mt: 3 }}
            key={index + 1}
          >
            <CardHeader title={`Verifiable Credential ${index + 1}`} key={index + 1} />
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
              <PropertyListItem
                align={align}
                label="Issuer DID"
                value={truncate(credential.issuer.id as string)}
              />
              <Divider />
            </PropertyList>
          </Card>
        )
      }

      <Card {...other}
        sx={{ mt: 3 }}
      >
        <CardHeader title="Holder" />
        <Divider />
        <PropertyList>
          <PropertyListItem
            align={align}
            label="Holder did"
            value={truncate(presentation.holder)}
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
            value={new Date(presentation.issuanceDate as string).toDateString()}
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
            Delete Presentation
          </Button>
        </CardContent>
      </Card>
    </>
  );
};

PresentationSummary.propTypes = {
  // @ts-ignore
  presentation: PropTypes.object.isRequired,
  hash: PropTypes.string.isRequired
};
