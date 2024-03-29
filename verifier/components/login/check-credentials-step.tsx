import { useState } from 'react';
import type { FC } from 'react';
import PropTypes from 'prop-types';
import {
  Box, Button, Typography, List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { ArrowRight as ArrowRightIcon } from '../../icons/arrow-right';

interface JobDescriptionStepProps {
  onBack?: () => void;
  onNext?: () => void;
}

export const CheckCredentialsStep: FC<JobDescriptionStepProps> = (props) => {
  const { onBack, onNext, ...other } = props;
  const [content, setContent] = useState<string>('');

  const conditions = [
    {
      text: 'Query from blockchain: PPL certificate valid and passed',
      valid: true
    }
  ]

  return (
    <div {...other}>
      <Box>
        <List>
          {conditions.map((condition) => (
            <ListItem key={condition.text}>
              <ListItemIcon>
                {
                  condition.valid ? <CheckIcon color='success' /> : <CloseIcon color='error' />
                }
              </ListItemIcon>
              <ListItemText>{condition.text}</ListItemText>
            </ListItem>
          ))}
        </List>
      </Box>
      <Box sx={{ mt: 3 }}>
        <Button
          endIcon={(<ArrowRightIcon fontSize="small" />)}
          onClick={onNext}
          variant="contained"
        >
          Continue
        </Button>
        <Button
          onClick={onBack}
          sx={{ ml: 2 }}
        >
          Back
        </Button>
      </Box>
    </div>
  );
};

CheckCredentialsStep.propTypes = {
  onBack: PropTypes.func,
  onNext: PropTypes.func
};