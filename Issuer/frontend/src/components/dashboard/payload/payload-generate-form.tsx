import { useEffect, useState } from 'react';
import type { FC } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  MenuItem,
  TextField,
  Typography,
  InputAdornment,
  IconButton
} from '@mui/material';
import type { IIdentifier } from '@veramo/core';
import type { ICreateVerifiableCredentialArgs } from "@veramo/credential-w3c";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { CopyToClipboard } from 'react-copy-to-clipboard';

export const PayloadGenerateForm: FC = (props) => {
  const router = useRouter();
  const [identifiers, setIdentifiers] = useState<IIdentifier[]>(null);
  const [payload, setPayload] = useState<string>('');

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      subjectDid: '',
      subjectName: '',
      course: '',
      issuer: '',
      submit: null
    },
    validationSchema: Yup.object({
      category: Yup.string().max(255),
      description: Yup.string().max(5000).required(),
      name: Yup.string().max(255).required(),
      subjectDid: Yup.string().max(255).required(),
      subjectName: Yup.string().max(255).required(),
      course: Yup.string().max(255).required(),
    }),
    onSubmit: async (values, helpers): Promise<void> => {
      try {
        const body: ICreateVerifiableCredentialArgs = {
          credential: {
            issuer: values.issuer,
            name: values.name,
            description: values.description,
            credentialSubject: {
              id: values.subjectDid,
              name: values.subjectName,
              course: values.course
            }
          },
          proofFormat: 'jwt'
        }

        const response: Response = await fetch('http://localhost:5000/credentials/generate-signing-input', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        });

        setPayload(await response.text());
        toast.success('Payload generated!');
      } catch (err) {
        console.error(err);
        toast.error('Something went wrong!');
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    }
  });

  const getIdentifiers = async () => {
    try {
      const response: Response = await fetch('http://localhost:5000/dids');
      const data = await response.json();
      setIdentifiers(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getIdentifiers();
  },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <>
      {
        (payload === "") ?
          <form
            onSubmit={formik.handleSubmit}
            {...props}
          >
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Grid
                  container
                  spacing={3}
                >
                  <Grid
                    item
                    md={4}
                    xs={12}
                  >
                    <Typography variant="h6">
                      Basic detail
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    md={8}
                    xs={12}
                  >
                    <TextField
                      error={Boolean(formik.touched.name && formik.errors.name)}
                      fullWidth
                      helperText={formik.touched.name && formik.errors.name}
                      label="Credential Name"
                      name="name"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      value={formik.values.name}
                    />
                    <TextField
                      error={Boolean(formik.touched.description && formik.errors.description)}
                      fullWidth
                      helperText={formik.touched.description && formik.errors.description}
                      label="Description"
                      name="description"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      value={formik.values.description}
                      sx={{ mt: 2 }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Grid
                  container
                  spacing={3}
                >
                  <Grid
                    item
                    md={4}
                    xs={12}
                  >
                    <Typography variant="h6">
                      Credential Subject
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    md={8}
                    xs={12}
                  >
                    <TextField
                      error={Boolean(formik.touched.subjectDid && formik.errors.subjectDid)}
                      fullWidth
                      helperText={formik.touched.subjectDid && formik.errors.subjectDid}
                      label="Subject Did"
                      name="subjectDid"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      value={formik.values.subjectDid}
                      sx={{ mt: 2 }}
                    />
                    <TextField
                      error={Boolean(formik.touched.subjectName && formik.errors.subjectName)}
                      fullWidth
                      helperText={formik.touched.subjectName && formik.errors.subjectName}
                      label="Subject name"
                      name="subjectName"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      value={formik.values.subjectName}
                      sx={{ mt: 2 }}
                    />
                    <TextField
                      error={Boolean(formik.touched.course && formik.errors.course)}
                      fullWidth
                      helperText={formik.touched.course && formik.errors.course}
                      label="Course name"
                      name="course"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      value={formik.values.course}
                      sx={{ mt: 2 }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Grid
                  container
                  spacing={3}
                >
                  <Grid
                    item
                    md={4}
                    xs={12}
                  >
                    <Typography variant="h6">
                      Issuer
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    md={8}
                    xs={12}
                  >
                    {identifiers &&
                      <TextField
                        error={Boolean(formik.touched.issuer && formik.errors.issuer)}
                        fullWidth
                        label="Issuer"
                        name="issuer"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        select
                        value={formik.values.issuer}
                      >
                        {identifiers.map((identifier) => (
                          <MenuItem
                            key={identifier.did}
                            value={identifier.did}
                          >
                            {identifier.alias}
                          </MenuItem>
                        ))}
                      </TextField>
                    }
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'flex-end',
                mx: -1,
                mb: -1,
                mt: 3
              }}
            >
              <Button
                sx={{ m: 1 }}
                type="submit"
                variant="contained"
              >
                Generate
              </Button>
            </Box>
          </form>
          :
          <>
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <TextField
                  fullWidth
                  disabled
                  label="Payload"
                  value={payload}
                  InputProps={{
                    endAdornment:
                      <InputAdornment position="start">
                        <CopyToClipboard
                          text={payload}
                          onCopy={() => toast.success("Copy payload successfully")}
                        >
                          <IconButton edge="end">
                            <ContentCopyIcon />
                          </IconButton>
                        </CopyToClipboard>
                      </InputAdornment>
                  }}
                />
              </CardContent>
            </Card>
            <Button
              sx={{ mt: 2 }}
              variant="outlined"
              onClick={() => {
                setPayload('');
              }}
            >
              Back
            </Button>
          </>
      }
    </>

  );
};
