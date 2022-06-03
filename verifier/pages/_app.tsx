import '../styles/globals.css'
import { createTheme } from '../theme';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Toaster } from 'react-hot-toast';
import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  const theme = createTheme();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Toaster position="top-center" />
      <Component {...pageProps} />
    </ThemeProvider>
  )
}

export default MyApp;
