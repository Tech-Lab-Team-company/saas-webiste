import { storeToRefs } from "pinia";
import { getWebDomain } from "~/constant/webDomain";
import { HomePageApi, normalizeHomeDataError } from "../api/homePageApi";
import { mapHomeTeachers } from "../mappers/homePageMapper";
import type { HomeTeacherViewModel } from "../models/HomePageViewModel";
import type { HomeSectionState } from "../types/homePage.types";
import { supportsTeacherDirectory } from "../types/teacherType";

export const useTeacherDirectory = async () => {
  const settingsStore = useSettingStore();
  const { setting } = storeToRefs(settingsStore);
  const webDomain = getWebDomain();
  const hasTeacherDirectory = supportsTeacherDirectory(setting.value?.type);
  const api = new HomePageApi(webDomain);
  const searchWord = ref("");

  const { data, pending, error, refresh } = await useAsyncData<
    HomeTeacherViewModel[]
  >(
    `teacher-directory:dynamic-v2:${webDomain}:${hasTeacherDirectory ? "center" : "teacher"}`,
    async () =>
      hasTeacherDirectory
        ? mapHomeTeachers(await api.fetchTeachers(searchWord.value))
        : [],
    {
      default: () => [],
      dedupe: "defer",
    },
  );

  const searchTeachers = async (value: string) => {
    const normalizedValue = value.trim();
    if (normalizedValue === searchWord.value) return;

    searchWord.value = normalizedValue;
    await refresh({ dedupe: "cancel" });
  };

  const teachers = computed<HomeSectionState<HomeTeacherViewModel[]>>(() => {
    const items = data.value ?? [];

    if (!hasTeacherDirectory) return { data: [], status: "empty" };
    if (error.value) {
      return {
        data: [],
        status: "error",
        error: normalizeHomeDataError(error.value),
      };
    }

    return {
      data: items,
      status: items.length > 0 ? "success" : "empty",
    };
  });

  return {
    hasTeacherDirectory,
    teachers,
    pending,
    refresh,
    searchWord: readonly(searchWord),
    searchTeachers,
  };
};
