import { FC, useEffect } from 'react';
import { Button } from '@mui/material';
import PropTypes from 'prop-types';
import { hooks as metaMaskHooks, metaMask } from '../../connectors/metaMask';
import { useWeb3React, Web3ReactHooks, Web3ReactProvider } from '@web3-react/core';
import { MetaMask } from '@web3-react/metamask';

interface ConnectButtonProps {
  chainId?: number;
  isActivating: boolean;
  isActive: boolean;
}

const connectors: [MetaMask, Web3ReactHooks][] = [
  [metaMask, metaMaskHooks]
]

function Child() {
  const { connector } = useWeb3React()
  // console.log(`Priority Connector is: ${getName(connector)}`)
  return null
}

export const ConnectButton: FC<ConnectButtonProps> = (props) => {
  useEffect(() => {
    // console.log(metaMask)
    void metaMask.connectEagerly().catch(() => {
      console.log('Failed to connect eagerly to metamask')
    })
  }, [])

  return (
    <Web3ReactProvider connectors={connectors}>
      <Child />
      <Button variant='contained'>
        Connect Wallet
      </Button>
    </Web3ReactProvider>
  )
};

ConnectButton.propTypes = {
  chainId: PropTypes.number,
  isActivating: PropTypes.bool.isRequired,
  isActive: PropTypes.bool.isRequired
};


