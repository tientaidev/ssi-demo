import { createAgent, IResolver } from "@veramo/core";
import { DIDResolverPlugin } from "@veramo/did-resolver";
import { Resolver } from "did-resolver";
import { getResolver as ethrDidResolver } from "ethr-did-resolver";
import { CredentialIssuer, ICredentialIssuer } from "@veramo/credential-w3c";

// You will need to get a project ID from infura https://www.infura.io
const INFURA_PROJECT_ID = 'f8cacc18b6d34b19811efe74ac9a64da';

export const agent = createAgent<IResolver & ICredentialIssuer>({
  plugins: [
    new DIDResolverPlugin({
      resolver: new Resolver({
        ...ethrDidResolver({ infuraProjectId: INFURA_PROJECT_ID }),
      }),
    }),
    new CredentialIssuer()
  ],
});
