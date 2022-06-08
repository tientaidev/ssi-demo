import { program } from "commander";
import { VeramoDatabase } from './db';
import { agent } from "./agent";
import { Table } from 'console-table-printer';
import { ManagedKeyInfo } from "@veramo/core";
import inquirer from 'inquirer';

const db = new VeramoDatabase();

const key = program.command("key").description("Keys");

key
  .command('list', { isDefault: true })
  .description('list managed keys')
  .action(async () => {
    const p = new Table();
    const keys: ManagedKeyInfo[] = await db.getKeys();

    if (keys.length === 0) {
      console.log("There are no keys");
      return;
    }

    keys.forEach(key => {
      p.addRow({kid: key.kid, kms: key.kms})
    })
    p.printTable();
  })

key
.command('create')
.description('create a key')
.action(async () => {
  const key: ManagedKeyInfo = await agent.keyManagerCreate({
    type: 'Secp256k1',
    kms: 'local'
  });
  console.log(key);
})

key
.command('delete')
.description('delete a key')
.action(async () => {
  const keys: ManagedKeyInfo[] = await db.getKeys();
  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'key',
      choices: keys.map((key) => key.kid),
      message: 'Select key',
    }])

  const result = await agent.keyManagerDelete({
    kid: answers.key
  });

  console.log(result);
})

key
.command('sign')
.description('sign JWT')
.action(async () => {
  const keys: ManagedKeyInfo[] = await db.getKeys();
  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'key',
      choices: keys.map((key) => key.kid),
      message: 'Select key',
    },
    {
      type: 'text',
      name: 'data',
      message: 'data',
    },
  ])

  const signature: string = await agent.keyManagerSignJWT({
    kid: answers.key,
    data: answers.data
  })

  const result = [answers.data, signature].join('.');
  console.log("=========== RESULT ==============")
  console.log(result);
})
