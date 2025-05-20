import { defineStore } from 'pinia';

export const useFiltersStore = defineStore('filters', {
  state: () => ({
    CategryId: null as number | null,
    SelectedEductionType: null as number | null,
    SelectedUniversity: null as number | null,
    SelectedCollege: null as number | null,
    SelectedCollegeDepartment: null as number | null,
    SelectedCollegeDepartmentDivision: null as number | null,
    SelectedSubject: null as number | null
  }),
  actions: {
    updateFilters(filters: any) {
      this.$patch(filters);
    }
  }
});