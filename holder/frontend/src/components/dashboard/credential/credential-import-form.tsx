import type { FC } from 'react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
} from '@mui/material';

const importCredential = async (jwt: string) => {
  const result = await fetch('http://localhost:5001/credentials/import', {
    method: 'POST',
    body: JSON.stringify({
      jwt: jwt
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  });
}


export const CredentialImportForm: FC = (props) => {
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      jwt: '',
      submit: null
    },
    validationSchema: Yup.object({
      jwt: Yup.string().required(),
    }),
    onSubmit: async (values, helpers): Promise<void> => {
      try {
        await importCredential(values.jwt);
        toast.success('Credential imported!');
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

  return (
    <form
      onSubmit={formik.handleSubmit}
      {...props}
    >
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <TextField
            error={Boolean(formik.touched.jwt && formik.errors.jwt)}
            fullWidth
            helperText={formik.touched.jwt && formik.errors.jwt}
            label="jwt"
            name="jwt"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.jwt}
          />
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
          Import
        </Button>
      </Box>
    </form>
  );
};
