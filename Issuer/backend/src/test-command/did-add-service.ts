import { agent } from './agent/setup'

async function main() {
  const identifier = await agent.didManagerGetByAlias({
    alias: 'C++'
  });

  await agent.didManagerAddService({
    did: identifier.did,
    service: {
      id: '1',
      type: 'DIDCommMessaging',
      serviceEndpoint: 'http://localhost:3000'
    }
  })
}

main().catch(console.log)