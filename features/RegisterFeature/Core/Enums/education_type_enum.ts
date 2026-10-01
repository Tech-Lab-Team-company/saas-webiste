export enum CategoryIdEnum {
    BASIC = 1,
    UNIVERSITY = 2,
    GENERAL = 3,
}

export const resolveEducationCategoryId = (
    categories: readonly unknown[] | null | undefined,
    stageId: number | null,
    yearId: number | null,
): CategoryIdEnum.BASIC | CategoryIdEnum.UNIVERSITY => {
    const categoryIds = (categories ?? []).map(Number);
    const hasBasicEducationSelection = [stageId, yearId].some(
        (value) => Number.isInteger(value) && Number(value) > 0,
    );

    if (
        hasBasicEducationSelection &&
        categoryIds.includes(CategoryIdEnum.BASIC)
    ) {
        return CategoryIdEnum.BASIC;
    }

    if (categoryIds.includes(CategoryIdEnum.UNIVERSITY)) {
        return CategoryIdEnum.UNIVERSITY;
    }

    return CategoryIdEnum.BASIC;
};

/** @deprecated Use CategoryIdEnum for new code. */
export const StudentCategoryEnum = {
    base: CategoryIdEnum.BASIC,
    university: CategoryIdEnum.UNIVERSITY,
    general: CategoryIdEnum.GENERAL,
} as const;
