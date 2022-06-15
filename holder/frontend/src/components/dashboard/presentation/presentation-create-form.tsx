import { useEffect, useState } from 'react';
import NextLink from 'next/link';
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
  Checkbox,
  Grid,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  ListItemText,
  Typography
} from '@mui/material';
import { IIdentifier } from '@veramo/core';
import { truncate } from '../../../utils/truncate';
import type { UniqueVerifiableCredential } from '@veramo/data-store';
import type { ICreateVerifiablePresentationArgs } from "@veramo/credential-w3c";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export const PresentationCreateForm: FC = (props) => {
  const router = useRouter();
  const [identifiers, setIdentifiers] = useState<IIdentifier[]>([]);
  const [credentials, setCredentials] = useState<UniqueVerifiableCredential[]>();
  const [selectedCredentials, setSelectedCredentials] = useState<string[]>([]);

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      holder: '',
      keySigned: '',
      challenge: '',
      submit: null
    },
    validationSchema: Yup.object({
      description: Yup.string().max(5000).required(),
      name: Yup.string().max(255).required(),
      keySigned: Yup.string().max(130).required(),
      challenge: Yup.string().required(),
    }),
    onSubmit: async (values, helpers): Promise<void> => {
      try {
        const body: ICreateVerifiablePresentationArgs = {
          presentation: {
            verifiableCredential: selectedCredentials,
            holder: values.holder,
            name: values.name,
            description: values.description
          },
          save: true,
          proofFormat: 'jwt'
        }

        const response: Response = await fetch('http://localhost:5001/presentations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        });

        if (response.status === 200) {
          toast.success('Credential created!');
        } else {
          toast.error('Something went wrong!');
        }

        router.push('/dashboard/credentials').catch(console.error);
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
      const response = await fetch('http://localhost:5001/dids');
      if (response.status != 200) {
        toast.error("Error when fetching identifiers");
        return;
      }

      const data = await response.json();
      setIdentifiers(data);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const getCredentials = async () => {
    try {
      const response = await fetch('http:///localhost:5001/credentials');
      if (response.status != 200) {
        toast.error("Error when fetching credentials");
        return;
      }

      const data: UniqueVerifiableCredential[] = await response.json();
      setCredentials(data);
    } catch (err) {
      toast.error(err.message);
    }
  }

  useEffect(() => {
    getIdentifiers();
    getCredentials();
  },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
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
                label="Presentation Name"
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
                Challenge
              </Typography>
            </Grid>
            <Grid
              item
              md={8}
              xs={12}
            >
              <TextField
                error={Boolean(formik.touched.challenge && formik.errors.challenge)}
                fullWidth
                helperText={formik.touched.challenge && formik.errors.challenge}
                label="Challenge"
                name="challenge"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.challenge}
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
                Verifiable Credentials
              </Typography>
            </Grid>
            <Grid
              item
              md={8}
              xs={12}
            >
              <Select
                multiple
                required
                fullWidth
                value={selectedCredentials}
                onChange={(event) => setSelectedCredentials(typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value)}
                input={<OutlinedInput label="Tag" />}
                renderValue={selected => selected.join(', ')}
                MenuProps={MenuProps}
              >
                {credentials && credentials.map((credential) => (
                  <MenuItem key={credential.hash} value={credential.verifiableCredential.proof.jwt}>
                    <Checkbox checked={selectedCredentials.includes(credential.verifiableCredential.proof.jwt)} />
                    <ListItemText primary={credential.verifiableCredential.name} />
                  </MenuItem>
                ))}
              </Select>
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
                Holder
              </Typography>
            </Grid>
            <Grid
              item
              md={8}
              xs={12}
            >
              {identifiers &&
                <TextField
                  error={Boolean(formik.touched.holder && formik.errors.holder)}
                  fullWidth
                  label="Holder"
                  name="holder"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  select
                  value={formik.values.holder}
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
              {
                formik.values.holder &&
                <TextField
                  error={Boolean(formik.touched.keySigned && formik.errors.keySigned)}
                  fullWidth
                  label="Key"
                  name="keySigned"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  select
                  value={formik.values.keySigned}
                  sx={{ mt: 2 }}
                >
                  {
                  identifiers.find((identifier) => identifier.did === formik.values.holder)?.keys.map((key) => (
                    <MenuItem
                      key={key.kid}
                      value={key.kid}
                    >
                      {truncate(key.kid)}
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
          justifyContent: 'space-between',
          mx: -1,
          mb: -1,
          mt: 3
        }}
      >
        <NextLink
          href='/dashboard/credentials'
          passHref
        >
          <Button
            sx={{ m: 1 }}
            variant="outlined"
          >
            Cancel
          </Button>
        </NextLink>
        <Button
          sx={{ m: 1 }}
          type="submit"
          variant="contained"
        >
          Create
        </Button>
      </Box>
    </form>
  );
};
