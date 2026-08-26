<script setup lang="ts">
import {
  DataFailed,
  DataInitial,
  DataLoading,
} from "~/base/core/networkStructure/Resources/dataState/data_state";
import FetchMyLibraryParams from "~/features/StudentLibraryFeature/Core/Params/fetch_my_library_params";
import FetchMyLibraryBooksController from "~/features/StudentLibraryFeature/presentation/controllers/fetch_my_library_books_controller";
import FetchMyLibraryCoursesController from "~/features/StudentLibraryFeature/presentation/controllers/fetch_my_library_courses_controller";
import { resolveStudentIdentity } from "~/utils/studentIdentity";

type LibraryTab = "all" | "courses" | "books";

interface LibraryCard {
  id: number;
  kind: Exclude<LibraryTab, "all">;
  title: string;
  description: string;
  image: string | null;
  pageCount?: number;
  meta: string;
  to: string;
}

const userStore = useUserStore();
const booksController = FetchMyLibraryBooksController.getInstance();
const coursesController = FetchMyLibraryCoursesController.getInstance();
const booksState = booksController.state;
const coursesState = coursesController.state;

const activeTab = ref<LibraryTab>("all");
const studentIdentity = computed(() => resolveStudentIdentity(userStore.user));
const educationLabel = computed(() => {
  const info = userStore.user?.userInfo;
  return info?.year_title || info?.stage_title || info?.university_title || "مساحتك التعليمية";
});
const books = computed(() => booksState.value.data ?? []);
const courses = computed(() => coursesState.value.data ?? []);
const isLoading = computed(() =>
  [booksState.value, coursesState.value].some(
    (state) => state instanceof DataInitial || state instanceof DataLoading,
  ),
);
const failedStates = computed(() =>
  [booksState.value, coursesState.value].filter(
    (state): state is DataFailed<unknown> => state instanceof DataFailed,
  ),
);
const hasFailure = computed(() => failedStates.value.length > 0);
const failureMessage = computed(
  () =>
    failedStates.value
      .map((state) => state.error?.title)
      .filter(Boolean)
      .join(" · ") || "تعذر تحميل بعض عناصر المفضلة.",
);
const tabs = computed(() => [
  { key: "all" as const, label: "الكل", count: courses.value.length + books.value.length },
  { key: "courses" as const, label: "الكورسات", count: courses.value.length },
  { key: "books" as const, label: "الكتب", count: books.value.length },
]);
const cards = computed<LibraryCard[]>(() => [
  ...courses.value.map((course) => ({
    id: course.id,
    kind: "courses" as const,
    title: course.title,
    description: course.description || "تابع محتوى الكورس من حيث توقفت.",
    image: course.image,
    meta: [
      course.subject || null,
      course.teacherName || null,
      `${course.progress}% إنجاز`,
    ]
      .filter(Boolean)
      .join(" · "),
    to: `/course/${course.id}`,
  })),
  ...books.value.map((book) => ({
    id: book.id,
    kind: "books" as const,
    title: book.title,
    description: book.description || "ارجع إلى هذا الكتاب في أي وقت.",
    image: book.image,
    pageCount: book.pageCount,
    meta: book.pageCount ? `${book.pageCount} صفحة` : "كتاب محفوظ",
    to: `/books/${book.id}`,
  })),
]);
const visibleCards = computed(() =>
  activeTab.value === "all"
    ? cards.value
    : cards.value.filter((card) => card.kind === activeTab.value),
);
const isEmpty = computed(
  () =>
    !isLoading.value &&
    !cards.value.length &&
    !hasFailure.value,
);

const loadLibrary = async () => {
  await Promise.all([
    coursesController.fetchMyLibraryCourses(new FetchMyLibraryParams()),
    booksController.fetchMyLibraryBooks(new FetchMyLibraryParams()),
  ]);
};

onMounted(loadLibrary);
</script>

<template>
  <div class="prfile-home profile-dashboard favorite-library-page">
    <ProfileSidebar class="profile-dashboard-sidebar" />

    <div class="profile-dashboard-workspace">
      <header class="profile-dashboard-topbar">
        <div class="profile-topbar-copy">
          <strong>مساحة الطالب</strong>
          <span>كل ما حفظته للرجوع إليه بسرعة</span>
        </div>
        <div class="profile-topbar-status"><span />{{ educationLabel }}</div>
      </header>

      <main class="profile-dashboard-main favorite-library-main">
        <section class="favorite-library-hero">
          <div class="favorite-library-hero__icon" aria-hidden="true">
            <i class="pi pi-heart-fill" />
          </div>
          <div>
            <span>قائمتك الخاصة</span>
            <h1>المفضلة</h1>
            <p>
              {{ studentIdentity.firstName ? `يا ${studentIdentity.firstName}، ` : "" }}
              الكورسات والكتب التي حفظتها ستجدها هنا دائمًا.
            </p>
          </div>
          <div class="favorite-library-hero__count">
            <b>{{ cards.length }}</b>
            <span>عنصر محفوظ</span>
          </div>
        </section>

        <section class="favorite-library-content" aria-labelledby="favorite-library-title">
          <header class="favorite-library-toolbar">
            <div>
              <span class="favorite-library-kicker">محتواك المحفوظ</span>
              <h2 id="favorite-library-title">ارجع لما تحب بسهولة</h2>
            </div>

            <div class="favorite-library-tabs" role="tablist" aria-label="تصفية المفضلة">
              <button
                v-for="tab in tabs"
                :key="tab.key"
                type="button"
                :class="{ active: activeTab === tab.key }"
                :aria-selected="activeTab === tab.key"
                role="tab"
                @click="activeTab = tab.key"
              >
                {{ tab.label }}
                <span>{{ tab.count }}</span>
              </button>
            </div>
          </header>

          <div v-if="isLoading" class="favorite-library-skeletons" aria-label="جارٍ تحميل المفضلة">
            <article v-for="item in 4" :key="item"><span /><div><i /><i /><i /></div></article>
          </div>

          <div v-else-if="isEmpty" class="favorite-library-empty">
            <span class="favorite-library-empty__icon"><i class="pi pi-heart" /></span>
            <h2>لم تحفظ أي محتوى بعد</h2>
            <p>استخدم زر القلب في أي كورس أو كتاب لتجده هنا سريعًا.</p>
            <div>
              <NuxtLink to="/course">تصفح الكورسات</NuxtLink>
              <NuxtLink to="/books">تصفح الكتب</NuxtLink>
            </div>
          </div>

          <template v-else>
            <div v-if="hasFailure" class="favorite-library-notice" role="alert">
              <i class="pi pi-exclamation-circle" aria-hidden="true" />
              <p>{{ failureMessage }}</p>
              <button type="button" @click="loadLibrary">
                <i class="pi pi-refresh" aria-hidden="true" /> إعادة المحاولة
              </button>
            </div>

            <div v-if="visibleCards.length" class="favorite-library-grid">
              <template v-for="(card, cardIndex) in visibleCards" :key="`${card.kind}-${card.id}`">
                <ProfilePurchaseBookCard
                  v-if="card.kind === 'books'"
                  :title="card.title"
                  :to="card.to"
                  :image="card.image"
                  :page-count="card.pageCount"
                  :order="cardIndex"
                />

                <NuxtLink
                  v-else
                  :to="card.to"
                  class="favorite-library-card favorite-library-card--courses"
                  :aria-label="`فتح الكورس ${card.title}`"
                >
                  <div class="favorite-library-card__visual">
                    <img v-if="card.image" :src="card.image" :alt="card.title" />
                    <i v-else class="pi pi-play-circle" aria-hidden="true" />
                    <span>
                      <i class="pi pi-play" aria-hidden="true" />
                      كورس
                    </span>
                  </div>
                  <div class="favorite-library-card__body">
                    <h3>{{ card.title }}</h3>
                    <p>{{ card.description }}</p>
                    <footer>
                      <small>{{ card.meta }}</small>
                      <i class="pi pi-arrow-left" aria-hidden="true" />
                    </footer>
                  </div>
                </NuxtLink>
              </template>
            </div>

            <div v-else class="favorite-library-filter-empty">
              <i :class="activeTab === 'courses' ? 'pi pi-play-circle' : 'pi pi-book'" aria-hidden="true" />
              لا توجد {{ activeTab === "courses" ? "كورسات" : "كتب" }} محفوظة حاليًا.
            </div>
          </template>
        </section>
      </main>
    </div>
  </div>
</template>

<style scoped>
.favorite-library-main { padding-top: 38px; }
.favorite-library-hero { display:grid; grid-template-columns:auto minmax(0, 1fr) auto; align-items:center; gap:18px; padding:clamp(20px, 3vw, 30px); border:1px solid color-mix(in srgb, #d6284d 20%, var(--profile-border)); border-radius:18px; background:linear-gradient(135deg, color-mix(in srgb, #e75170 10%, var(--profile-surface)), var(--profile-surface) 62%); box-shadow:0 18px 45px color-mix(in srgb, var(--profile-primary) 7%, transparent); }
.favorite-library-hero__icon { display:grid; width:55px; height:55px; place-items:center; border-radius:16px; background:linear-gradient(135deg, #e75170, #c71d42); color:#fff; font-size:23px; box-shadow:0 10px 22px rgb(199 29 66 / 24%); }
.favorite-library-hero > div:nth-child(2) > span,.favorite-library-kicker { color:var(--profile-secondary); font-size:11px; font-weight:900; }
.favorite-library-hero h1 { margin:4px 0; color:var(--profile-ink); font-size:clamp(28px, 3vw, 38px); font-weight:900; line-height:1.25; }
.favorite-library-hero p { margin:0; color:var(--profile-muted); font-size:13px; line-height:1.7; }
.favorite-library-hero__count { min-width:92px; display:grid; gap:2px; padding:10px 14px; border-right:1px solid var(--profile-border); text-align:center; }
.favorite-library-hero__count b { color:var(--profile-ink); font-size:24px; line-height:1; }
.favorite-library-hero__count span { color:var(--profile-muted); font-size:10px; font-weight:700; }
.favorite-library-content { margin-top:22px; padding:clamp(20px, 3vw, 30px); border:1px solid var(--profile-border); border-radius:18px; background:var(--profile-surface); }
.favorite-library-toolbar { display:flex; align-items:center; justify-content:space-between; gap:18px; margin-bottom:22px; }
.favorite-library-toolbar h2 { margin:5px 0 0; color:var(--profile-ink); font-size:20px; font-weight:900; }
.favorite-library-tabs { display:flex; gap:5px; padding:4px; border:1px solid var(--profile-border); border-radius:12px; background:var(--profile-surface-raised); }
.favorite-library-tabs button { display:inline-flex; min-height:34px; align-items:center; gap:7px; padding:6px 10px; border:0; border-radius:8px; background:transparent; color:var(--profile-muted); cursor:pointer; font:800 11px "Cairo", sans-serif; transition:background .18s ease,color .18s ease,box-shadow .18s ease; }
.favorite-library-tabs button span { display:grid; min-width:18px; height:18px; place-items:center; border-radius:50%; background:color-mix(in srgb, var(--profile-muted) 12%, transparent); font-size:9px; }
.favorite-library-tabs button.active { background:var(--profile-secondary); color:var(--profile-on-action); box-shadow:0 6px 14px color-mix(in srgb, var(--profile-secondary) 25%, transparent); }
.favorite-library-tabs button.active span { background:color-mix(in srgb, #fff 25%, transparent); }
.favorite-library-grid { display:grid; grid-template-columns:repeat(3, minmax(0, 1fr)); align-items:start; gap:16px; }
.favorite-library-card { min-width:0; overflow:hidden; border:1px solid var(--profile-border); border-radius:14px; background:var(--profile-surface); color:inherit; text-decoration:none; transition:transform .2s ease,border-color .2s ease,box-shadow .2s ease; }
.favorite-library-card:hover { border-color:color-mix(in srgb, var(--profile-secondary) 38%, var(--profile-border)); box-shadow:0 15px 28px color-mix(in srgb, var(--profile-primary) 10%, transparent); transform:translateY(-3px); }
.favorite-library-card__visual { position:relative; display:grid; height:148px; place-items:center; overflow:hidden; background:linear-gradient(135deg, color-mix(in srgb, var(--profile-secondary) 26%, var(--profile-surface)), var(--profile-surface-raised)); color:var(--profile-secondary); font-size:43px; }
.favorite-library-card__visual img { width:100%; height:100%; object-fit:cover; transition:transform .3s ease; }
.favorite-library-card:hover .favorite-library-card__visual img { transform:scale(1.04); }
.favorite-library-card__visual::after { position:absolute; inset:0; background:linear-gradient(180deg, transparent 40%, rgb(8 20 48 / 42%)); content:""; }
.favorite-library-card__visual > span { position:absolute; z-index:1; top:10px; right:10px; display:inline-flex; align-items:center; gap:5px; padding:5px 7px; border-radius:7px; background:rgb(255 255 255 / 88%); color:var(--profile-ink); font-size:9px; font-weight:900; }
.favorite-library-card__body { display:flex; min-height:150px; flex-direction:column; padding:14px; }
.favorite-library-card h3 { display:-webkit-box; overflow:hidden; margin:0 0 5px; color:var(--profile-ink); font-size:14px; line-height:1.55; -webkit-box-orient:vertical; -webkit-line-clamp:2; }
.favorite-library-card p { display:-webkit-box; overflow:hidden; margin:0; color:var(--profile-muted); font-size:11px; line-height:1.65; -webkit-box-orient:vertical; -webkit-line-clamp:2; }
.favorite-library-card footer { display:flex; align-items:center; justify-content:space-between; gap:8px; margin-top:auto; padding-top:12px; border-top:1px solid var(--profile-border); color:var(--profile-muted); }
.favorite-library-card footer small { overflow:hidden; font-size:9px; font-weight:700; text-overflow:ellipsis; white-space:nowrap; }
.favorite-library-card footer > i { display:grid; width:27px; height:27px; flex:0 0 auto; place-items:center; border-radius:7px; background:var(--profile-secondary-soft); color:var(--profile-secondary); font-size:11px; transition:background .18s ease,color .18s ease; }
.favorite-library-card:hover footer > i { background:var(--profile-secondary); color:var(--profile-on-action); }
.favorite-library-skeletons { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:16px; }
.favorite-library-skeletons article { overflow:hidden; border:1px solid var(--profile-border); border-radius:14px; background:var(--profile-surface); }
.favorite-library-skeletons article > span { display:block; height:148px; }
.favorite-library-skeletons article > div { display:grid; gap:9px; padding:14px; }
.favorite-library-skeletons i { display:block; height:11px; border-radius:999px; }
.favorite-library-skeletons i:nth-child(2) { width:72%; }.favorite-library-skeletons i:nth-child(3) { width:44%; }
.favorite-library-skeletons article > span,.favorite-library-skeletons i { background:linear-gradient(100deg,var(--profile-surface-raised),color-mix(in srgb,var(--profile-secondary) 7%,var(--profile-surface)),var(--profile-surface-raised)); background-size:200% 100%; animation:favorite-library-loading 1.2s linear infinite; }
.favorite-library-empty,.favorite-library-filter-empty { display:grid; justify-items:center; padding:50px 20px; text-align:center; }
.favorite-library-empty__icon { display:grid; width:58px; height:58px; place-items:center; border-radius:50%; background:color-mix(in srgb,#e75170 12%,var(--profile-surface)); color:#d6284d; font-size:25px; }
.favorite-library-empty h2 { margin:14px 0 4px; color:var(--profile-ink); font-size:20px; }.favorite-library-empty p { max-width:420px; margin:0; color:var(--profile-muted); font-size:12px; line-height:1.75; }
.favorite-library-empty > div { display:flex; flex-wrap:wrap; justify-content:center; gap:9px; margin-top:18px; }.favorite-library-empty a { padding:10px 14px; border-radius:9px; background:var(--profile-secondary); color:var(--profile-on-action); font-size:11px; font-weight:900; text-decoration:none; }.favorite-library-empty a + a { background:var(--profile-secondary-soft); color:var(--profile-secondary); }
.favorite-library-filter-empty { min-height:220px; gap:10px; color:var(--profile-muted); font-size:12px; font-weight:800; }.favorite-library-filter-empty i { font-size:34px; color:var(--profile-secondary); }
.favorite-library-notice { display:flex; align-items:center; gap:9px; margin:0 0 16px; padding:10px 12px; border:1px solid color-mix(in srgb,#e6a03e 40%,var(--profile-border)); border-radius:10px; background:color-mix(in srgb,#e6a03e 10%,var(--profile-surface)); color:color-mix(in srgb,#9a5700 80%,var(--profile-ink)); font-size:11px; }.favorite-library-notice p { flex:1; margin:0; }.favorite-library-notice button { display:inline-flex; align-items:center; gap:5px; padding:6px 8px; border:0; background:transparent; color:inherit; cursor:pointer; font:900 10px "Cairo",sans-serif; }
@keyframes favorite-library-loading { to { background-position:-200% 0; } }
@media (max-width: 960px) { .favorite-library-grid,.favorite-library-skeletons { grid-template-columns:repeat(2,minmax(0,1fr)); } }
@media (max-width: 620px) { .favorite-library-main { padding-top:22px; }.favorite-library-hero { grid-template-columns:auto minmax(0,1fr); gap:13px; }.favorite-library-hero__count { grid-column:1/-1; grid-template-columns:auto 1fr; justify-content:start; justify-items:start; width:100%; padding:10px 0 0; border-top:1px solid var(--profile-border); border-right:0; text-align:right; }.favorite-library-hero__count b { font-size:18px; }.favorite-library-toolbar { align-items:stretch; flex-direction:column; }.favorite-library-tabs { width:100%; }.favorite-library-tabs button { flex:1; justify-content:center; }.favorite-library-grid,.favorite-library-skeletons { grid-template-columns:1fr; }.favorite-library-card { display:grid; grid-template-columns:112px minmax(0,1fr); }.favorite-library-card__visual { height:auto; min-height:132px; }.favorite-library-card__body { min-height:132px; padding:12px; }.favorite-library-card__visual > span { top:7px; right:7px; }.favorite-library-notice { align-items:flex-start; flex-wrap:wrap; } }
</style>
