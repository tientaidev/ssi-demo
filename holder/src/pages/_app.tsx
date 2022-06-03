import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Toaster } from 'react-hot-toast';
import { CacheProvider } from '@emotion/react';
import { SettingsConsumer, SettingsProvider } from '../contexts/settings-context';
import Head from 'next/head';
import type { AppProps } from 'next/app'
import type { EmotionCache } from '@emotion/cache';
import type { NextPage } from 'next';
import type { FC } from 'react';
import createCache from '@emotion/cache';
import { createTheme } from '../theme';

type EnhancedAppProps = AppProps & {
  Component: NextPage;
  emotionCache: EmotionCache;
}

const clientSideEmotionCache = createCache({ key: 'css' });

const App: FC<EnhancedAppProps> = (props) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>
          Holder dashboard
        </title>
        <meta
          name="viewport"
          content="initial-scale=1, width=device-width"
        />
      </Head>
      <SettingsProvider>
        <SettingsConsumer>
          {({ settings }) => (
            <ThemeProvider
              theme={createTheme({
                mode: settings.theme
              })}
            >
              <CssBaseline />
              { getLayout(<Component {...pageProps} />) }
            </ThemeProvider>
          )}
        </SettingsConsumer>
      </SettingsProvider>

    </CacheProvider>

  )
}

export default App;
