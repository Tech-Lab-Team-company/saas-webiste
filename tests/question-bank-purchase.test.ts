import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import QuestionBankOnlinePaymentParams from "../features/OnlinePayment/Core/Params/question_bank_online_payment_params.ts";
import QuestionBankContentModel from "../features/QuestionBank/Data/models/question_bank_content_model.ts";

const readSource = (path: string) =>
  readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("question bank payments send the question-bank product key", () => {
  const callbackUrl = "https://example.com/paymentverify/2";
  assert.deepEqual(
    new QuestionBankOnlinePaymentParams(122, 2, callbackUrl).toMap(),
    {
      question_bank_id: 122,
      subscription_type: 1,
      payment_method_id: 2,
      callback_url: callbackUrl,
      success_url: callbackUrl,
      back_url: callbackUrl,
      fail_url: callbackUrl,
      cancel_url: callbackUrl,
    },
  );
});

test("question bank content mapper supports grouped questions and progress", () => {
  const content = QuestionBankContentModel.fromMap({
    question_bank: {
      id: 122,
      title: "Physics practice",
      image: { img: "https://example.com/bank.jpg", alt: "Bank" },
    },
    correct_answers: 1,
    wrong_answers: 0,
    questions: [
      {
        title: "Unit one",
        questions: [
          {
            id: 8,
            question: "What is velocity?",
            answers: [
              { id: 1, answer: "Distance over time", is_correct: 1 },
              { id: 2, answer: "Mass over volume", is_correct: 0 },
            ],
          },
        ],
      },
    ],
  });

  assert.equal(content.id, 122);
  assert.equal(content.title, "Physics practice");
  assert.equal(content.totalQuestions, 1);
  assert.equal(content.questions[0]?.sectionTitle, "Unit one");
  assert.equal(content.questions[0]?.answers[0]?.isCorrect, true);
});

test("question bank catalog, content, payment, and purchases use one flow", async () => {
  const [apiNames, contentService, action, dialog, purchases] =
    await Promise.all([
      readSource("base/core/networkStructure/apiNames.ts"),
      readSource(
        "features/QuestionBank/Data/api_services/fetch_question_bank_questions_api_service.ts",
      ),
      readSource("components/QuestionBank/QuestionBankAction.vue"),
      readSource("components/CourseDetails/PaymentDialog.vue"),
      readSource("components/Profile/MyPurchasesLibrary.vue"),
    ]);

  assert.match(apiNames, /fetch_question_bank_questions/u);
  assert.match(contentService, /auth: true/u);
  assert.match(contentService, /fetchQuestionBankQuestions/u);
  assert.match(action, /PaymentProductType\.QUESTION_BANK/u);
  assert.match(action, /subscription_type: 5/u);
  assert.match(action, /question_bank_id: bankId/u);
  assert.match(action, /join_option_status\) === 1/u);
  assert.match(action, /status\.value = 1;\s*emit\("statusChanged", props\.bank\.id, 1\);/u);
  assert.match(action, /طلب الانضمام قيد المراجعة/u);
  assert.match(dialog, /question_bank_id: props\.questionBankId/u);
  assert.match(purchases, /item\.questionBankId/u);
  assert.match(purchases, /\/question-bank\//u);
});
