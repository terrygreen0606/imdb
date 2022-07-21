"use strict";
const app = require("./app");
const serverlessHttp = require("serverless-http");

module.exports.hello = serverlessHttp(app);
