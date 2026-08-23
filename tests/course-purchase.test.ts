import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const readSource = (path: string) =>
  readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("course purchase uses the unified buy_product endpoint with course data", async () => {
  const dialog = await readSource("components/CourseDetails/PaymentDialog.vue");

  assert.match(dialog, /url: ApiNames\.Instance\.buy_product/u);
  assert.match(dialog, /course_id: props\.courseId/u);
  assert.match(dialog, /subscription_type: 1/u);
  assert.match(dialog, /payment_method_id: selectedMethod\.value\.id/u);
  assert.match(dialog, /transferred_account: transferredAccount\.value\.trim\(\)/u);
  assert.match(dialog, /receipt: receiptFile\.value/u);
  assert.match(dialog, /NetworkService\.instance\.postFormData/u);
  assert.doesNotMatch(dialog, /CoursesPaymentController|CoursesPaymentParams/u);
});

test("course purchase follows the book dialog result UX and receives an explicit course id", async () => {
  const [dialog, card] = await Promise.all([
    readSource("components/CourseDetails/PaymentDialog.vue"),
    readSource("components/CourseDetails/CourseCard.vue"),
  ]);

  assert.match(dialog, /courseId: number/u);
  assert.match(dialog, /DialogSelector\.instance\.successDialog/u);
  assert.match(dialog, /DialogSelector\.instance\.errorDialog/u);
  assert.match(dialog, /تم إرسال طلب شراء الكورس بنجاح/u);
  assert.match(dialog, /لم يتم إرسال طلب شراء الكورس/u);
  assert.match(card, /:course-id="Number\(CardDetails\?\.id\)"/u);
});

test("course join requests use buy_product like books instead of join_course", async () => {
  const card = await readSource("components/CourseDetails/CourseCard.vue");

  assert.match(card, /url: ApiNames\.Instance\.buy_product/u);
  assert.match(card, /course_id: courseId/u);
  assert.match(card, /subscription_type: 5/u);
  assert.match(card, /NetworkService\.instance\.post/u);
  assert.doesNotMatch(card, /CoursesPaymentController|CoursesPaymentParams|join_course/u);
});

test("course action state is normalized so API string values do not hide its buttons", async () => {
  const [dialog, card, model] = await Promise.all([
    readSource("components/CourseDetails/PaymentDialog.vue"),
    readSource("components/CourseDetails/CourseCard.vue"),
    readSource("features/FetchCourseDetails/Data/models/course_details_model.ts"),
  ]);

  assert.match(dialog, /const status = ref\(normalizeStatus\(props\.status\)\)/u);
  assert.match(card, /const Status = ref\(normalizeStatus\(props\.status\)\)/u);
  assert.match(model, /Number\.isFinite\(Number\(map\["allow_status"\]\)\)/u);
  assert.match(model, /toBoolean\(map\["is_subscribed"\]\)/u);
  assert.match(card, /CardDetails\?\.CoursePrice && !CardDetails\?\.is_subscribed/u);
});

test("purchased courses show a clear green ownership state instead of purchase actions", async () => {
  const [card, styles, arabic, english] = await Promise.all([
    readSource("components/CourseDetails/CourseCard.vue"),
    readSource("assets/style/course-details-redesign/course-card.scss"),
    readSource("i18n/locales/ar.json"),
    readSource("i18n/locales/en.json"),
  ]);

  assert.match(card, /v-else-if="CardDetails\?\.is_subscribed"/u);
  assert.match(card, /class="course-owned-status"/u);
  assert.match(card, /course_already_owned/u);
  assert.match(styles, /\.course-owned-status \{[\s\S]*?#16a34a/u);
  assert.match(arabic, /أنت مشترك في هذا الكورس بالفعل/u);
  assert.match(english, /You already own this course/u);
});
