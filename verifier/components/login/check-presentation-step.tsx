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
import { JWTDecoded } from 'did-jwt/lib/JWT';

interface JobDetailsStepProps {
  onNext?: () => void;
  onBack?: () => void;
  jwt: string;
  // domain: string;
  challenge: string;
}

interface Condition {
  text: string;
  valid: boolean;
}

export const CheckPresentationStep: FC<JobDetailsStepProps> = (props) => {
  const { onBack, onNext, jwt, challenge, ...other } = props;
  const [conditions, setConditions] = useState<Condition[]>([
    {
      text: 'Query from blockchain: Holder signature is valid',
      valid: false
    },
    {
      text: 'Challenge is correct',
      valid: false
    }
  ]);

  useEffect(() => {
    async function verifySignature() {
      console.log(challenge)
      const result: boolean = await agent.verifyPresentation({
        presentation: jwt
      });

      const { payload: vpPayload, header, signature, data }: JWTDecoded = decodeJWT(jwt);
      const vcJwt = vpPayload.vp.verifiableCredential[0];
      const { payload: vcPayload, ...rest}: JWTDecoded = decodeJWT(vcJwt);
      
      setConditions((previousCondition) => {
        let newCondition = [...previousCondition];
        newCondition[0].valid = result && (vcPayload.sub === vpPayload.iss);
        return newCondition;
      });
    }

    async function verifyChallenge() {
      const { payload } = decodeJWT(jwt);
      const result = (payload.nonce === challenge)
      setConditions((previousCondition) => {
        let newCondition = [...previousCondition];
        newCondition[1].valid = result;
        return newCondition;
      });
    }

    if (jwt) {
      verifySignature();
      verifyChallenge();
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
          disabled={
            conditions.some(condition => !condition.valid)
          }
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

CheckPresentationStep.propTypes = {
  onBack: PropTypes.func,
  onNext: PropTypes.func,
  jwt: PropTypes.string.isRequired,
  // domain: PropTypes.string.isRequired,
  challenge: PropTypes.string.isRequired,
};