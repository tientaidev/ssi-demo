import type { DIDResolutionResult, IIdentifier, IKey } from '@veramo/core';
import { VerificationMethod } from 'did-resolver';
import express from 'express';
import { EthrDID } from 'ethr-did'
import { agent } from '../agent/setup';

const router = express.Router();

router.get('/', async (_, res) => {
  const identifiers = await agent.didManagerFind();
  res.send(identifiers)
})

router.get('/:did', async (req, res) => {
  const identifier: IIdentifier = await agent.didManagerGet({
    did: req.params.did
  });

  const internalKeys = identifier.keys.map(key => key.kid);
  console.log(internalKeys);

  const resolutionResult: DIDResolutionResult = await agent.resolveDid({
    didUrl: req.params.did
  });

  const verificationMethods = resolutionResult.didDocument?.verificationMethod as VerificationMethod[];
  const filteredVerificationMethods = verificationMethods.slice(2);
  const pubKeyList = filteredVerificationMethods.map((method) => method.publicKeyHex) as string[];
  pubKeyList.forEach(pubKey => {
    if (!internalKeys.includes(pubKey)) {
      identifier.keys.push({
        kid: pubKey,
        kms: 'external',
        publicKeyHex: pubKey,
        type: 'Secp256k1'
      })
    }
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