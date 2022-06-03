import { ReactNode, useEffect } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { Home as HomeIcon } from '../../../icons/home';
import { Box, Button, Divider, Drawer, Typography, useMediaQuery } from '@mui/material';
import { PermIdentity, PresentToAll, VerifiedUser } from '@mui/icons-material'
import { Scrollbar } from '../../scrollbar';
import { DashboardSidebarSection } from './dashboard-sidebar-section';
import type { FC } from 'react';
import type { Theme } from '@mui/material';

interface DashboardSidebarProps {
  onClose?: () => void;
  open?: boolean;
}

interface Item {
  title: string;
  children?: Item[];
  chip?: ReactNode;
  icon?: ReactNode;
  path?: string;
}

interface Section {
  title: string;
  items: Item[];
}

const getSections = (): Section[] => [
  {
    title: 'General',
    items: [
      {
        title: 'Overview',
        path: '/dashboard',
        icon: <HomeIcon fontSize="small" />
      }
    ]
  },
  {
    title: 'Management',
    items: [
      {
        title: 'Identifiers',
        path: '/dashboard/identifiers',
        icon: <PermIdentity fontSize="small" />,
        children: [
          {
            title: 'List',
            path: '/dashboard/identifiers'
          },
          {
            title: 'New',
            path: '/dashboard/identifiers/new'
          }
        ]
      },
      {
        title: 'Credentials',
        path: '/dashboard/credentials',
        icon: <VerifiedUser fontSize="small" />,
        children: [
          {
            title: 'List',
            path: '/dashboard/credentials'
          },
          {
            title: 'Issue',
            path: '/dashboard/credentials/new'
          },
          {
            title: 'Import',
            path: '/dashboard/identifiers/import'
          }
        ]
      },
      {
        title: 'Presentations',
        path: '/dashboard/presentations',
        icon: <PresentToAll fontSize="small" />,
        children: [
          {
            title: 'List',
            path: '/dashboard/presentations'
          },
          {
            title: 'Issue',
            path: '/dashboard/credentials/new'
          }
        ]
      }
    ]
  },
];

export const DashboardSidebar: FC<DashboardSidebarProps> = (props) => {
  const { onClose, open } = props;
  const router = useRouter();
  const lgUp = useMediaQuery(
    (theme: Theme) => theme.breakpoints.up('lg'),
    {
      noSsr: true
    }
  );
  const sections = getSections();

  const handlePathChange = () => {
    if (!router.isReady) {
      return;
    }

    if (open) {
      onClose?.();
    }
  };

  useEffect(
    handlePathChange,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router.isReady, router.asPath]
  );

  const content = (
    <>
      <Scrollbar
        sx={{
          height: '100%',
          '& .simplebar-content': {
            height: '100%'
          }
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%'
          }}
        >
          <Box sx={{ flexGrow: 1 }}>
            {sections.map((section) => (
              <DashboardSidebarSection
                key={section.title}
                path={router.asPath}
                sx={{
                  mt: 2,
                  '& + &': {
                    mt: 2
                  }
                }}
                {...section}
              />
            ))}
          </Box>
          <Divider
            sx={{
              borderColor: '#2D3748'  // dark divider
            }}
          />
          <Box sx={{ p: 2 }}>
            <Typography
              color="neutral.100"
              variant="subtitle2"
            >
              Learn more about Verifiable Credentials
            </Typography>
            <NextLink
              href="https://www.w3.org/TR/vc-data-model/"
              passHref
            >
              <Button
                color="secondary"
                component="a"
                fullWidth
                sx={{ mt: 2 }}
                variant="contained"
              >
                W3C Verifiable Credential
              </Button>
            </NextLink>
          </Box>
        </Box>
      </Scrollbar>
    </>
  );

  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open
        PaperProps={{
          sx: {
            backgroundColor: 'neutral.900',
            borderRightColor: 'divider',
            borderRightStyle: 'solid',
            borderRightWidth: (theme) => theme.palette.mode === 'dark' ? 1 : 0,
            color: '#FFFFFF',
            width: 280
          }
        }}
        variant="permanent"
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          backgroundColor: 'neutral.900',
          color: '#FFFFFF',
          width: 280
        }
      }}
      sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
      variant="temporary"
    >
      {content}
    </Drawer>
  );
};

DashboardSidebar.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool
};
