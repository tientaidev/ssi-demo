import dotenv from "dotenv";
dotenv.config();

// Core interfaces
import {
  createAgent,
  IDIDManager,
  IResolver,
  IDataStore,
  IKeyManager,
  IMessageHandler,
} from "@veramo/core";

// Core identity manager plugin
import { DIDManager } from "@veramo/did-manager";

// Ethr did identity provider
import { EthrDIDProvider } from "@veramo/did-provider-ethr";

// Web did identity provider
import { WebDIDProvider } from "@veramo/did-provider-web";

// Core key manager plugin
import { KeyManager } from "@veramo/key-manager";

// Custom key management system for RN
import { KeyManagementSystem, SecretBox } from "@veramo/kms-local";

// Custom resolvers
import { DIDResolverPlugin } from "@veramo/did-resolver";
import { Resolver } from "did-resolver";
import { getResolver as ethrDidResolver } from "ethr-did-resolver";

// Storage plugin using TypeOrm
import {
  Entities,
  KeyStore,
  DIDStore,
  DataStoreORM,
  IDataStoreORM,
  PrivateKeyStore,
  DataStore,
  migrations,
} from "@veramo/data-store";

// TypeORM is installed with `@veramo/data-store`
import { createConnection } from "typeorm";

// Aditional
import {
  CredentialIssuer,
  ICredentialIssuer,
  W3cMessageHandler,
} from "@veramo/credential-w3c";
import {
  ISelectiveDisclosure,
  SdrMessageHandler,
  SelectiveDisclosure,
} from "@veramo/selective-disclosure";
import {
  DIDCommMessageHandler,
  IDIDComm,
} from "@veramo/did-comm";
import { MessageHandler } from "@veramo/message-handler";
import { JwtMessageHandler } from "@veramo/did-jwt";

// This will be the name for the local sqlite database for demo purposes
const DATABASE_FILE = "database.sqlite";

// You will need to get a project ID from infura https://www.infura.io
const INFURA_PROJECT_ID = process.env.INFURA_PROJECT_ID;

// This will be the secret key for the KMS
const KMS_SECRET_KEY = process.env.KMS_SECRET_KEY;

const dbConnection = createConnection({
  type: "sqlite",
  database: DATABASE_FILE,
  synchronize: false,
  migrations,
  migrationsRun: true,
  logging: ["error", "info", "warn"],
  entities: Entities,
});

export const agent = createAgent<
  IDIDManager &
  IKeyManager &
  IDataStore &
  IDataStoreORM &
  IResolver &
  ICredentialIssuer &
  ISelectiveDisclosure &
  IDIDComm &
  IMessageHandler
>({
  plugins: [
    new KeyManager({
      store: new KeyStore(dbConnection),
      kms: {
        local: new KeyManagementSystem(
          new PrivateKeyStore(dbConnection, new SecretBox(KMS_SECRET_KEY as string))
        ),
      },
    }),
    new DIDManager({
      store: new DIDStore(dbConnection),
      defaultProvider: "did:ethr:rinkeby",
      providers: {
        "did:ethr:rinkeby": new EthrDIDProvider({
          defaultKms: "local",
          network: "rinkeby",
          rpcUrl: "https://rinkeby.infura.io/v3/" + INFURA_PROJECT_ID,
        }),
        "did:web": new WebDIDProvider({
          defaultKms: "local",
        }),
      },
    }),
    new DIDResolverPlugin({
      resolver: new Resolver({
        ...ethrDidResolver({ infuraProjectId: INFURA_PROJECT_ID }),
      }),
    }),
    new MessageHandler({
      messageHandlers: [
        new DIDCommMessageHandler(),
        new JwtMessageHandler(),
        new W3cMessageHandler(),
        new SdrMessageHandler(),
      ],
    }),
    new CredentialIssuer(),
    new SelectiveDisclosure(),
    new DataStore(dbConnection),
    new DataStoreORM(dbConnection),
  ],
});
