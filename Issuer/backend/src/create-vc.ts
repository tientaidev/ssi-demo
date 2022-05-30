import { IIdentifier } from '@veramo/core';
import { agent } from './veramo/setup'

async function main() {
  const issuer: IIdentifier = await agent.didManagerGetByAlias({
    alias: 'DSA'
  });

  await agent.createVerifiableCredential({
    credential: {
      issuer: issuer.did,
      credentialSubject: {
        name: 'Class Certificate',
      }
    },
    proofFormat: 'jwt',
    save: true
  })
}

main().catch(console.log)