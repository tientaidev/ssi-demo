import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import dids from "./api/dids";
import credentials from "./api/credentials";
import presentations from "./api/presentations";
import disclosureRequests from "./api/selective-disclosure-request";
import verify from "./api/verify";

const handleError = (err: any, _: any, res: any, __: any) => {
  res.status(400).json({ error: err.message || err.toString() });
};

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.use("/dids", dids, handleError);
app.use("/credentials", credentials, handleError);
app.use("/presentations", presentations, handleError);
app.use("/disclosure_requests", disclosureRequests, handleError);
app.use("/verify", verify, handleError);

app.listen(5001, () => console.log("App listen at port 5000"));
