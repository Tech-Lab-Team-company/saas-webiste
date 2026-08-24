import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  TeacherTypeEnum,
  resolveTeacherType,
  supportsTeacherDirectory,
} from "../features/HomePageFeature/types/teacherType.ts";

const readSource = (path: string) =>
  readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("Cairo headings and Tajawal body copy are self-hosted", async () => {
  const [config, fonts, theme, home, regular, black, cairo] = await Promise.all([
    readSource("nuxt.config.ts"),
    readSource("assets/css/fonts.css"),
    readSource("assets/css/app-theme.css"),
    readSource("assets/css/home-v2.css"),
    readFile(
      new URL(
        "../assets/fonts/tajawal/Tajawal-Regular-arabic.woff2",
        import.meta.url,
      ),
    ),
    readFile(
      new URL(
        "../assets/fonts/tajawal/Tajawal-Black-arabic.woff2",
        import.meta.url,
      ),
    ),
    readFile(
      new URL(
        "../assets/fonts/cairo/Cairo-Display-arabic.woff2",
        import.meta.url,
      ),
    ),
  ]);

  assert.match(config, /"@\/assets\/css\/fonts\.css"/u);
  assert.match(fonts, /font-family: "Tajawal"/u);
  assert.match(fonts, /font-family: "Cairo"/u);
  assert.match(fonts, /font-weight: 700 900/u);
  assert.match(fonts, /font-weight: 800/u);
  assert.match(fonts, /font-weight: 900/u);
  assert.match(fonts, /font-display: swap/u);
  assert.doesNotMatch(fonts, /https?:\/\//u);
  assert.match(theme, /font-family: "Tajawal", Tahoma, Arial, sans-serif/u);
  assert.match(home, /--home-v2-heading: "Cairo", "Tajawal"/u);
  assert.match(home, /--home-v2-body: "Tajawal"/u);
  assert.equal(regular.subarray(0, 4).toString("ascii"), "wOF2");
  assert.equal(black.subarray(0, 4).toString("ascii"), "wOF2");
  assert.equal(cairo.subarray(0, 4).toString("ascii"), "wOF2");
});

test("homepage hero always exposes the course and about actions", async () => {
  const hero = await readSource(
    "components/home/v2/sections/HomeHeroSection.vue",
  );

  assert.match(hero, /class="home-v2-hero__primary"[\s\S]*to="\/#courses"/u);
  assert.match(hero, /اختار صفك/u);
  assert.match(hero, /class="home-v2-hero__secondary"[\s\S]*to="\/about-teacher"/u);
  assert.match(hero, /const heroAboutLabel = computed/u);
  assert.doesNotMatch(
    hero,
    /v-if="heroContent\.link" class="home-v2-hero__actions"/u,
  );
});

test("web status cache is isolated by tenant domain", async () => {
  const [app, settingStore, mapper] = await Promise.all([
    readSource("app.vue"),
    readSource("stores/setting.ts"),
    readSource("features/HomePageFeature/mappers/homePageMapper.ts"),
  ]);

  assert.match(app, /`web-status:\$\{webDomain \|\| "default"\}`/u);
  assert.match(app, /if \(webStatus\.value\) SettingStore\.setSetting\(webStatus\.value\)/u);
  assert.match(app, /else SettingStore\.clearSetting\(\)/u);
  assert.doesNotMatch(settingStore, /persist:\s*true/u);
  assert.match(mapper, /value\.replace\(\/\\r\\n\?\/gu, '\\n'\)\.trim\(\)/u);
});

test("route transitions do not depend on the browser DOM update timeout", async () => {
  const [config, transition, theme] = await Promise.all([
    readSource("nuxt.config.ts"),
    readSource("components/Global/AppRouteTransition.vue"),
    readSource("assets/css/app-theme.css"),
  ]);

  assert.doesNotMatch(config, /viewTransition:\s*true/u);
  assert.doesNotMatch(transition, /startViewTransition|supportsNativeViewTransition/u);
  assert.doesNotMatch(theme, /view-transition-name/u);
  assert.match(transition, /nuxtApp\.hook\("page:start", revealTransition\)/u);
  assert.match(transition, /nuxtApp\.hook\("page:finish", hideTransition\)/u);
  assert.match(transition, /router\.beforeEach/u);
  assert.match(transition, /router\.afterEach/u);
  assert.match(transition, /لحظة واحدة من فضلك/u);
  assert.doesNotMatch(
    transition,
    /\.app-route-transition\s*\{\s*display:\s*none\s*!important/u,
  );
});

test("web-status teacher types expose the correct center capabilities", () => {
  assert.equal(resolveTeacherType(1), TeacherTypeEnum.CENTER);
  assert.equal(resolveTeacherType("2"), TeacherTypeEnum.TEACHER);
  assert.equal(resolveTeacherType(3), TeacherTypeEnum.CENTER_TEACHER);
  assert.equal(resolveTeacherType(9), null);
  assert.equal(supportsTeacherDirectory(TeacherTypeEnum.CENTER), true);
  assert.equal(supportsTeacherDirectory(TeacherTypeEnum.TEACHER), false);
  assert.equal(supportsTeacherDirectory(TeacherTypeEnum.CENTER_TEACHER), true);
});

test("center mode loads both education taxonomy and the public catalog fallback", async () => {
  const [homePage, mapper] = await Promise.all([
    readSource("features/HomePageFeature/composables/useHomePage.ts"),
    readSource("features/HomePageFeature/mappers/homePageMapper.ts"),
  ]);

  assert.match(homePage, /supportsTeacherDirectory\(setting\.value\?\.type\)/u);
  assert.doesNotMatch(homePage, /has_general/u);
  assert.match(homePage, /api\.fetchStages\(\)/u);
  assert.match(homePage, /api\.fetchPublicCourseCatalog\(1, 9, initialTeacherId, initialWord\)/u);
  assert.match(mapper, /teacherType: resolveTeacherType\(settings\.type\)/u);
  assert.match(mapper, /hasTeacherDirectory: supportsTeacherDirectory\(settings\.type\)/u);
});

test("center course UI prefers stages and falls back to the public catalog", async () => {
  const [section, card] = await Promise.all([
    readSource("components/home/v2/sections/HomeCoursesSection.vue"),
    readSource("components/home/v2/HomeCourseCard.vue"),
  ]);

  assert.match(section, /v-if="!isGeneralMode" class="home-course-picker"/u);
  assert.match(section, /props\.courses\.data\.taxonomyStatus !== "success"/u);
  assert.match(section, /كورسات المدرسين/u);
  assert.match(card, /course\.teacher\?\.name \|\| course\.sourceSubject/u);
});

test("homepage automatically opens the first education year that has courses", async () => {
  const section = await readSource(
    "components/home/v2/sections/HomeCoursesSection.vue",
  );

  assert.match(section, /const autoSelectHomepageCourseTab = async \(\) =>/u);
  assert.match(
    section,
    /props\.catalog \|\|[\s\S]*isGeneralMode\.value[\s\S]*selectedTabKey\.value !== null/u,
  );
  assert.match(section, /for \(const tab of props\.courses\.data\.tabs\)/u);
  assert.match(section, /await selectTab\(tab\.key, undefined, 1, true\)/u);
  assert.match(section, /if \(result\?\.data\.courses\.length\)/u);
  assert.match(section, /if \(!props\.catalog\) \{[\s\S]*void autoSelectHomepageCourseTab\(\)/u);
});

test("course catalog filters by teacher through the API and shareable URL", async () => {
  const [api, homePage, section, coursePage, teacherPage] = await Promise.all([
    readSource("features/HomePageFeature/api/homePageApi.ts"),
    readSource("features/HomePageFeature/composables/useHomePage.ts"),
    readSource("components/home/v2/sections/HomeCoursesSection.vue"),
    readSource("pages/course/index.vue"),
    readSource("pages/teachers/[id].vue"),
  ]);

  assert.match(api, /fetchPublicCourseCatalog\([\s\S]*teacherId: number \| null = null/u);
  assert.match(api, /teacher_id: teacherId/u);
  assert.match(homePage, /api\.fetchCoursesByYear\(stageId, yearId, page, perPage, teacherId, word\)/u);
  assert.match(homePage, /api\.fetchPublicCourseCatalog\(page, perPage, teacherId, word\)/u);
  assert.match(homePage, /course\.teacher\?\.id === teacherId/u);
  assert.match(section, /route\.query\.teacher_id/u);
  assert.match(section, /@click="selectTeacher\(teacher\.id\)"/u);
  assert.match(section, /selectedTeacherId\.value/u);
  assert.match(coursePage, /initialTeacherId/u);
  assert.match(teacherPage, /query: \{ teacher_id: String\(teacher\.id\) \}/u);
});

test("course catalog sends its search word to filter_courses and keeps it in the URL", async () => {
  const [api, section, coursePage] = await Promise.all([
    readSource("features/HomePageFeature/api/homePageApi.ts"),
    readSource("components/home/v2/sections/HomeCoursesSection.vue"),
    readSource("pages/course/index.vue"),
  ]);

  assert.match(api, /ApiNames\.Instance\.filter_courses[\s\S]*word,[\s\S]*page/u);
  assert.match(section, /v-model="searchWord"/u);
  assert.match(section, /v-if="catalog && \(isGeneralMode \|\| selectedTab\)"/u);
  assert.doesNotMatch(section, /props\.courses\.data\.tabs\[0\]/u);
  assert.match(section, /route\.query\.word/u);
  assert.match(section, /loadGeneralCourses\([\s\S]*normalizedWord/u);
  assert.match(section, /loadCoursesByYear\([\s\S]*searchWord\.value/u);
  assert.match(coursePage, /initialWord/u);
});

test("book filters preserve scroll position while pagination returns to the top", async () => {
  const booksPage = await readSource("pages/books/index.vue");

  assert.match(booksPage, /watch\(currentPage, \(\) => \{/u);
  assert.doesNotMatch(
    booksPage,
    /watch\(\[currentPage, currentSubjectId, currentYearId\]/u,
  );
  assert.match(
    booksPage,
    /watch\(currentPage,[\s\S]*window\.scrollTo\(\{ top: 0, behavior: "smooth" \}\)/u,
  );
});

test("optional home sections stay hidden when their API content is empty", async () => {
  const [
    home,
    books,
    blogs,
    journey,
    cta,
    teachers,
    aboutTeacher,
    faq,
    studyMethod,
    topStudents,
  ] = await Promise.all([
    readSource("components/home/v2/HomeV2.vue"),
    readSource("components/home/v2/sections/HomeBooksSection.vue"),
    readSource("components/home/v2/sections/HomeBlogSection.vue"),
    readSource("components/Home/v2/sections/HomeLearningJourneySection.vue"),
    readSource("components/home/v2/sections/HomeCtaSection.vue"),
    readSource("components/home/v2/sections/HomeTeachersSection.vue"),
    readSource("components/Home/v2/sections/HomeAboutTeacherSection.vue"),
    readSource("components/home/v2/sections/HomeFaqSection.vue"),
    readSource(
      "components/home/v2/about-teacher/sections/AboutTeacherMethodSection.vue",
    ),
    readSource(
      "components/home/v2/about-teacher/sections/AboutTeacherOurStudents.vue",
    ),
  ]);

  assert.match(home, /props\.home\.books\.status === 'success'/u);
  assert.match(home, /props\.home\.blogs\.status === 'success'/u);
  assert.match(home, /props\.home\.learningJourney\.status === 'success'/u);
  assert.match(home, /props\.home\.cta\.status === 'success'/u);
  assert.match(home, /props\.home\.teachers\.status === 'success'/u);
  assert.match(home, /props\.home\.aboutTeacher\.status === 'success'/u);
  assert.match(home, /class="home-v2__closing-sections"/u);
  const coursesPosition = home.indexOf("<LazyHomeV2SectionsHomeCoursesSection");
  const booksPosition = home.indexOf("<LazyHomeV2SectionsHomeBooksSection");
  const blogPosition = home.indexOf("<LazyHomeV2SectionsHomeBlogSection");
  const journeyPosition = home.indexOf(
    "<LazyHomeV2SectionsHomeLearningJourneySection",
  );
  const teachersPosition = home.indexOf("<LazyHomeV2SectionsHomeTeachersSection");
  const aboutTeacherPosition = home.indexOf(
    "<LazyHomeV2SectionsHomeAboutTeacherSection",
  );
  const appPosition = home.indexOf("<LazyHomeV2SectionsHomeAppSection");
  const faqPosition = home.indexOf("<LazyHomeV2SectionsHomeFaqSection");
  const ctaPosition = home.indexOf("<LazyHomeV2SectionsHomeCtaSection");
  const faqTag = home.slice(faqPosition, home.indexOf("/>", faqPosition) + 2);
  assert.ok(
    coursesPosition < booksPosition &&
      booksPosition < blogPosition &&
      blogPosition < journeyPosition &&
      journeyPosition < teachersPosition &&
      teachersPosition < aboutTeacherPosition &&
      aboutTeacherPosition < appPosition &&
      appPosition < faqPosition &&
      faqPosition < ctaPosition,
    "home sections should keep their original order",
  );
  assert.match(
    home,
    /\.home-v2__closing-sections \{[\s\S]*display: flex;[\s\S]*gap:[\s\S]*padding-block:/u,
  );
  assert.match(
    home,
    /--home-v2-closing-surface-start:[\s\S]*var\(--home-v2-paper\)/u,
  );
  assert.match(
    home,
    /:deep\(\.home-v2-app\) \+ \.home-v2__closing-sections/u,
  );
  assert.match(
    home,
    /\.home-v2__closing-sections :deep\(\.home-v2-faq\),[\s\S]*background: transparent;/u,
  );
  assert.match(home, /:not\(:has\(> section\)\)/u);
  assert.match(home, /:deep\(\.home-v2-faq\)/u);
  assert.doesNotMatch(
    faqTag,
    /hydrate-on-visible/u,
    "the API-backed FAQ must not stay blank while waiting for visibility hydration",
  );
  assert.match(books, /v-if="books\.status === 'success' && featuredBook"/u);
  assert.match(blogs, /v-if="blogs\.status === 'success' && visibleBlogs\.length"/u);
  assert.match(journey, /v-if="hasJourneyContent"/u);
  assert.match(journey, /--journey-accent-source: var\(/u);
  assert.match(journey, /--home-v2-deep,/u);
  assert.doesNotMatch(journey, /#1682ff/u);
  assert.match(cta, /v-if="hasCtaContent"/u);
  assert.match(cta, /\.home-v2-cta \{[\s\S]*padding: 0;/u);
  assert.doesNotMatch(cta, /:global\(\.home-v2-faq\)/u);
  assert.match(teachers, /catalog \|\| teachers\.status === 'success'/u);
  assert.match(aboutTeacher, /v-if="hasAboutContent"/u);
  assert.match(faq, /v-if="hasFaqContent"/u);
  assert.match(faq, /<details\s+v-for="\(faq, index\) in faqs"/u);
  assert.doesNotMatch(
    faq,
    /<template>\s*<details\s+v-for="\(faq, index\) in faqs"/u,
    "the FAQ loop must not add fragment markers that break hydration",
  );
  assert.match(
    faq,
    /\.home-v2-faq \{[\s\S]*var\(--home-v2-paper\)[\s\S]*var\(--home-v2-cream\)/u,
  );
  assert.match(studyMethod, /v-if="hasStudyProcessContent"/u);
  assert.match(topStudents, /v-if="hasAnyTopStudents"/u);
  assert.match(topStudents, /all-top-students:/u);
  for (const source of [
    books,
    blogs,
    journey,
    cta,
    teachers,
    aboutTeacher,
    faq,
    studyMethod,
    topStudents,
  ]) {
    assert.match(source, /Backup empty state:/u);
  }
});

test("centers load a branded teacher directory from fetch_teachers", async () => {
  const [api, directory, page, teacherSection, header, sitemap] =
    await Promise.all([
      readSource("features/HomePageFeature/api/homePageApi.ts"),
      readSource(
        "features/HomePageFeature/composables/useTeacherDirectory.ts",
      ),
      readSource("pages/teachers/index.vue"),
      readSource("components/home/v2/sections/HomeTeachersSection.vue"),
      readSource("components/home/v2/sections/HomeHeaderSection.vue"),
      readSource("server/routes/sitemap.xml.ts"),
    ]);

  assert.match(api, /async fetchTeachers\(searchWord = ""\): Promise<unknown>/u);
  assert.match(api, /method: "GET"/u);
  assert.match(api, /\{ word: searchWord \}/u);
  assert.match(directory, /supportsTeacherDirectory\(setting\.value\?\.type\)/u);
  assert.match(
    directory,
    /mapHomeTeachers\(await api\.fetchTeachers\(searchWord\.value\)\)/u,
  );
  assert.match(directory, /refresh\(\{ dedupe: "cancel" \}\)/u);
  assert.match(page, /<HomeTeachersSection/u);
  assert.match(teacherSection, /مدرسينا/u);
  assert.match(teacherSection, /var\(--home-v2-blue\)/u);
  assert.match(teacherSection, /v-model="searchQuery"/u);
  assert.match(teacherSection, /emit\("search", searchQuery\.value\.trim\(\)\)/u);
  assert.doesNotMatch(teacherSection, /sortBy/u);
  assert.match(header, /label: "المدرسون", to: "\/teachers"/u);
  assert.match(sitemap, /path: "\/teachers"/u);
  assert.match(sitemap, /path: `\/teachers\/\$\{teacher\.id\}`/u);
});

test("teacher cards open API-backed teacher detail pages", async () => {
  const [api, mapper, cards, detailsPage, layout] = await Promise.all([
    readSource("features/HomePageFeature/api/homePageApi.ts"),
    readSource("features/HomePageFeature/mappers/homePageMapper.ts"),
    readSource("components/home/v2/sections/HomeTeachersSection.vue"),
    readSource("pages/teachers/[id].vue"),
    readSource("layouts/home-v2.vue"),
  ]);

  assert.match(api, /async fetchTeacherDetails\(teacherId: number\)/u);
  assert.match(api, /teacher_id: teacherId/u);
  assert.match(mapper, /export const mapHomeTeacher =/u);
  assert.match(cards, /:to="`\/teachers\/\$\{teacher\.id\}`"/u);
  assert.match(detailsPage, /api\.fetchTeacherDetails\(teacherId\)/u);
  assert.match(detailsPage, /mapHomeTeacher/u);
  assert.match(layout, /<HomeFooterSection :site="site" \/>/u);
  const app = await readSource("app.vue");
  assert.match(app, /route\.path\.startsWith\("\/teachers\/"\)/u);
  await assert.rejects(readSource("pages/teachers.vue"), /ENOENT/u);
  assert.doesNotMatch(layout, /hydrate-on-visible/u);
});
