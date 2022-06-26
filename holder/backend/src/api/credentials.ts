import { VerifiableCredential, UniqueVerifiableCredential } from "@veramo/core";
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

    res.send(credential);
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
