import { useEffect, useState } from 'react';
import type { FC } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { ArrowRight as ArrowRightIcon } from '../../icons/arrow-right';
import { agent } from '../../veramo/setup';
import { decodeJWT } from 'did-jwt';

interface JobDetailsStepProps {
  onNext?: () => void;
  onBack?: () => void;
  jwt: string;
  domain: string;
  challenge: string;
}

interface Condition {
  text: string;
  valid: boolean;
}

export const JobDetailsStep: FC<JobDetailsStepProps> = (props) => {
  const { onBack, onNext, jwt, domain, challenge, ...other } = props;
  const [conditions, setConditions] = useState<Condition[]>([
    {
      text: 'Holder signature is valid',
      valid: false
    },
    {
      text: 'Domain is correct',
      valid: true
    },
    {
      text: 'Challenge is correct',
      valid: true
    }
  ]);

  useEffect(() => {
    async function verifySignature() {
      const result: boolean = await agent.verifyPresentation({
        presentation: jwt
      })
      
      setConditions((previousCondition) => {
        let newCondition = [...previousCondition];
        newCondition[0].valid = result;
        return newCondition;
      })
    }

    async function verifyChallengeAndDomain() {
      const { payload, header, signature, data } = decodeJWT(jwt);
      console.log(payload);
    }

    if (jwt) {
      verifySignature();
      verifyChallengeAndDomain();
    }
  }, [jwt]);

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

JobDetailsStep.propTypes = {
  onBack: PropTypes.func,
  onNext: PropTypes.func,
  jwt: PropTypes.string.isRequired,
  domain: PropTypes.string.isRequired,
  challenge: PropTypes.string.isRequired,
};