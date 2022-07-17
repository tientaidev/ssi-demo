import { useState } from 'react';
import type { FC } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, TextField, Typography, FormHelperText, FormControl } from '@mui/material';
import { ArrowRight as ArrowRightIcon } from '../../icons/arrow-right';
import { agent } from '../../veramo/setup';
import { decodeJWT } from 'did-jwt'

interface InputJWTStepProps {
  onNext: () => void;
  handleSetJwt: (jwt: string) => void;
  // domain: string;
  challenge: string;
}

export const InputJWTStep: FC<InputJWTStepProps> = (props) => {
  const { onNext, handleSetJwt, challenge, ...other } = props;
  const [jwt, setJwt] = useState<string>('');
  const [error, setError] = useState<string>('');

  const checkJwt = () => {
    if (!jwt) {
      setError('Please input your JWT');
      return;
    }

    try {
      decodeJWT(jwt);
      handleSetJwt(jwt);
      onNext();
    } catch (error) {
      setError((error as Error).message);
    }
  }

  return (
    <div {...other}>
      <Box
        sx={{
          '& .MuiTextField-root': { mb: 2 },
        }}
      >
        {/* <TextField
          fullWidth
          disabled
          label="Domain"
          name="domain"
          defaultValue={domain}
        /> */}
        <Typography sx={{ mb: 3 }}>
          To login, we need you to create a VP of your PPL Certificate VC with <b>challenge</b> below.
          The VC that this VP express must be issued from HCMIU.
        </Typography>
        <TextField
          fullWidth
          disabled
          label="Challenge"
          name="challenge"
          defaultValue={challenge}
        />
        <TextField
          fullWidth
          required
          label="Proof JWT"
          name="jwt"
          placeholder="Proof JWT"
          value={jwt}
          onChange={(event) => {
            if (error) setError('');
            setJwt(event.target.value)
          }}
        />
        <FormHelperText error>{error}</FormHelperText>
      </Box>
      <Button
        endIcon={(<ArrowRightIcon fontSize="small" />)}
        onClick={checkJwt}
        variant="contained"
        sx={{ mt: 2 }}
      >
        Continue
      </Button>
    </div>
  );
};

InputJWTStep.propTypes = {
  onNext: PropTypes.func.isRequired,
  handleSetJwt: PropTypes.func.isRequired,
  // domain: PropTypes.string.isRequired,
  challenge: PropTypes.string.isRequired
};