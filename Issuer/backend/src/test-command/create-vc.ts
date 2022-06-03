import { IIdentifier } from '@veramo/core';
import { agent } from '../agent/setup'

async function main() {
  const issuer: IIdentifier = await agent.didManagerGetByAlias({
    alias: 'DSA'
  });

  const credential = await agent.createVerifiableCredential({
    credential: {
      issuer: issuer.did,
      credentialSubject: {
        course: 'DSA certificate',
        pass: true
      }
    },
    proofFormat: 'jwt'
  })

  console.log(credential);
}

main().catch(console.log)