import { IIdentifier, VerifiableCredential } from "@veramo/core";
import { UniqueVerifiableCredential } from "@veramo/data-store";
import { agent } from "../agent/setup";
import { VeramoDatabase } from "../db/db";
import express from "express";
import { normalizeCredential } from "did-jwt-vc";

const router = express.Router();
const db = new VeramoDatabase();

router.get("/", async (_, res, next) => {
  try {
    const credentials: UniqueVerifiableCredential[] =
      await agent.dataStoreORMGetVerifiableCredentials();

    res.send(credentials);
  } catch (err) {
    next(err);
  }
});

router.get("/:hash", async (req, res, next) => {
  try {
    const credential: VerifiableCredential = await agent.dataStoreGetVerifiableCredential({
      hash: req.params.hash
    });

    credential.issuer.alias = await agent.didManagerGet({
      did: credential.issuer.id
    }).then(did => did.alias)

    res.send(credential);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const credential: VerifiableCredential =
      await agent.createVerifiableCredential({
        credential: {
          name: req.body.name,
          description: req.body.description,
          issuer: req.body.issuer,
          credentialSubject: {
            id: req.body.subjectDid,
            name: req.body.subjectName,
            course: req.body.course,
          },
        },
        save: true,
        proofFormat: "jwt",
      });
    res.send({ credential });
  } catch (err) {
    next(err);
  }
});

router.post("/import", async (req, res, next) => {
  try {
    const jwt: string = req.body.jwt;
    const credential = normalizeCredential(jwt);
    await agent.dataStoreSaveVerifiableCredential({
      verifiableCredential: credential
    })

    res.send("success");
  } catch (err) {
    next(err);
  }
});

router.delete("/:hash", async (req, res, next) => {
  try {
    const result = await db.deleteCredential(req.params.hash);
    res.send({ result });
  } catch (err) {
    next(err);
  }
});

export default router;
