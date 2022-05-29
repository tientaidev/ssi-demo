import express from "express";
import { agent } from "../veramo/setup";

const router = express.Router();

router.get("/", async (_, res, __) => {
  const credentials = await agent.dataStoreORMGetVerifiablePresentations();
  res.send(credentials);
});

router.post("/", async (req, res, next) => {
  try {
    const presentation = await agent.createVerifiablePresentation({
      presentation: {
        holder: "did:ethr:rinkeby:0x036ce37e22bd558214365dfda0b2860998c1febbe0db63eb2fe845be11286b146c",
        verifiableCredential: req.body
      },
      proofFormat: 'jwt',
      save: true
    });
    res.send({ presentation });
  } catch (err) {
    next(err);
  }
});

export default router;
