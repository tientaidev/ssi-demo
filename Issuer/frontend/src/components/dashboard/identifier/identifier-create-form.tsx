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
  TextField,
} from '@mui/material';

const createIdentifier = async (alias: string) => {
  const result = await fetch('http://localhost:5000/dids', {
    method: 'POST',
    body: JSON.stringify({
      alias: alias
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  });
}


export const IdentifierCreateForm: FC = (props) => {
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      alias: '',
      submit: null
    },
    validationSchema: Yup.object({
      alias: Yup.string().max(255).required(),
    }),
    onSubmit: async (values, helpers): Promise<void> => {
      try {
        await createIdentifier(values.alias);
        toast.success('Identifier created!');
        router.push('/dashboard/identifiers').catch(console.error);
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
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              md={8}
              xs={12}
            >
              <TextField
                error={Boolean(formik.touched.alias && formik.errors.alias)}
                fullWidth
                helperText={formik.touched.alias && formik.errors.alias}
                label="Alias"
                name="alias"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.alias}
              />
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
          variant="outlined"
        >
          Cancel
        </Button>
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
