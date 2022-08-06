import type {
  DIDResolutionResult,
  IDIDManagerCreateArgs,
  IIdentifier,
  IKey,
} from "@veramo/core";
import { VerificationMethod } from "did-resolver";
import { agent } from "../agent/setup";
import express from "express";

const router = express.Router();

router.get("/", async (_, res, next) => {
  try {
    const identifiers = await agent.didManagerFind();
    res.send(identifiers);
  } catch (err) {
    next(err);
  }
});

router.get("/:did", async (req, res, next) => {
  try {
    const identifier: IIdentifier = await agent.didManagerGet({ did: req.params.did });
    const internalKids = new Set(identifier.keys.map((key) => key.kid));
    
    const resolutionResult: DIDResolutionResult = await agent.resolveDid({ didUrl: req.params.did });
    const verificationMethods = resolutionResult.didDocument?.verificationMethod as VerificationMethod[];
    const filteredVerificationMethods = verificationMethods.filter(method => {
      const regex = /^delegate-\d+$/;
      return method.id.split("#").pop()?.match(regex) 
    });
    const pubKeyList = filteredVerificationMethods.map(
      (method) => method.publicKeyHex
    ) as string[];

    pubKeyList.forEach((pubKey) => {
      if (!internalKids.has(pubKey)) {
        identifier.keys.push({
          kid: pubKey,
          kms: "external",
          publicKeyHex: pubKey,
          type: "Secp256k1",
        });
      }
    });

    res.send(identifier);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const body: IDIDManagerCreateArgs = req.body;
    const identifier = await agent.didManagerCreate(body);
    res.send({ identifier });
  } catch (err) {
    next(err);
  }
});

router.post("/add-key", async (req, res, next) => {
  try {
    const key: IKey = {
      kms: 'local',
      publicKeyHex: req.body.publicKeyHex,
      kid: req.body.publicKeyHex,
      type: "Secp256k1",
    };

    const result = await agent.didManagerAddKey({
      did: req.body.did,
      key: key,
    });

    res.send({ result });
  } catch (err) {
    next(err);
  }
});

router.post("/remove-key", async (req, res, next) => {
  try {
    const result = await agent.didManagerRemoveKey({
      did: req.body.did,
      kid: req.body.kid,
    });

    res.send({ result });
  } catch (err) {
    next(err);
  }
});

router.delete("/:did", async (req, res, next) => {
  try {
    const result = await agent.didManagerDelete({
      did: req.params.did,
    });
    res.send({ result });
  } catch (err) {
    next(err);
  }
});

export default router;
