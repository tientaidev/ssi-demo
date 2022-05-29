import express from "express";
import { agent } from "../veramo/setup";

const router = express.Router();

router.get("/", async (_, res, __) => {
  const credentials = await agent.dataStoreORMGetVerifiableCredentials();
  res.send(credentials);
});

router.get("/sdr", async (_, res) => {
  const credentials = await agent.getVerifiableCredentialsForSdr({
    sdr: {
      claims: [
        {
          claimType: "you",
          claimValue: "Rock",
        },
        {
          claimType: "you",
          claimValue: "Entrance"
        }
      ],
    },
  });

  res.send(credentials);
});

router.post("/", async (req, res, next) => {
  try {
    const identifier = await agent.createVerifiableCredential(req.body);
    res.send({ identifier });
  } catch (err) {
    next(err);
  }
});

export default router;
