import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import FetchPurchasesParams from "../features/FetchPurchases/Core/Params/fetch_purchases_params.ts";
import PurchasesModel from "../features/FetchPurchases/Data/models/purchases_model.ts";

const readSource = (path: string) =>
  readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("purchased response maps every supported product type", () => {
  const purchases = PurchasesModel.fromMap({
    books: [
      {
        id: 12,
        title: "Organic Chemistry Basics",
        number_of_pages: "240",
        price: "45",
        currency: "SAR",
        allow_status: 1,
        isFree: false,
        invoice_link: "https://example.com/invoices/book.pdf",
      },
    ],
    question_banks: [
      {
        id: 7,
        title: "Grade 12 Question Bank",
        all_questions: 512,
        correct_answers: 210,
        wrong_answers: 40,
        rest_questions: 262,
        is_paid: 1,
      },
    ],
    courses: [
      {
        id: 30,
        course_id: 3,
        title: "Full Year Mathematics",
        text: "Course description",
        subject_full_title: "Grade 12 Mathematics",
        teacher_name: "Mr. Ahmed",
        number_of_videos: 48,
        number_of_pdfs: 12,
        percentage: 135,
        is_paid: true,
      },
    ],
    packages: [
      {
        id: 4,
        package_id: 4,
        title: "Full Year Bundle",
        price: "300",
        price_after_discount: "250",
        totalCourses: 3,
        totalQuestionBanks: 1,
        is_subscribed: "1",
        courses: [
          { course_id: 3, title: "Mathematics" },
          { id: 6, title: "Physics" },
        ],
        question_banks: [{ id: 7, title: "Practice Bank" }],
      },
    ],
  });

  assert.equal(purchases.totalItems, 4);
  assert.equal(purchases.books[0]?.pageCount, 240);
  assert.equal(purchases.books[0]?.invoiceLink, "https://example.com/invoices/book.pdf");
  assert.equal(purchases.questionBanks[0]?.remainingQuestions, 262);
  assert.equal(purchases.courses[0]?.courseId, 3);
  assert.equal(purchases.courses[0]?.description, "Course description");
  assert.equal(purchases.courses[0]?.progress, 100);
  assert.equal(purchases.packages[0]?.price, 250);
  assert.equal(purchases.packages[0]?.courses.length, 2);
  assert.equal(purchases.packages[0]?.questionBanks.length, 1);
});

test("purchased mapper tolerates partial data and unsafe links", () => {
  const purchases = PurchasesModel.fromMap({
    books: [
      {
        id: 1,
        title: "Safe book",
        image: "javascript:alert(1)",
        invoice_link: "not a url",
      },
      { id: 2 },
      null,
    ],
    courses: "not-an-array",
  });

  assert.equal(purchases.totalItems, 1);
  assert.equal(purchases.books[0]?.image, null);
  assert.equal(purchases.books[0]?.invoiceLink, null);
  assert.deepEqual(purchases.courses, []);
  assert.equal(PurchasesModel.fromMap(null).totalItems, 0);
});

test("purchase filters send the supported orderable type", () => {
  assert.deepEqual(new FetchPurchasesParams().toMap(), {});
  assert.deepEqual(new FetchPurchasesParams(1).toMap(), { orderable_type: 1 });
  assert.deepEqual(new FetchPurchasesParams(5).toMap(), { orderable_type: 5 });
  assert.deepEqual(new FetchPurchasesParams(6).toMap(), { orderable_type: 6 });
  assert.deepEqual(new FetchPurchasesParams(14).toMap(), {
    orderable_type: 14,
  });
});

test("purchases page calls the unified authenticated endpoint and exposes clear UX", async () => {
  const [apiNames, service, params, container, library] = await Promise.all([
    readSource("base/core/networkStructure/apiNames.ts"),
    readSource(
      "features/FetchPurchases/Data/api_services/fetch_purchases_api_service.ts",
    ),
    readSource("features/FetchPurchases/Core/Params/fetch_purchases_params.ts"),
    readSource("components/Profile/MyCourseContainer.vue"),
    readSource("components/Profile/MyPurchasesLibrary.vue"),
  ]);

  assert.match(apiNames, /fetch_my_purchased = "fetch_my_purchased"/u);
  assert.match(service, /ApiNames\.Instance\.fetch_my_purchased/u);
  assert.match(service, /type: CrudType\.POST/u);
  assert.match(service, /auth: true/u);
  assert.match(params, /PurchaseOrderableType = 1 \| 5 \| 6 \| 14/u);
  assert.match(params, /orderable_type: this\.orderableType/u);
  assert.match(container, /<ProfileMyPurchasesLibrary \/>/u);
  assert.doesNotMatch(container, /<ProfileMyCourseCard/u);

  for (const label of ["الكورسات", "الكتب", "بنوك الأسئلة", "الباقات"]) {
    assert.match(library, new RegExp(label, "u"));
  }
  assert.match(library, /v-model="searchWord"/u);
  assert.match(library, /course: 1/u);
  assert.match(library, /book: 5/u);
  assert.match(library, /questionBank: 6/u);
  assert.match(library, /package: 14/u);
  assert.match(
    library,
    /new FetchPurchasesParams\(orderableTypeFor\(filter\)\)/u,
  );
  assert.match(library, /@click="selectFilter\(filter\.key\)"/u);
  assert.match(library, /item\.invoiceLink/u);
  assert.match(library, /تعذّر تحميل مشترياتك/u);
  assert.match(library, /كل مشترياتك ستظهر هنا/u);
});

test("purchased books render as a standalone responsive three-book grid", async () => {
  const library = await readSource("components/Profile/MyPurchasesLibrary.vue");

  assert.match(library, /v-if="item\.kind === 'book'"/u);
  assert.match(library, /class="purchase-card__book-link"/u);
  assert.match(library, /purchase-card__book-cover/u);
  assert.match(library, /purchase-card__book-pages/u);
  assert.match(
    library,
    /purchase-grid:has\(\.purchase-card--book\)[\s\S]*?grid-template-columns: repeat\(3,/u,
  );
  assert.match(library, /<template v-else>[\s\S]*purchase-card__body/u);
  assert.doesNotMatch(library, /purchase-card__book-stage/u);
  assert.doesNotMatch(library, /purchase-card__book-hint/u);
  assert.match(library, /purchase-card--book:focus-within/u);
  assert.match(library, /@media \(hover: hover\) and \(pointer: fine\)/u);
  assert.match(
    library,
    /purchase-card--book:hover \.purchase-card__book-cover \{[\s\S]*?transform: rotateY\(88deg\);/u,
  );
  assert.match(library, /@media \(prefers-reduced-motion: reduce\)/u);
});

test("profilecourse keeps navigation compact and prioritizes searchable content", async () => {
  const [container, library, page] = await Promise.all([
    readSource("components/Profile/MyCourseContainer.vue"),
    readSource("components/Profile/MyPurchasesLibrary.vue"),
    readSource("pages/profilecourse.vue"),
  ]);

  assert.match(container, /class="profilecourse-intro"/u);
  assert.match(container, /class="profilecourse-shortcuts"/u);
  assert.match(container, /aria-label="وصول سريع للمحتوى"/u);
  assert.doesNotMatch(container, /profilecourse-hero/u);
  assert.doesNotMatch(container, /profilecourse-library-heading/u);
  assert.match(library, /const continueCourse = computed/u);
  assert.match(library, /class="purchases-resume"/u);
  assert.match(library, /handleSearchShortcut/u);
  assert.match(library, /aria-controls="purchase-results"/u);
  assert.match(library, /class="purchases-results-meta"/u);
  assert.doesNotMatch(library, /class="purchases-overview"/u);
  assert.match(page, /title: "مشترياتي \| مساحة الطالب"/u);
});

test("profilecourse and student dashboard share the same course card", async () => {
  const [library, dashboard, courseCard] = await Promise.all([
    readSource("components/Profile/MyPurchasesLibrary.vue"),
    readSource("pages/student-dashboard.vue"),
    readSource("components/Profile/StudentCourseCard.vue"),
  ]);

  assert.match(library, /<ProfileStudentCourseCard/u);
  assert.match(library, /v-if="item\.kind === 'course'"/u);
  assert.match(library, /:invoice-link="item\.invoiceLink"/u);
  assert.match(
    library,
    /purchase-grid:has\(\.purchased-course-card\)[\s\S]*?grid-template-columns: repeat\(3,/u,
  );
  assert.match(dashboard, /<ProfileStudentCourseCard/u);
  assert.match(courseCard, /class="student-course-card__cover"/u);
  assert.match(courseCard, /class="student-course-card__progress"/u);
  assert.match(courseCard, /Math\.round\(value\)/u);
  assert.match(courseCard, /student-course-card--blocked/u);
  assert.match(courseCard, /left:13px/u);
  assert.match(courseCard, /padding-inline-end:80px/u);
});
