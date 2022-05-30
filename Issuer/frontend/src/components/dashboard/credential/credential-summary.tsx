import { useState } from 'react';
import type { ChangeEvent, FC } from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import {
  Box,
  Button,
  Card,
  CardHeader,
  Divider,
  TextField, Theme,
  Typography,
  useMediaQuery
} from '@mui/material';
import { PropertyList } from '../../property-list';
import { PropertyListItem } from '../../property-list-item';
import type { VerifiableCredential } from '@veramo/core';
import { truncate } from '../../../utils/truncate';

interface OrderDetailsProps {
  credential: VerifiableCredential;
}

const statusOptions = ['Canceled', 'Complete', 'Rejected'];

export const OrderSummary: FC<OrderDetailsProps> = (props) => {
  const { credential, ...other } = props;
  const smDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

  const align = smDown ? 'vertical' : 'horizontal';

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
            value={truncate(credential.credentialSubject.id)}
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
            value={truncate(credential.issuer.id)}
          />
          <Divider />
          <PropertyListItem
            align={align}
            label="Alias"
            value={credential.issuer.alias}
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
    </>
  );
};

OrderSummary.propTypes = {
  // @ts-ignore
  order: PropTypes.object.isRequired
};
