import { useCallback, useEffect, useMemo, useState } from 'react';
import type { FC } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import {
  Avatar,
  Box,
  Button,
  Card,
  Grid,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Typography
} from '@mui/material';
import { Layout } from '../components/layout';
import type { StepIconProps } from '@mui/material';
import { InputJWTStep } from '../components/login/input-jwt-step';
import { CheckCredentialsStep } from '../components/login/check-credentials-step';
import { CheckPresentationStep } from '../components/login/check-presentation-step';
import { Check as CheckIcon } from '../icons/check';
import { v4 as uuidv4 } from 'uuid';

const StepIcon: FC<StepIconProps> = (props) => {
  const { active, completed, icon } = props;

  const highlight = active || completed;

  return (
    <Avatar
      sx={{
        height: 40,
        width: 40,
        ...(highlight && {
          backgroundColor: 'secondary.main',
          color: 'secondary.contrastText'
        })
      }}
      variant="rounded"
    >
      {
        completed
          ? <CheckIcon fontSize="small" />
          : icon
      }
    </Avatar>
  );
};

const JobCreate: NextPage = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [complete, setComplete] = useState<boolean>(false);
  const [jwt, setJwt] = useState<string>('');
  const domain: string = uuidv4();
  const challenge: string = uuidv4();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleComplete = () => {
    setComplete(true);
  };

  const handleSetJwt = (jwt: string) => {
    setJwt(jwt);
  }

  const steps = [
    {
      label: 'Input Presentation',
      content: (
        <InputJWTStep
          onNext={handleNext}
          handleSetJwt={handleSetJwt}
          domain={domain}
          challenge={challenge}
        />
      )
    },
    {
      label: 'Check holder of Presentation',
      content: (
        <CheckPresentationStep
          onBack={handleBack}
          onNext={handleNext}
          jwt={jwt}
          domain={domain}
          challenge={challenge}
        />
      )
    },
    {
      label: 'Check credentials',
      content: (
        <CheckCredentialsStep
          onBack={handleBack}
          onNext={handleComplete}
        />
      )
    }
  ];

  return (
    <>
      <Head>
        <title>
          Login
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          display: 'flex',
          flexGrow: 1
        }}
      >
        <Grid
          container
          sx={{ flexGrow: 1 }}
        >
          <Grid
            item
            xs={12}
            md={8}
            sx={{
              p: {
                xs: 4,
                sm: 6,
                md: 8
              }
            }}
          >
            <Box maxWidth="sm">
              <Typography
                sx={{ mb: 3 }}
                variant="h4"
              >
                Login
              </Typography>
              {
                !complete
                  ? (
                    <Stepper
                      activeStep={activeStep}
                      orientation="vertical"
                      sx={{
                        '& .MuiStepConnector-line': {
                          ml: 1,
                          borderLeftColor: 'divider',
                          borderLeftWidth: 2
                        }
                      }}
                    >
                      {steps.map((step, index) => (
                        <Step key={step.label}>
                          <StepLabel StepIconComponent={StepIcon}>
                            <Typography
                              sx={{ ml: 2 }}
                              variant="overline"
                            >
                              {step.label}
                            </Typography>
                          </StepLabel>
                          <StepContent
                            sx={{
                              ml: '20px',
                              borderLeftColor: 'divider',
                              borderLeftWidth: 2,
                              ...(activeStep === index && {
                                py: 4
                              })
                            }}
                          >
                            {step.content}
                          </StepContent>
                        </Step>
                      ))}
                    </Stepper>
                  )
                  : (
                    <div>
                      <Avatar
                        sx={{
                          backgroundColor: 'success.main',
                          color: 'success.contrastText',
                          height: 40,
                          width: 40
                        }}
                      >
                        <CheckIcon />
                      </Avatar>
                      <Typography
                        variant="h6"
                        sx={{ mt: 2 }}
                      >
                        All done!
                      </Typography>
                      <Typography
                        color="textSecondary"
                        variant="body2"
                      >
                        You can start studying Artificial Intelligence now
                      </Typography>
                    </div>
                  )
              }
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

JobCreate.getLayout = (page) => (
  <Layout>
    {page}
  </Layout>
);


export default JobCreate;
