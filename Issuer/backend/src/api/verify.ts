import express from "express";
import { agent } from "../veramo/setup";

const router = express.Router();

router.post("/presentation", async (req, res, next) => {
  try {
    const message: any = await agent.handleMessage({
      raw: req.body.jwt
    });
  
    res.json({
      school: message.data.vc.credentialSubject.school,
      age: message.data.vc.credentialSubject.age,
      major: message.data.vc.credentialSubject.major
    })
  } catch(err) {
    next(err)
  }
})

router.post("/presentation_against_sdr", async (req, res, next) => {
  try {
    const validated = await agent.validatePresentationAgainstSdr({
      presentation: req.body,
      sdr: {
        issuer: 'did:ethr:rinkeby:0x0287eb9ac230a4d3083a1868a7ca1bee04a5aa1c48d25e9ca7a55341e3aa841e00',
        claims: [
          {
            claimType: 'you',
            claimValue: 'Typhoon'
          },
        ],
      },
    })
    
    res.send(validated)
  } catch (err) {
    next(err);
  }
});

export default router;
