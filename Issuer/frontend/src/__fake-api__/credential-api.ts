import { subDays, subHours } from 'date-fns';
import type { VerifiableCredential } from '@veramo/core';

const now = new Date();

class CredentialApi {
  getOrders(): Promise<VerifiableCredential[]> {
    const credentials: VerifiableCredential[] = [
      {
        hash: 'hash1',
        credentialSubject: {
          name: 'Joe',
          major: 'Computer Science',
          id: 'did:ethr:did:ethr:rinkeby:0x0372b988bb18d4f721ffacc6054c266b830094baa780c0826c9e2119c839581e36',
        },
        issuer: {
          id: 'did:ethr:rinkeby:0x032f25237289621e83a2c8a5955e1ba82d7ed20c6871fc84be32f01af08c17554b',
        },
        type: ['VerifiableCredential'],
        '@context': ['https://www.w3.org/2018/credentials/v1'],
        issuanceDate: '2022-05-25T14:24:05.000Z',
        proof: {
          type: 'JwtProof2020',
          jwt: 'eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSJdLCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIl0sImNyZWRlbnRpYWxTdWJqZWN0Ijp7Im5hbWUiOiJKb2UiLCJtYWpvciI6IkNvbXB1dGVyIFNjaWVuY2UifX0sInN1YiI6ImRpZDpldGhyOmRpZDpldGhyOnJpbmtlYnk6MHgwMzcyYjk4OGJiMThkNGY3MjFmZmFjYzYwNTRjMjY2YjgzMDA5NGJhYTc4MGMwODI2YzllMjExOWM4Mzk1ODFlMzYiLCJuYmYiOjE2NTM0ODg2NDUsImlzcyI6ImRpZDpldGhyOnJpbmtlYnk6MHgwMzJmMjUyMzcyODk2MjFlODNhMmM4YTU5NTVlMWJhODJkN2VkMjBjNjg3MWZjODRiZTMyZjAxYWYwOGMxNzU1NGIifQ.TbaN_QwwSKNKqLwvU8VDqVA7p1tLY-vcY_jgeTp18PV5GsF0AlTRWFj1u_lf-9a6GGuR5C2GCGHXIdawRayLTQ',
        },
      },
    ];

    return Promise.resolve(credentials);
  }

  getOrder(): Promise<VerifiableCredential> {
    const credential: VerifiableCredential = {
      credentialSubject: {
        name: 'Joe',
        major: 'Computer Science',
        id: 'did:ethr:did:ethr:rinkeby:0x0372b988bb18d4f721ffacc6054c266b830094baa780c0826c9e2119c839581e36',
      },
      issuer: {
        id: 'did:ethr:rinkeby:0x032f25237289621e83a2c8a5955e1ba82d7ed20c6871fc84be32f01af08c17554b',
      },
      type: ['VerifiableCredential'],
      '@context': ['https://www.w3.org/2018/credentials/v1'],
      issuanceDate: '2022-05-25T14:24:05.000Z',
      proof: {
        type: 'JwtProof2020',
        jwt: 'eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSJdLCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIl0sImNyZWRlbnRpYWxTdWJqZWN0Ijp7Im5hbWUiOiJKb2UiLCJtYWpvciI6IkNvbXB1dGVyIFNjaWVuY2UifX0sInN1YiI6ImRpZDpldGhyOmRpZDpldGhyOnJpbmtlYnk6MHgwMzcyYjk4OGJiMThkNGY3MjFmZmFjYzYwNTRjMjY2YjgzMDA5NGJhYTc4MGMwODI2YzllMjExOWM4Mzk1ODFlMzYiLCJuYmYiOjE2NTM0ODg2NDUsImlzcyI6ImRpZDpldGhyOnJpbmtlYnk6MHgwMzJmMjUyMzcyODk2MjFlODNhMmM4YTU5NTVlMWJhODJkN2VkMjBjNjg3MWZjODRiZTMyZjAxYWYwOGMxNzU1NGIifQ.TbaN_QwwSKNKqLwvU8VDqVA7p1tLY-vcY_jgeTp18PV5GsF0AlTRWFj1u_lf-9a6GGuR5C2GCGHXIdawRayLTQ',
      },
    };

    return Promise.resolve(credential);
  }
}

export const credentialApi = new CredentialApi();
