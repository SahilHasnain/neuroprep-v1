"use strict";

const fs = require("fs");
const path = require("path");

const sourcePath = path.join(__dirname, "..", "data", "question-bank.ts");
const outputDir = path.join(__dirname, "..", "dist-question-bank");
const outputPath = path.join(outputDir, "question-bank.cjs");

const source = fs.readFileSync(sourcePath, "utf8");

const transformed = source
  .replace(/import type[\s\S]*?from\s+"@\/types\/question-bank";\r?\n\r?\n/, "")
  .replace(
    /export const questionBankDataset:\s*QuestionBankDataset\s*=/,
    "const questionBankDataset =",
  )
  .concat("\nmodule.exports = { questionBankDataset }; \n");

fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(outputPath, transformed);

console.log(`Exported question bank module to ${outputPath}`);
