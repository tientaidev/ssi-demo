import { FC, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  AppBar,
  Box,
  IconButton,
  Toolbar,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { AppBarProps, Typography } from '@mui/material';
import { Menu as MenuIcon } from '../../../icons/menu';
import {
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon
} from '@mui/icons-material';
import { useSettings } from '../../../hooks/use-settings';
import { metaMask, hooks } from '../../../connectors/metaMask';
import { ConnectButton } from '../../misc/connect-button';
const { useChainId, useIsActivating, useIsActive } = hooks

interface DashboardNavbarProps extends AppBarProps {
  onOpenSidebar?: () => void;
}

const DashboardNavbarRoot = styled(AppBar)(
  ({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    ...(
      theme.palette.mode === 'light'
        ? {
          boxShadow: theme.shadows[3]
        }
        : {
          backgroundColor: theme.palette.background.paper,
          borderBottomColor: theme.palette.divider,
          borderBottomStyle: 'solid',
          borderBottomWidth: 1,
          boxShadow: 'none'
        }
    )
  })
);

export const DashboardNavbar: FC<DashboardNavbarProps> = (props) => {
  const { onOpenSidebar, ...other } = props;
  const { settings, saveSettings } = useSettings();
  const chainId = useChainId();
  const isActivating = useIsActivating();
  const isActive = useIsActive();

  const changeTheme = () => {
    if (settings.theme === 'dark') {
      saveSettings({ theme: 'light' })
    } else {
      saveSettings({ theme: 'dark' })
    }
  }

  useEffect(() => {
    void metaMask.connectEagerly().catch(() => {
      console.log('Failed to connect eagerly to metamask')
    })
  }, [])

  return (
    <>
      <DashboardNavbarRoot
        sx={{
          left: {
            lg: 280
          },
          width: {
            lg: 'calc(100% - 280px)'
          }
        }}
        {...other}
      >
        <Toolbar
          disableGutters
          sx={{
            minHeight: 64,
            left: 0,
            px: 2
          }}
        >
          <IconButton
            onClick={onOpenSidebar}
            sx={{
              display: {
                xs: 'inline-flex',
                lg: 'none'
              }
            }}
          >
            <MenuIcon fontSize="small" />
          </IconButton>
          <Typography variant="h5">
            Issuer dashboard
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton
            onClick={changeTheme}
            sx={{ mr: 2 }}
          >
            {
              settings.theme === 'dark' ? <LightModeIcon /> : <DarkModeIcon />
            }
          </IconButton>
          <ConnectButton
            chainId={chainId}
            isActivating={isActivating}
            isActive={isActive}
          />
        </Toolbar>
      </DashboardNavbarRoot>
    </>
  );
};

DashboardNavbar.propTypes = {
  onOpenSidebar: PropTypes.func
};
