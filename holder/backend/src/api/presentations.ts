import { ICreateVerifiablePresentationArgs } from "@veramo/credential-w3c";
import express from "express";
import { agent } from "../agent/setup";

const router = express.Router();

router.get("/", async (_, res, __) => {
  const credentials = await agent.dataStoreORMGetVerifiablePresentations();
  res.send(credentials);
});

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
