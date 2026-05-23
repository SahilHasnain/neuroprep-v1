# Neuroprep Content Workflow

This app uses a developer-first content pipeline.

## Source of Truth

- Keep concept and question content in [`data/question-bank.ts`](../data/question-bank.ts).
- Treat this file as the authored source until the schema stabilizes.
- Do not build an admin panel at this stage.
- If you prefer editing outside code, use the CSV files in [`data/imports/`](../data/imports/).

## Working Loop

1. Add or edit concept nodes in the dataset.
2. Add or edit authored questions with concept links, trap type, and repair metadata.
3. Optional: edit [`data/imports/concepts.csv`](../data/imports/concepts.csv) and [`data/imports/questions.csv`](../data/imports/questions.csv), then run `npm run question-bank:import`.
4. Run `npm run question-bank:validate`.
5. Run `npm run question-bank:build`.
6. Use the app and confirm practice flow behavior.

## Authoring Rules

- Every question must point to one `primaryConceptId`.
- `microTopicIds` must only reference existing concept nodes.
- Every question should have at least one relationship when practical, especially a `retry` or `repair`.
- The app should prefer a small, tightly tagged bank over a large random bank.
- If a question is generated with AI, keep `sourceType` as `AI-assisted draft` until you manually review it.
- CSV fields that contain arrays use `|` as the separator.
- CSV relationship values use `type:targetId|type:targetId`.

## Solo-Founder Guidance

- Keep the bank small at first: around 100 to 150 strong questions is enough for a meaningful wedge.
- Cover one concept cluster deeply before adding broad subject coverage.
- Use AI to draft questions, but keep yourself as schema owner and quality filter.
- Add spreadsheets later only when editing in code becomes slower than editing rows.
- The imported CSV output is written to [`generated/question-bank.imported.json`](../generated/question-bank.imported.json) for review before you manually promote changes into `data/question-bank.ts`.
