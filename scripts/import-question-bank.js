"use strict";

const fs = require("fs");
const path = require("path");

const importDir = path.join(__dirname, "..", "data", "imports");
const outputDir = path.join(__dirname, "..", "generated");
const outputFile = path.join(outputDir, "question-bank.imported.json");

function readCsv(filePath) {
  const input = fs.readFileSync(filePath, "utf8").trim();
  const rows = [];
  let row = [];
  let value = "";
  let inQuotes = false;

  for (let index = 0; index < input.length; index += 1) {
    const char = input[index];
    const nextChar = input[index + 1];

    if (char === '"' && inQuotes && nextChar === '"') {
      value += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === "," && !inQuotes) {
      row.push(value);
      value = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && nextChar === "\n") {
        index += 1;
      }
      row.push(value);
      rows.push(row);
      row = [];
      value = "";
      continue;
    }

    value += char;
  }

  if (value.length > 0 || row.length > 0) {
    row.push(value);
    rows.push(row);
  }

  const [header, ...records] = rows;
  return records.map((record) => {
    const entry = {};
    header.forEach((column, columnIndex) => {
      entry[column] = record[columnIndex] ?? "";
    });
    return entry;
  });
}

function splitPipe(value) {
  return value ? value.split("|").map((item) => item.trim()).filter(Boolean) : [];
}

function parseRelationships(value) {
  return splitPipe(value).map((entry) => {
    const [type, targetQuestionId] = entry.split(":");
    return { type, targetQuestionId };
  });
}

function importQuestionBank() {
  const conceptsCsv = readCsv(path.join(importDir, "concepts.csv"));
  const questionsCsv = readCsv(path.join(importDir, "questions.csv"));

  const concepts = conceptsCsv.map((row) => ({
    id: row.id,
    subject: row.subject,
    unit: row.unit,
    chapter: row.chapter,
    microTopic: row.microTopic,
    prerequisites: splitPipe(row.prerequisites),
    neetWeight: row.neetWeight,
    difficultyLevel: row.difficultyLevel,
    commonErrorPatterns: splitPipe(row.commonErrorPatterns),
  }));

  const errorTagMap = new Map();
  concepts.forEach((concept) => {
    concept.commonErrorPatterns.forEach((tag) => {
      if (!errorTagMap.has(tag)) {
        errorTagMap.set(tag, {
          id: tag.toLowerCase().replace(/\s+/g, "-"),
          label: tag,
          description: `${tag} imported from CSV pipeline.`,
        });
      }
    });
  });

  const questions = questionsCsv.map((row) => ({
    id: row.id,
    subject: row.subject,
    chapter: row.chapter,
    microTopicIds: splitPipe(row.microTopicIds),
    primaryConceptId: row.primaryConceptId,
    secondaryConceptIds: splitPipe(row.secondaryConceptIds),
    questionType: row.questionType,
    skillType: row.skillType,
    trapType: row.trapType,
    difficulty: row.difficulty,
    estimatedTimeSec: Number(row.estimatedTimeSec),
    sourceType: row.sourceType,
    sourceLabel: row.sourceLabel,
    prompt: row.prompt,
    options: splitPipe(row.options),
    correctOption: Number(row.correctOption),
    explanation: row.explanation,
    repairNote: row.repairNote,
    wrongReasonTag: row.wrongReasonTag,
    retryStatus: row.retryStatus,
    relationships: parseRelationships(row.relationships),
    status: row.status,
  }));

  const dataset = {
    concepts,
    errorTags: Array.from(errorTagMap.values()),
    questions,
  };

  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(outputFile, JSON.stringify(dataset, null, 2));

  console.log(`Imported CSV question bank to ${outputFile}`);
}

importQuestionBank();
