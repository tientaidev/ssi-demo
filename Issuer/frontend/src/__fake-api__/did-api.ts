import type { IIdentifier, IKey } from '@veramo/core';

class IdentifierApi {
  getIdentifiers(): Promise<IIdentifier[]> {
    const identifiers: IIdentifier[] = [
      {
        did: 'did:ethr:rinkeby:0x0287eb9ac230a4d3083a1868a7ca1bee04a5aa1c48d25e9ca7a55341e3aa841e00',
        provider: 'did:ethr:rinkeby',
        alias: 'school did',
        controllerKeyId:
          '0487eb9ac230a4d3083a1868a7ca1bee04a5aa1c48d25e9ca7a55341e3aa841e000ad3420bb5d9806ff3a66bf4856af2d120492fd40b52f63c69354596ac143c2e',
        keys: [
          {
            kid: '0487eb9ac230a4d3083a1868a7ca1bee04a5aa1c48d25e9ca7a55341e3aa841e000ad3420bb5d9806ff3a66bf4856af2d120492fd40b52f63c69354596ac143c2e',
            kms: 'local',
            type: 'Secp256k1',
            publicKeyHex:
              '0487eb9ac230a4d3083a1868a7ca1bee04a5aa1c48d25e9ca7a55341e3aa841e000ad3420bb5d9806ff3a66bf4856af2d120492fd40b52f63c69354596ac143c2e',
            meta: {
              algorithms: [
                'ES256K',
                'ES256K-R',
                'eth_signTransaction',
                'eth_signTypedData',
                'eth_signMessage',
              ],
            },
          },
        ],
        services: [],
      },
      {
        did: 'did:ethr:rinkeby:0x036ce37e22bd558214365dfda0b2860998c1febbe0db63eb2fe845be11286b146c',
        alias: 'work did',
        provider: 'did:ethr:rinkeby',
        controllerKeyId:
          '046ce37e22bd558214365dfda0b2860998c1febbe0db63eb2fe845be11286b146ce11e4ef76b73b4869a108fca1eed22c8de4d5c5b46befabb13a267492fee5893',
        keys: [
          {
            kid: '046ce37e22bd558214365dfda0b2860998c1febbe0db63eb2fe845be11286b146ce11e4ef76b73b4869a108fca1eed22c8de4d5c5b46befabb13a267492fee5893',
            kms: 'local',
            type: 'Secp256k1',
            publicKeyHex:
              '046ce37e22bd558214365dfda0b2860998c1febbe0db63eb2fe845be11286b146ce11e4ef76b73b4869a108fca1eed22c8de4d5c5b46befabb13a267492fee5893',
            meta: {
              algorithms: [
                'ES256K',
                'ES256K-R',
                'eth_signTransaction',
                'eth_signTypedData',
                'eth_signMessage',
              ],
            },
          },
        ],
        services: [],
      },
      {
        did: 'did:ethr:rinkeby:0x0316da5f662ec7a04b6ea218781ea6e35de620f223cc0aefd3132b54346de447f6',
        alias: 'gym did',
        provider: 'did:ethr:rinkeby',
        controllerKeyId:
          '0416da5f662ec7a04b6ea218781ea6e35de620f223cc0aefd3132b54346de447f678b77c4907ec60ee135bea122ad812aec11de8494333d009b76bbb812b23a5bf',
        keys: [
          {
            kid: '0416da5f662ec7a04b6ea218781ea6e35de620f223cc0aefd3132b54346de447f678b77c4907ec60ee135bea122ad812aec11de8494333d009b76bbb812b23a5bf',
            kms: 'local',
            type: 'Secp256k1',
            publicKeyHex:
              '0416da5f662ec7a04b6ea218781ea6e35de620f223cc0aefd3132b54346de447f678b77c4907ec60ee135bea122ad812aec11de8494333d009b76bbb812b23a5bf',
            meta: {
              algorithms: [
                'ES256K',
                'ES256K-R',
                'eth_signTransaction',
                'eth_signTypedData',
                'eth_signMessage',
              ],
            },
          },
        ],
        services: [],
      },
    ];

    return Promise.resolve(identifiers);
  }

  getIdentifier(): Promise<IIdentifier> {
    const identifier: IIdentifier = {
      did: 'did:ethr:rinkeby:0x0287eb9ac230a4d3083a1868a7ca1bee04a5aa1c48d25e9ca7a55341e3aa841e00',
      provider: 'did:ethr:rinkeby',
      alias: 'school did',
      controllerKeyId:
        '0487eb9ac230a4d3083a1868a7ca1bee04a5aa1c48d25e9ca7a55341e3aa841e000ad3420bb5d9806ff3a66bf4856af2d120492fd40b52f63c69354596ac143c2e',
      keys: [
        {
          kid: '0487eb9ac230a4d3083a1868a7ca1bee04a5aa1c48d25e9ca7a55341e3aa841e000ad3420bb5d9806ff3a66bf4856af2d120492fd40b52f63c69354596ac143c2e',
          kms: 'local',
          type: 'Secp256k1',
          publicKeyHex:
            '0487eb9ac230a4d3083a1868a7ca1bee04a5aa1c48d25e9ca7a55341e3aa841e000ad3420bb5d9806ff3a66bf4856af2d120492fd40b52f63c69354596ac143c2e',
          meta: {
            algorithms: [
              'ES256K',
              'ES256K-R',
              'eth_signTransaction',
              'eth_signTypedData',
              'eth_signMessage',
            ],
          },
        },
      ],
      services: [],
    };

    return Promise.resolve(identifier);
  }

  getKeys(): Promise<IKey[]> {
    const keys: IKey[] = [
      {
        kid: '0487eb9ac230a4d3083a1868a7ca1bee04a5aa1c48d25e9ca7a55341e3aa841e000ad3420bb5d9806ff3a66bf4856af2d120492fd40b52f63c69354596ac143c2e',
        kms: 'local',
        type: 'Secp256k1',
        publicKeyHex:
          '0487eb9ac230a4d3083a1868a7ca1bee04a5aa1c48d25e9ca7a55341e3aa841e000ad3420bb5d9806ff3a66bf4856af2d120492fd40b52f63c69354596ac143c2e',
        meta: {
          algorithms: [
            'ES256K',
            'ES256K-R',
            'eth_signTransaction',
            'eth_signTypedData',
            'eth_signMessage',
          ],
        },
      },
    ]

    return Promise.resolve(keys);
  }

  
}

export const identifierApi = new IdentifierApi();
