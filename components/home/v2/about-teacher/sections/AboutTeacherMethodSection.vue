<script setup lang="ts">
import { ApiNames } from "~/base/core/networkStructure/apiNames";
import { getWebDomain } from "~/constant/webDomain";

interface StudyProcessStep {
  id: number | string;
  title: string;
  description: string;
}

interface StudyProcessSection {
  title: string;
  description: string;
  steps: StudyProcessStep[];
}

const createEmptyStudyProcess = (): StudyProcessSection => ({
  title: "",
  description: "",
  steps: [],
});

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const toText = (value: unknown): string | null => {
  if (typeof value !== "string") return null;
  const normalized = value.trim();
  return normalized || null;
};

const mapStep = (value: unknown, index: number): StudyProcessStep | null => {
  if (!isRecord(value)) return null;

  const title = toText(value.title ?? value.name ?? value.label);
  const description = toText(
    value.description ?? value.text ?? value.subtitle ?? value.content,
  );

  if (!title || !description) return null;

  return {
    id:
      typeof value.id === "number" || typeof value.id === "string"
        ? value.id
        : index + 1,
    title,
    description,
  };
};

const mapStudyProcess = (value: unknown): StudyProcessSection => {
  const payload = isRecord(value) && "data" in value ? value.data : value;
  const rootItems = Array.isArray(payload) ? payload : [];
  const rootSection = rootItems[rootItems.length - 1];
  const section = isRecord(rootSection)
    ? rootSection
    : isRecord(payload)
      ? payload
      : null;

  if (!section) return createEmptyStudyProcess();

  const nestedSteps =
    section.children ??
    section.steps ??
    section.items ??
    section.principles ??
    section.study_process;
  const directSteps =
    rootItems.length > 1 && !Array.isArray(nestedSteps) ? rootItems : [];
  const stepsSource = Array.isArray(nestedSteps) ? nestedSteps : directSteps;
  const steps = stepsSource
    .map(mapStep)
    .filter((step): step is StudyProcessStep => step !== null);

  return {
    title: toText(section.title) ?? "",
    description: toText(section.description ?? section.text) ?? "",
    steps,
  };
};

const webDomain = getWebDomain();

const { data: studyProcess, pending, error } = await useAsyncData(
  `about-teacher-study-process:${webDomain}`,
  async () => {
    const response = await $fetch<{ data: unknown }>(
      ApiNames.Instance.fetch_study_process,
      {
        method: "POST",
        body: {},
        headers: {
          Accept: "application/json",
          "Accept-Language": "ar",
          "Content-Type": "application/json",
          "web-domain": webDomain,
        },
      },
    );

    return mapStudyProcess(response.data);
  },
  {
    default: createEmptyStudyProcess,
    dedupe: "defer",
  },
);

const hasStudyProcessContent = computed(
  () =>
    !pending.value &&
    !error.value &&
    Boolean(studyProcess.value.title) &&
    studyProcess.value.steps.length > 0,
);
</script>

<template>
  <section
    v-if="hasStudyProcessContent"
    id="study-method"
    class="about-teacher-section about-teacher-method"
    aria-labelledby="study-method-title"
  >
    <div class="container">
      <header class="about-teacher-section__head" data-about-reveal>
        <div>
          <span>نظام الدراسة</span>
          <h2 id="study-method-title">{{ studyProcess.title }}</h2>
        </div>
        <p>{{ studyProcess.description }}</p>
      </header>

      <div class="about-teacher-principles">
        <article v-for="(step, index) in studyProcess.steps" :key="step.id" data-about-reveal>
          <span>{{ String(index + 1).padStart(2, "0") }}</span>
          <h3>{{ step.title }}</h3>
          <p>{{ step.description }}</p>
        </article>
      </div>
    </div>
  </section>

  <!-- Backup empty state: about-teacher study method section.
  <section
    v-else
    id="study-method"
    class="about-teacher-section about-teacher-method"
    aria-labelledby="study-method-title"
  >
    <div class="container about-teacher-method__state" role="status">
      لا توجد بيانات لنظام الدراسة حالياً.
    </div>
  </section>
  -->
</template>
