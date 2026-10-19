<script setup lang="ts">
import HomeCourseCard from "~/components/home/v2/HomeCourseCard.vue";
import { getWebDomain } from "~/constant/webDomain";
import { HomePageApi } from "~/features/HomePageFeature/api/homePageApi";
import { mapHomeCoursePage } from "~/features/HomePageFeature/mappers/homePageMapper";
import type { HomeCourseViewModel } from "~/features/HomePageFeature/models/HomePageViewModel";
import { CategoryIdEnum } from "~/features/RegisterFeature/Core/Enums/education_type_enum";

const userStore = useUserStore();
const userInfo = computed(() => userStore.user?.userInfo);

const toPositiveId = (value: unknown): number | null => {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
};

const categoryId = computed(() => {
  const id = Number(userStore.user?.category_id);
  return id === CategoryIdEnum.BASIC || id === CategoryIdEnum.UNIVERSITY
    ? id
    : null;
});

const educationPath = computed(() => {
  const info = userInfo.value;
  if (!info) return [];

  if (categoryId.value === CategoryIdEnum.UNIVERSITY) {
    return [
      { label: "نوع التعليم", value: info.university_education_type_title },
      { label: "الجامعة", value: info.university_title },
      { label: "الكلية", value: info.college_title },
      { label: "القسم", value: info.department_title },
      { label: "الفرقة", value: info.division_title },
    ].filter((item) => item.value);
  }

  return [
    { label: "نوع التعليم", value: info.basic_education_type_title },
    { label: "المرحلة", value: info.stage_title },
    { label: "السنة الدراسية", value: info.year_title },
  ].filter((item) => item.value);
});

const educationLabel = computed(() =>
  categoryId.value === CategoryIdEnum.UNIVERSITY
    ? userInfo.value?.division_title || "مسارك الجامعي"
    : userInfo.value?.year_title || "مرحلتك الدراسية",
);

const api = new HomePageApi(getWebDomain());
const requestKey = computed(
  () => [
    "profile-available-courses",
    userStore.user?.id ?? "guest",
    categoryId.value ?? "category-missing",
    toPositiveId(userInfo.value?.basic_education_type_id) ?? "basic-type-none",
    toPositiveId(userInfo.value?.stage_id) ?? "stage-none",
    toPositiveId(userInfo.value?.year_id) ?? "year-none",
    toPositiveId(userInfo.value?.university_education_type_id) ?? "university-type-none",
    toPositiveId(userInfo.value?.university_id) ?? "university-none",
    toPositiveId(userInfo.value?.college_id) ?? "college-none",
    toPositiveId(userInfo.value?.department_id) ?? "department-none",
    toPositiveId(userInfo.value?.division_id) ?? "division-none",
  ].join(":"),
);

const fetchAllAvailableCourses = async (): Promise<HomeCourseViewModel[]> => {
  if (!categoryId.value) return [];

  const perPage = 100;
  const fetchPage = async (page: number) =>
    mapHomeCoursePage(
      await api.fetchEducationCourses({
        categoryId: categoryId.value!,
        educationTypeId:
          categoryId.value === CategoryIdEnum.UNIVERSITY
            ? toPositiveId(userInfo.value?.university_education_type_id)
            : toPositiveId(userInfo.value?.basic_education_type_id),
        stageId: toPositiveId(userInfo.value?.stage_id),
        yearId: toPositiveId(userInfo.value?.year_id),
        universityId: toPositiveId(userInfo.value?.university_id),
        collegeId: toPositiveId(userInfo.value?.college_id),
        departmentId: toPositiveId(userInfo.value?.department_id),
        divisionId: toPositiveId(userInfo.value?.division_id),
        page,
        perPage,
        accessToken: userStore.user?.apiToken,
      }),
      page,
      perPage,
    );

  const firstPage = await fetchPage(1);
  const remainingPages = await Promise.all(
    Array.from(
      { length: Math.max(0, firstPage.pagination.lastPage - 1) },
      (_, index) => index + 2,
    ).map(fetchPage),
  );
  const uniqueCourses = new Map<number, HomeCourseViewModel>();

  [firstPage, ...remainingPages].forEach((coursePage) => {
    coursePage.courses.forEach((course) => {
      if (!uniqueCourses.has(course.id)) uniqueCourses.set(course.id, course);
    });
  });

  return [...uniqueCourses.values()];
};

const courseLevelLabel = (course: HomeCourseViewModel) =>
  course.sourceSubject?.title || educationLabel.value;

const { data: courses, pending, error, refresh } = await useAsyncData<HomeCourseViewModel[]>(
  requestKey.value,
  fetchAllAvailableCourses,
  {
    default: () => [],
    getCachedData: () => undefined,
    watch: [requestKey],
  },
);
</script>

<template>
  <div class="prfile-home profile-dashboard">
    <ProfileSidebar class="profile-dashboard-sidebar" />

    <div class="profile-dashboard-workspace">
      <header class="profile-dashboard-topbar">
        <div class="profile-topbar-copy">
          <strong>مساحة الطالب</strong>
          <span>الكورسات المناسبة لمسارك التعليمي</span>
        </div>
        <div class="profile-topbar-status"><span />الكورسات</div>
      </header>

      <main class="profile-dashboard-main">
        <header class="profile-page-heading available-heading">
          <div>
            <span>{{ categoryId === CategoryIdEnum.UNIVERSITY ? "التعليم الجامعي" : "التعليم الأساسي" }}</span>
            <h1>كورسات {{ educationLabel }}</h1>
            <p>تُعرض الكورسات باستخدام بيانات التعليم المسجلة في حسابك.</p>
          </div>
        </header>

        <section
          v-if="educationPath.length"
          class="available-education-path"
          aria-labelledby="available-education-path-title"
        >
          <div class="available-education-path__heading">
            <span>المسار المستخدم في الفلترة</span>
            <h2 id="available-education-path-title">
              {{ categoryId === CategoryIdEnum.UNIVERSITY ? "مراحل مسارك الجامعي" : "مرحلتك وسنتك الدراسية" }}
            </h2>
          </div>
          <ol>
            <li v-for="(item, index) in educationPath" :key="item.label">
              <span>{{ String(index + 1).padStart(2, "0") }}</span>
              <div>
                <small>{{ item.label }}</small>
                <strong>{{ item.value }}</strong>
              </div>
            </li>
          </ol>
        </section>

        <section v-if="pending" class="available-state" aria-live="polite">
          <i class="pi pi-spin pi-spinner" />
          <strong>جاري تحميل الكورسات...</strong>
        </section>

        <section v-else-if="error" class="available-state available-state--error">
          <i class="pi pi-exclamation-circle" />
          <strong>تعذر تحميل الكورسات</strong>
          <p>{{ error.message }}</p>
          <button type="button" @click="refresh()">حاول مرة أخرى</button>
        </section>

        <section v-else-if="!courses?.length" class="available-state">
          <i class="pi pi-book" />
          <strong>لا توجد كورسات متاحة حاليًا</strong>
          <p>لا توجد كورسات مرتبطة بمسارك التعليمي المسجل حاليًا.</p>
        </section>

        <section v-else class="available-course-grid">
          <HomeCourseCard
            v-for="(course, index) in courses"
            :key="course.id"
            :course="course"
            :index="index"
            :level-label="courseLevelLabel(course)"
            :interactive="false"
            :to="{ name: 'student-dashboard-course-id', params: { id: course.id } }"
          />
        </section>
      </main>
    </div>
  </div>
</template>

<style scoped>
.prfile-home { display:grid; width:100%; grid-template-columns:repeat(6,1fr); gap:10px; margin-top:50px; text-align:right; }
.profile-dashboard-workspace { min-width:0; }
.available-heading { display:flex; align-items:flex-end; justify-content:space-between; gap:28px; }
.available-heading > div { min-width:0; }
.available-education-path { margin-bottom:28px; padding:22px; border:1px solid var(--profile-border,#d9dfe2); background:var(--profile-surface,#fff); }
.available-education-path__heading { margin-bottom:16px; }
.available-education-path__heading > span { color:var(--profile-secondary,var(--secondary-color)); font-size:12px; font-weight:900; }
.available-education-path__heading h2 { margin:4px 0 0; color:var(--profile-ink,#17343c); font-size:22px; }
.available-education-path ol { display:grid; grid-template-columns:repeat(auto-fit,minmax(170px,1fr)); gap:10px; margin:0; padding:0; list-style:none; }
.available-education-path li { display:flex; align-items:center; gap:12px; min-width:0; padding:14px; border:1px solid var(--profile-border,#d9dfe2); background:var(--profile-surface-raised,#f8fafb); }
.available-education-path li > span { display:grid; flex:0 0 42px; width:42px; height:42px; place-items:center; border:1px solid color-mix(in srgb,var(--profile-secondary,var(--secondary-color)) 35%,var(--profile-border,#d9dfe2)); color:var(--profile-secondary,var(--secondary-color)); font-weight:900; }
.available-education-path li div { display:grid; min-width:0; gap:2px; }
.available-education-path li small { color:var(--profile-muted,#6f777b); font-size:11px; font-weight:800; }
.available-education-path li strong { overflow:hidden; color:var(--profile-ink,#17343c); font-size:14px; text-overflow:ellipsis; white-space:nowrap; }
.explore-stages { display:inline-flex; flex:0 0 auto; align-items:center; gap:10px; padding:13px 18px; border-radius:10px; background:var(--profile-secondary,var(--secondary-color)); color:var(--profile-on-action,#fff); font-weight:800; }
.available-course-grid { --home-v2-surface:var(--profile-surface); --home-v2-ink:var(--profile-ink); --home-v2-muted:var(--profile-muted); --home-v2-line:var(--profile-border); --home-v2-blue:var(--profile-secondary); --home-v2-deep:var(--profile-primary); --course-card-cover:color-mix(in srgb,var(--profile-secondary) 12%,var(--profile-surface-raised)); --course-card-cover-violet:color-mix(in srgb,var(--profile-primary) 14%,var(--profile-surface-raised)); --course-card-cover-sky:color-mix(in srgb,var(--profile-secondary) 18%,var(--profile-surface)); --course-card-pill:color-mix(in srgb,var(--profile-surface) 92%,transparent); display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:22px; }
.available-state { display:grid; min-height:280px; place-items:center; align-content:center; gap:12px; padding:36px; border:1px dashed var(--profile-border,#d9dfe2); background:var(--profile-surface,#fff); color:var(--profile-ink,#17343c); text-align:center; }
.available-state i { color:var(--profile-secondary,var(--secondary-color)); font-size:36px; }
.available-state strong { font-size:21px; }
.available-state p { margin:0; color:var(--profile-muted,#6f777b); }
.available-state a,.available-state button { padding:10px 16px; border:0; background:var(--profile-secondary,var(--secondary-color)); color:var(--profile-on-action,#fff); cursor:pointer; font-weight:800; }
.available-state--error i { color:#b42318; }
@media (max-width:900px) { .available-heading { align-items:stretch; flex-direction:column; } .available-course-grid { grid-template-columns:1fr; } }
@media (max-width:768px) { .prfile-home { display:flex; margin:0; flex-direction:column-reverse; } }
</style>
