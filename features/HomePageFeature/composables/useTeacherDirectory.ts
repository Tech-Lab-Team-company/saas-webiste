import { storeToRefs } from "pinia";
import { getWebDomain } from "~/constant/webDomain";
import { HomePageApi, normalizeHomeDataError } from "../api/homePageApi";
import { mapHomeTeachers } from "../mappers/homePageMapper";
import type { HomeTeacherViewModel } from "../models/HomePageViewModel";
import type { HomeSectionState } from "../types/homePage.types";

export const useTeacherDirectory = async () => {
  const settingsStore = useSettingStore();
  const { setting } = storeToRefs(settingsStore);
  const webDomain = getWebDomain();
  const isGeneral = Number(setting.value?.has_general) === 1;
  const api = new HomePageApi(webDomain);

  const { data, pending, error, refresh } = await useAsyncData<
    HomeTeacherViewModel[]
  >(
    `teacher-directory:dynamic-v1:${webDomain}:${isGeneral ? "general" : "education"}`,
    async () => (isGeneral ? mapHomeTeachers(await api.fetchTeachers()) : []),
    {
      default: () => [],
      dedupe: "defer",
    },
  );

  const teachers = computed<HomeSectionState<HomeTeacherViewModel[]>>(() => {
    const items = data.value ?? [];

    if (!isGeneral) return { data: [], status: "empty" };
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
    isGeneral,
    teachers,
    pending,
    refresh,
  };
};
