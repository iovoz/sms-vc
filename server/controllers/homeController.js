"use strict";

const router = require("express").Router();
import React from "react";
import ReactDOMServer from "react-dom/server";
import IntlWrapper from "../../IntlWrapper";
import store from "../../client/js/redux/store";
import SMSVC from "../../client/js/containers/SMSVC";
const accountSid = "AC4ef68249191e814286b355a3673c2fd0";
const authToken = "6e3b4d49d1aa18e5376abfce2b725741";
const client = require("twilio")(accountSid, authToken);

router.post("/sendcode", async (req, res) => {
  client.messages
    .create({
      from: "+15736147042",
      to: "+8613798293187",
      //body: "OTP 999888"
      //body: "your OTP is: 999888. For: https://sms-receiver-demo.glitch.me/?otp=544543&EvsSSj4C6vl"
      body: "Test message, verification code is 790583. It will expire in 100 seconds."
    })
    .then(() => {
      res.send(JSON.stringify({ success: true }));
    })
    .catch(err => {
      console.log(err);
      res.send(JSON.stringify({ success: false }));
    });
});

router.get("/", async (req, res) => {
  const lang = req.locale;
  const translations = req.localeData[lang];

  const appHtml = ReactDOMServer.renderToString(
    <IntlWrapper store={store} locale={lang} messages={translations}>
      <SMSVC />
    </IntlWrapper>
  );

  const preloadedState = store.getState();
  res.render("index", {
    appHtml,
    preloadedState: JSON.stringify(preloadedState),
    appData: JSON.stringify({
      lang,
      translations
    })
  });
});

module.exports = router;
