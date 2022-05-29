import express from 'express';
import { agent } from '../veramo/setup';

const router = express.Router();

router.get('/messages', async (req, res) => {
  const disclosureRequests = await agent.dataStoreORMGetMessages({
    "where": [
      {
        "column": "type",
        "value": [
          "sdr"
        ]
      }
    ]
  });

  res.send(disclosureRequests);
})

router.post('/', async (_, res, next) => {
  try {
    let jwt = await agent.createSelectiveDisclosureRequest({
      data: {
        issuer: 'did:ethr:rinkeby:0x0287eb9ac230a4d3083a1868a7ca1bee04a5aa1c48d25e9ca7a55341e3aa841e00',
        tag: 'sdr-one',
        claims: [
          {
            reason: 'We need it',
            claimType: 'name',
            essential: true,
          },
        ],
      },
    });

    const message = await agent.handleMessage({
      raw: jwt,
      save: true
    })

    res.send(message)
  } catch(err) {
    next(err)
  }
})

export default router;