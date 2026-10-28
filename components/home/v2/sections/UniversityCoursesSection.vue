<script setup lang="ts">
import HomeCourseCard from "~/components/home/v2/HomeCourseCard.vue";
import { getWebDomain } from "~/constant/webDomain";
import { HomePageApi, normalizeHomeDataError } from "~/features/HomePageFeature/api/homePageApi";
import { mapHomeCoursePage } from "~/features/HomePageFeature/mappers/homePageMapper";
import type { HomeCoursePageViewModel } from "~/features/HomePageFeature/models/HomePageViewModel";
import { CategoryIdEnum } from "~/features/RegisterFeature/Core/Enums/education_type_enum";

interface EducationOption {
  id: number;
  title: string;
}

const props = defineProps<{
  initialWord?: string;
  initialTeacherId?: number | null;
}>();

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const api = new HomePageApi(getWebDomain());
const perPage = 9;

const educationTypes = ref<EducationOption[]>([]);
const universities = ref<EducationOption[]>([]);
const colleges = ref<EducationOption[]>([]);
const departments = ref<EducationOption[]>([]);
const divisions = ref<EducationOption[]>([]);

const educationTypeId = ref<number | null>(null);
const universityId = ref<number | null>(null);
const collegeId = ref<number | null>(null);
const departmentId = ref<number | null>(null);
const divisionId = ref<number | null>(null);
const searchWord = ref(props.initialWord?.trim().slice(0, 100) ?? "");

const taxonomyLoading = ref(false);
const coursesLoading = ref(false);
const taxonomyError = ref("");
const coursesError = ref("");
const coursePage = ref<HomeCoursePageViewModel>(mapHomeCoursePage(null, 1, perPage));
let courseRequestId = 0;
let initializedForUserId: number | null = null;

const token = computed(() => userStore.user?.apiToken);
const userInfo = computed(() => userStore.user?.userInfo);
const hasCompletePath = computed(() =>
  Boolean(
    educationTypeId.value &&
      universityId.value &&
      collegeId.value &&
      departmentId.value &&
      divisionId.value,
  ),
);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const toPositiveId = (value: unknown): number | null => {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
};

const mapOptions = (response: unknown): EducationOption[] => {
  const root = isRecord(response) && "data" in response ? response.data : response;
  if (!Array.isArray(root)) return [];

  return root.flatMap((item) => {
    if (!isRecord(item)) return [];
    const id = toPositiveId(item.id);
    const title = typeof item.title === "string" ? item.title.trim() : "";
    return id && title ? [{ id, title }] : [];
  });
};

const routeId = (key: string) => toPositiveId(route.query[key]);

const replaceUniversityQuery = async (page = 1) => {
  const {
    stage_id: _stageId,
    year_id: _yearId,
    education_type_id: _educationTypeId,
    university_id: _universityId,
    college_id: _collegeId,
    department_id: _departmentId,
    division_id: _divisionId,
    page: _page,
    word: _word,
    ...query
  } = route.query;

  await router.replace({
    query: {
      ...query,
      category_id: String(CategoryIdEnum.UNIVERSITY),
      ...(educationTypeId.value
        ? { education_type_id: String(educationTypeId.value) }
        : {}),
      ...(universityId.value ? { university_id: String(universityId.value) } : {}),
      ...(collegeId.value ? { college_id: String(collegeId.value) } : {}),
      ...(departmentId.value ? { department_id: String(departmentId.value) } : {}),
      ...(divisionId.value ? { division_id: String(divisionId.value) } : {}),
      ...(searchWord.value ? { word: searchWord.value } : {}),
      ...(page > 1 ? { page: String(page) } : {}),
    },
  });
};

const clearCourses = () => {
  courseRequestId += 1;
  coursePage.value = mapHomeCoursePage(null, 1, perPage);
  coursesError.value = "";
  coursesLoading.value = false;
};

const loadCourses = async (page = 1) => {
  if (!hasCompletePath.value) {
    clearCourses();
    await replaceUniversityQuery();
    return;
  }

  const requestId = ++courseRequestId;
  coursesLoading.value = true;
  coursesError.value = "";
  const normalizedWord = searchWord.value.trim().slice(0, 100);
  searchWord.value = normalizedWord;

  try {
    await replaceUniversityQuery(page);
    const response = await api.fetchEducationCourses({
      categoryId: CategoryIdEnum.UNIVERSITY,
      educationTypeId: educationTypeId.value,
      universityId: universityId.value,
      collegeId: collegeId.value,
      departmentId: departmentId.value,
      divisionId: divisionId.value,
      page,
      perPage,
      teacherId: props.initialTeacherId ?? null,
      word: normalizedWord,
      accessToken: token.value,
    });

    if (requestId !== courseRequestId) return;
    coursePage.value = mapHomeCoursePage(response, page, perPage);
  } catch (error) {
    if (requestId !== courseRequestId) return;
    coursesError.value = normalizeHomeDataError(error).message;
    coursePage.value = mapHomeCoursePage(null, page, perPage);
  } finally {
    if (requestId === courseRequestId) coursesLoading.value = false;
  }
};

const loadDivisions = async (preferredId: number | null = null) => {
  divisions.value = [];
  divisionId.value = null;
  clearCourses();
  if (!departmentId.value) return;

  divisions.value = mapOptions(
    await api.fetchCollegeDepartmentDivisions(departmentId.value, token.value),
  );
  divisionId.value = preferredId && divisions.value.some((item) => item.id === preferredId)
    ? preferredId
    : null;
};

const loadDepartments = async (
  preferredDepartmentId: number | null = null,
  preferredDivisionId: number | null = null,
) => {
  departments.value = [];
  departmentId.value = null;
  divisions.value = [];
  divisionId.value = null;
  clearCourses();
  if (!collegeId.value) return;

  departments.value = mapOptions(
    await api.fetchCollegeDepartments(collegeId.value, token.value),
  );
  departmentId.value = preferredDepartmentId && departments.value.some((item) => item.id === preferredDepartmentId)
    ? preferredDepartmentId
    : null;
  if (departmentId.value) await loadDivisions(preferredDivisionId);
};

const loadColleges = async (
  preferredCollegeId: number | null = null,
  preferredDepartmentId: number | null = null,
  preferredDivisionId: number | null = null,
) => {
  colleges.value = [];
  collegeId.value = null;
  departments.value = [];
  departmentId.value = null;
  divisions.value = [];
  divisionId.value = null;
  clearCourses();
  if (!universityId.value) return;

  colleges.value = mapOptions(await api.fetchColleges(universityId.value, token.value));
  collegeId.value = preferredCollegeId && colleges.value.some((item) => item.id === preferredCollegeId)
    ? preferredCollegeId
    : null;
  if (collegeId.value) {
    await loadDepartments(preferredDepartmentId, preferredDivisionId);
  }
};

const loadUniversities = async (
  preferredUniversityId: number | null = null,
  preferredCollegeId: number | null = null,
  preferredDepartmentId: number | null = null,
  preferredDivisionId: number | null = null,
) => {
  universities.value = [];
  universityId.value = null;
  colleges.value = [];
  collegeId.value = null;
  departments.value = [];
  departmentId.value = null;
  divisions.value = [];
  divisionId.value = null;
  clearCourses();
  if (!educationTypeId.value) return;

  universities.value = mapOptions(
    await api.fetchUniversities(educationTypeId.value, token.value),
  );
  universityId.value = preferredUniversityId && universities.value.some((item) => item.id === preferredUniversityId)
    ? preferredUniversityId
    : null;
  if (universityId.value) {
    await loadColleges(
      preferredCollegeId,
      preferredDepartmentId,
      preferredDivisionId,
    );
  }
};

const initialize = async () => {
  const userId = toPositiveId(userStore.user?.id);
  if (taxonomyLoading.value || initializedForUserId === userId) return;

  taxonomyLoading.value = true;
  taxonomyError.value = "";
  try {
    educationTypes.value = mapOptions(
      await api.fetchUniversityEducationTypes(token.value),
    );

    const preferredEducationTypeId =
      routeId("education_type_id") ??
      toPositiveId(userInfo.value?.university_education_type_id);
    educationTypeId.value = preferredEducationTypeId && educationTypes.value.some((item) => item.id === preferredEducationTypeId)
      ? preferredEducationTypeId
      : null;

    if (educationTypeId.value) {
      await loadUniversities(
        routeId("university_id") ?? toPositiveId(userInfo.value?.university_id),
        routeId("college_id") ?? toPositiveId(userInfo.value?.college_id),
        routeId("department_id") ?? toPositiveId(userInfo.value?.department_id),
        routeId("division_id") ?? toPositiveId(userInfo.value?.division_id),
      );
    }

    initializedForUserId = userId;
    if (hasCompletePath.value) {
      await loadCourses(toPositiveId(route.query.page) ?? 1);
    }
  } catch (error) {
    taxonomyError.value = normalizeHomeDataError(error).message;
  } finally {
    taxonomyLoading.value = false;
  }
};

const onEducationTypeChange = async () => {
  await loadUniversities();
  await replaceUniversityQuery();
};
const onUniversityChange = async () => {
  await loadColleges();
  await replaceUniversityQuery();
};
const onCollegeChange = async () => {
  await loadDepartments();
  await replaceUniversityQuery();
};
const onDepartmentChange = async () => {
  await loadDivisions();
  await replaceUniversityQuery();
};
const onDivisionChange = async () => {
  await loadCourses(1);
};

watch(
  () => userStore.user?.id,
  () => {
    initializedForUserId = null;
    void initialize();
  },
);

onMounted(() => void initialize());
</script>

<template>
  <section class="university-courses" aria-labelledby="university-courses-title">
    <div class="container">
      <header class="university-courses__heading">
        <div>
          <span>التعليم الجامعي</span>
          <h2 id="university-courses-title">اختار مسارك الجامعي</h2>
        </div>
        <p>حدد نوع التعليم والجامعة والكلية والقسم والفرقة لعرض الكورسات المناسبة.</p>
      </header>

      <div v-if="taxonomyLoading" class="university-courses__state">
        جاري تحميل مراحل التعليم الجامعي...
      </div>
      <div v-else-if="taxonomyError" class="university-courses__state is-error">
        <strong>تعذر تحميل مراحل التعليم الجامعي</strong>
        <span>{{ taxonomyError }}</span>
        <button type="button" @click="initialize">حاول مرة أخرى</button>
      </div>
      <div v-else class="university-path">
        <label>
          <span><b>01</b> نوع التعليم</span>
          <select v-model="educationTypeId" @change="onEducationTypeChange">
            <option :value="null">اختار نوع التعليم</option>
            <option v-for="item in educationTypes" :key="item.id" :value="item.id">{{ item.title }}</option>
          </select>
        </label>
        <label>
          <span><b>02</b> الجامعة</span>
          <select v-model="universityId" :disabled="!educationTypeId" @change="onUniversityChange">
            <option :value="null">اختار الجامعة</option>
            <option v-for="item in universities" :key="item.id" :value="item.id">{{ item.title }}</option>
          </select>
        </label>
        <label>
          <span><b>03</b> الكلية</span>
          <select v-model="collegeId" :disabled="!universityId" @change="onCollegeChange">
            <option :value="null">اختار الكلية</option>
            <option v-for="item in colleges" :key="item.id" :value="item.id">{{ item.title }}</option>
          </select>
        </label>
        <label>
          <span><b>04</b> القسم</span>
          <select v-model="departmentId" :disabled="!collegeId" @change="onDepartmentChange">
            <option :value="null">اختار القسم</option>
            <option v-for="item in departments" :key="item.id" :value="item.id">{{ item.title }}</option>
          </select>
        </label>
        <label>
          <span><b>05</b> الفرقة</span>
          <select v-model="divisionId" :disabled="!departmentId" @change="onDivisionChange">
            <option :value="null">اختار الفرقة</option>
            <option v-for="item in divisions" :key="item.id" :value="item.id">{{ item.title }}</option>
          </select>
        </label>
      </div>

      <form v-if="hasCompletePath" class="university-search" @submit.prevent="loadCourses(1)">
        <label>
          <span>ابحث باسم الكورس</span>
          <input v-model="searchWord" type="search" maxlength="100" placeholder="اكتب اسم الكورس..." />
        </label>
        <button type="submit" :disabled="coursesLoading">بحث</button>
      </form>

      <div v-if="!hasCompletePath && !taxonomyLoading" class="university-courses__empty">
        <strong>أكمل اختيار المسار الجامعي</strong>
        <p>ستظهر الكورسات بعد اختيار الفرقة.</p>
      </div>
      <div v-else-if="coursesLoading" class="university-courses__state">جاري تحميل الكورسات...</div>
      <div v-else-if="coursesError" class="university-courses__state is-error">
        <strong>تعذر تحميل الكورسات</strong>
        <span>{{ coursesError }}</span>
        <button type="button" @click="loadCourses(coursePage.pagination.currentPage)">حاول مرة أخرى</button>
      </div>
      <div v-else-if="coursePage.courses.length === 0" class="university-courses__empty">
        <strong>لا توجد كورسات لهذا المسار حاليًا</strong>
        <p>جرّب مسارًا آخر أو امسح كلمة البحث.</p>
      </div>
      <template v-else>
        <div class="university-courses__result-head">
          <h3>الكورسات المتاحة</h3>
          <b>{{ coursePage.pagination.total }} كورس</b>
        </div>
        <div class="course-grid">
          <HomeCourseCard
            v-for="(course, index) in coursePage.courses"
            :key="course.id"
            :course="course"
            :index="index"
            :level-label="course.sourceSubject?.title || 'تعليم جامعي'"
            :interactive="false"
          />
        </div>
        <nav v-if="coursePage.pagination.lastPage > 1" class="university-pagination" aria-label="صفحات الكورسات الجامعية">
          <button
            v-for="page in coursePage.pagination.lastPage"
            :key="page"
            type="button"
            :class="{ active: page === coursePage.pagination.currentPage }"
            :disabled="coursesLoading"
            @click="loadCourses(page)"
          >
            {{ page }}
          </button>
        </nav>
      </template>
    </div>
  </section>
</template>

<style scoped>
.university-courses { padding:clamp(54px,7vw,96px) 0; background:var(--home-v2-paper); color:var(--home-v2-ink); }
.university-courses__heading { display:grid; grid-template-columns:1fr .8fr; align-items:end; gap:40px; margin-bottom:28px; }
.university-courses__heading span { color:var(--home-v2-coral); font-size:12px; font-weight:900; }
.university-courses__heading h2 { margin:8px 0 0; font:900 clamp(34px,4vw,56px)/1.2 var(--home-v2-heading); }
.university-courses__heading p { margin:0; color:var(--home-v2-muted); line-height:1.9; }
.university-path { display:grid; grid-template-columns:repeat(auto-fit,minmax(190px,1fr)); gap:10px; padding:18px; border:1px solid var(--home-v2-line); background:color-mix(in srgb,var(--home-v2-blue) 6%,var(--home-v2-paper)); }
.university-path label { display:grid; min-width:0; gap:8px; }
.university-path label > span { display:flex; align-items:center; gap:8px; font-size:12px; font-weight:900; }
.university-path b { display:grid; width:30px; height:30px; place-items:center; border:1px solid var(--home-v2-line); color:var(--home-v2-blue); font-size:11px; }
.university-path select,.university-search input { width:100%; min-height:48px; border:1px solid var(--home-v2-line); border-radius:0; outline:0; background:var(--home-v2-surface); color:var(--home-v2-ink); padding:0 12px; font:700 13px var(--home-v2-heading); }
.university-path select:focus,.university-search input:focus { border-color:var(--home-v2-blue); box-shadow:0 0 0 3px color-mix(in srgb,var(--home-v2-blue) 14%,transparent); }
.university-path select:disabled { cursor:not-allowed; opacity:.55; }
.university-search { display:flex; align-items:end; gap:10px; margin:20px 0; padding:16px; border:1px solid var(--home-v2-line); }
.university-search label { display:grid; flex:1; gap:7px; }
.university-search label > span { font-size:12px; font-weight:900; }
.university-search button,.university-courses__state button { min-height:48px; padding:0 22px; border:0; background:var(--home-v2-deep); color:#fff; cursor:pointer; font-weight:900; }
.university-courses__state,.university-courses__empty { display:grid; min-height:190px; place-items:center; align-content:center; gap:8px; margin-top:20px; padding:28px; border:1px dashed var(--home-v2-line); background:var(--home-v2-surface); text-align:center; }
.university-courses__state.is-error { border-color:color-mix(in srgb,var(--home-v2-coral) 55%,transparent); }
.university-courses__state span,.university-courses__empty p { margin:0; color:var(--home-v2-muted); }
.university-courses__result-head { display:flex; align-items:center; justify-content:space-between; gap:18px; margin:28px 0 16px; }
.university-courses__result-head h3 { margin:0; font:900 24px var(--home-v2-heading); }
.university-courses__result-head b { color:var(--home-v2-blue); }
.course-grid { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:22px; }
.university-pagination { display:flex; justify-content:center; flex-wrap:wrap; gap:7px; margin-top:28px; }
.university-pagination button { width:42px; height:42px; border:1px solid var(--home-v2-line); background:var(--home-v2-surface); color:var(--home-v2-ink); cursor:pointer; font-weight:900; }
.university-pagination button.active { border-color:var(--home-v2-deep); background:var(--home-v2-deep); color:#fff; }
@media (max-width:900px) { .university-courses__heading { grid-template-columns:1fr; gap:14px; } .course-grid { grid-template-columns:repeat(2,minmax(0,1fr)); } }
@media (max-width:620px) { .university-path,.course-grid { grid-template-columns:1fr; } .university-search { align-items:stretch; flex-direction:column; } }
</style>
