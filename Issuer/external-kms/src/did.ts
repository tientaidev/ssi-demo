import { program } from "commander";
import { printTable } from 'console-table-printer';
import { agent } from "./agent";

const did = program.command("did").description("Decentralized identifiers");

did
  .command('list', { isDefault: true })
  .description('list managed identifiers')
  .action(async () => {
    const list = await agent.didManagerFind()

    if (list.length > 0) {
      const dids = list.map((item) => ({ provider: item.provider, alias: item.alias, did: item.did }))
      printTable(dids)
    } else {
      console.log('No dids')
    }
  })