import type { IIdentifier, IKey } from '@veramo/core';
import express from 'express';
const router = express.Router();
import { agent } from '../agent/setup';

router.get('/', async (_, res) => {
  const identifiers = await agent.didManagerFind();
  res.send(identifiers)
})

router.get('/:did', async (req, res) => {
  const identifier: IIdentifier = await agent.didManagerGet({
    did: req.params.did
  })

  res.send(identifier)
})

router.post('/', async (req, res) => {
  const identifier = await agent.didManagerCreate({
    alias: req.body.alias
  });
  res.send({ identifier });
})

router.post('/add-key', async (req, res, next) => {
  try {
    const key: IKey = {
      kms: 'external',
      publicKeyHex: req.body.publicKeyHex,
      kid: req.body.publicKeyHex,
      type: 'Secp256k1'
    }
    
    const result = await agent.didManagerAddKey({
      did: req.body.did,
      key: key
    })

    res.send({result})
    
  } catch(err) {
    next(err);
  }
})

router.post('/remove-key', async (req, res, next) => {
  try {
    const result = await agent.didManagerRemoveKey({
      did: req.body.did,
      kid: req.body.kid
    })

    res.send({result})
    
  } catch(err) {
    next(err);
  }
})

router.delete('/:did', async (req, res, next) => {
  try {
    const result = await agent.didManagerDelete({
      did: req.params.did
    });
    res.send({ result })
  } catch(err) {
    next(err);
  }
})

export default router;