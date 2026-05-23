"use strict";

const fs = require("fs");
const path = require("path");
const { questionBankDataset } = require("../dist-question-bank/question-bank.cjs");

const outputDir = path.join(__dirname, "..", "generated");
const outputFile = path.join(outputDir, "question-bank.json");

fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(outputFile, JSON.stringify(questionBankDataset, null, 2));

console.log(`Built question bank artifact at ${outputFile}`);
