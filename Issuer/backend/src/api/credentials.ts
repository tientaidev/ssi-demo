import type {
  IIdentifier,
  VerifiableCredential,
  UniqueVerifiableCredential,
} from "@veramo/core";
import type { ICreateVerifiableCredentialArgs } from "@veramo/credential-w3c";
import type { JWTHeader, JWTPayload } from "did-jwt";
import { CredentialPayload, JwtCredentialPayload, normalizeCredential } from "did-jwt-vc";
import { agent } from "../agent/setup";
import { VeramoDatabase } from "../db/db";
import { encodeBase64url } from "../util";
import {
  transformCredentialInput,
  validateJwtCredentialPayload,
} from "did-jwt-vc";
import express from "express";

const router = express.Router();
const db = new VeramoDatabase();

router.get("/", async (_, res, next) => {
  try {
    const credentials: UniqueVerifiableCredential[] =
      await agent.dataStoreORMGetVerifiableCredentials();
    const identifiers: IIdentifier[] = await agent.didManagerFind();

    let mappings = new Map<string, string>();
    identifiers.forEach((identifier) =>
      mappings.set(identifier.did, identifier.alias as string)
    );

    credentials.map((credential) => {
      let issuer = credential.verifiableCredential.issuer;
      if (typeof issuer == 'object') {
        issuer.alias = mappings.get(issuer.id);
      }
      return credential;
    });

    res.send(credentials);
  } catch (err) {
    next(err);
  }
});

router.get("/:hash", async (req, res, next) => {
  try {
    const credential: VerifiableCredential =
      await agent.dataStoreGetVerifiableCredential({
        hash: req.params.hash,
      });

    // credential.issuer.alias = await agent
    //   .didManagerGet({
    //     did: credential.issuer.id,
    //   })
    //   .then((did) => did.alias);

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

router.post("/generate-signing-input", async (req, res, next) => {
  const args: ICreateVerifiableCredentialArgs = req.body;
  const credential: Partial<CredentialPayload> = {
    ...args?.credential,
    "@context": args?.credential?.["@context"] || [
      "https://www.w3.org/2018/credentials/v1",
    ],
    type: args?.credential?.type || ["VerifiableCredential"],
    issuanceDate: args?.credential?.issuanceDate || new Date().toISOString(),
  };

  const issuer =
    typeof credential.issuer === "string"
      ? credential.issuer
      : credential?.issuer?.id;
  if (!issuer || typeof issuer === "undefined") {
    next("invalid_argument: args.credential.issuer must not be empty");
  }

  const parsedPayload: JwtCredentialPayload = {
    iat: undefined,
    ...transformCredentialInput(credential, true),
  };
  validateJwtCredentialPayload(parsedPayload);

  const header: Partial<JWTHeader> = {
    typ: "JWT",
    alg: "ES256K",
  };

  const timestamps: Partial<JWTPayload> = {
    iat: Math.floor(Date.now() / 1000),
    exp: undefined,
  };

  const fullPayload = { ...timestamps, ...parsedPayload, iss: issuer };
  const encodedPayload =
    typeof fullPayload === "string"
      ? fullPayload
      : encodeBase64url(JSON.stringify(fullPayload));
  const signingInput: string = [
    encodeBase64url(JSON.stringify(header)),
    encodedPayload,
  ].join(".");

  res.send(signingInput);
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
