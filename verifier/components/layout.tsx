import { styled } from '@mui/material/styles';
import type { FC, ReactNode } from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';

const LayoutRoot = styled('div')(
  ({ theme }) => ({
    display: 'flex',
    flex: '1 1 auto',
    maxWidth: '100%',
    paddingTop: 64,
    [theme.breakpoints.up('lg')]: {
      paddingLeft: 280
    }
  })
);

interface LayoutProps {
  children?: ReactNode;
}

export const Layout: FC<LayoutProps> = (props) => {
  const { children } = props;

  return (
    <>
      <LayoutRoot>
        <Box
          sx={{
            display: 'flex',
            flex: '1 1 auto',
            flexDirection: 'column',
            width: '100%'
          }}
        >
          {children}
        </Box>
      </LayoutRoot>
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node
};