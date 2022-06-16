import { IDataStoreGetVerifiablePresentationArgs } from "@veramo/core";
import { ICreateVerifiablePresentationArgs } from "@veramo/credential-w3c";
import express from "express";
import { agent } from "../agent/setup";
import { VeramoDatabase } from "../db/db";

const db = new VeramoDatabase();
const router = express.Router();

router.get("/", async (_, res, __) => {
  const credentials = await agent.dataStoreORMGetVerifiablePresentations();
  res.send(credentials);
});

router.get("/:hash", async (req, res, next) => {
  try {
    const body: IDataStoreGetVerifiablePresentationArgs = req.body;
    const presentation = await agent.dataStoreGetVerifiablePresentation(body);
    res.send(presentation)
  } catch(err) {
    next(err);
  }
})

router.delete("/:hash", async (req, res, next) => {
  try {
    const result = await db.deletePresentation(req.params.hash);
    res.send({ result });
  } catch (err) {
    next(err);
  }
})

router.post("/", async (req, res, next) => {
  try {
    const body: ICreateVerifiablePresentationArgs = req.body;

    const presentation = await agent.createVerifiablePresentation(body);
    res.send({ presentation });
  } catch (err) {
    next(err);
  }
});

export default router;
