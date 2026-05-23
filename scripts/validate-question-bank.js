"use strict";

const { questionBankDataset } = require("../dist-question-bank/question-bank.cjs");

const allowedRelationshipTypes = new Set(["retry", "step-up", "step-down", "similar", "repair"]);
const allowedDifficulties = new Set(["Easy", "Medium", "Hard"]);

function validate() {
  const issues = [];
  const conceptIds = new Set(questionBankDataset.concepts.map((concept) => concept.id));
  const questionIds = new Set();

  for (const concept of questionBankDataset.concepts) {
    if (conceptIds.size === 0) {
      issues.push("No concept nodes found.");
    }
    if (!concept.id || !concept.chapter || !concept.microTopic) {
      issues.push(`Concept ${concept.id || "<missing>"} is missing required fields.`);
    }
  }

  for (const question of questionBankDataset.questions) {
    if (questionIds.has(question.id)) {
      issues.push(`Duplicate question id: ${question.id}`);
    }
    questionIds.add(question.id);

    if (!allowedDifficulties.has(question.difficulty)) {
      issues.push(`Question ${question.id} has invalid difficulty ${question.difficulty}.`);
    }
    if (!conceptIds.has(question.primaryConceptId)) {
      issues.push(`Question ${question.id} references missing primary concept ${question.primaryConceptId}.`);
    }
    for (const conceptId of question.microTopicIds) {
      if (!conceptIds.has(conceptId)) {
        issues.push(`Question ${question.id} references missing concept ${conceptId}.`);
      }
    }
    if (question.correctOption < 0 || question.correctOption >= question.options.length) {
      issues.push(`Question ${question.id} has invalid correctOption index.`);
    }
    for (const relationship of question.relationships) {
      if (!allowedRelationshipTypes.has(relationship.type)) {
        issues.push(`Question ${question.id} has invalid relationship type ${relationship.type}.`);
      }
    }
  }

  for (const question of questionBankDataset.questions) {
    for (const relationship of question.relationships) {
      if (!questionIds.has(relationship.targetQuestionId)) {
        issues.push(
          `Question ${question.id} points to missing related question ${relationship.targetQuestionId}.`,
        );
      }
    }
  }

  if (issues.length > 0) {
    console.error("Question bank validation failed:");
    for (const issue of issues) {
      console.error(`- ${issue}`);
    }
    process.exit(1);
  }

  console.log(
    `Question bank valid: ${questionBankDataset.concepts.length} concepts, ${questionBankDataset.questions.length} questions.`,
  );
}

validate();
