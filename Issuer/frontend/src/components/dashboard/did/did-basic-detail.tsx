import type { FC } from 'react';
import PropTypes from 'prop-types';
import { Button, Card, CardActions, CardHeader, Divider, useMediaQuery } from '@mui/material';
import { format, subDays, subHours, subMinutes } from 'date-fns';
import type { Theme } from '@mui/material';
import { PropertyList } from '../../property-list';
import { PropertyListItem } from '../../property-list-item';

interface IdentifierBasicDetailsProps {
  did: string;
  alias?: string;
}

export const IdentifierBasicDetails: FC<IdentifierBasicDetailsProps> = (props) => {
  const { did, alias, ...other } = props;
  const mdUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));
  const now = new Date();

  const align = mdUp ? 'horizontal' : 'vertical';

  return (
    <Card {...other}>
      <CardHeader title="Basic details" />
      <Divider />
      <PropertyList>
        <PropertyListItem
          align={align}
          divider
          label="Alias"
          value={alias}
        />
        <PropertyListItem
          align={align}
          divider
          label="Created at"
          value={now.toDateString()}
        />
      </PropertyList>
      {/* <CardActions
        sx={{
          flexWrap: 'wrap',
          px: 3,
          py: 2,
          m: -1
        }}
      >
        <Button
          sx={{ m: 1 }}
          variant="outlined"
        >
          Reset &amp; Send Password
        </Button>
        <Button sx={{ m: 1 }}>
          Login as Customer
        </Button>
      </CardActions> */}
    </Card>
  );
};

IdentifierBasicDetails.propTypes = {
  did: PropTypes.string,
  alias: PropTypes.string
};
