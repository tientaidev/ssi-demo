import { IIdentifier, VerifiableCredential } from "@veramo/core";
import { UniqueVerifiableCredential } from "@veramo/data-store";
import express from "express";
import { agent } from "../veramo/setup";

const router = express.Router();

router.get("/", async (_, res, next) => {
  try {
    const credentials: UniqueVerifiableCredential[] =
      await agent.dataStoreORMGetVerifiableCredentials();
    const identifiers: IIdentifier[] = await agent.didManagerFind();

    let mappings = new Map<string, string>();
    identifiers.forEach((identifier) =>
      mappings.set(identifier.did, identifier.alias || "")
    );

    const result: UniqueVerifiableCredential[] = credentials.map(
      (credential) => {
        let issuer = credential.verifiableCredential.issuer;
        issuer.alias = mappings.get(
          issuer.id
        );
        return credential;
      }
    );

    res.send(result);
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
          claimValue: "Entrance",
        },
      ],
    },
  });

  res.send(credentials);
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

export default router;
