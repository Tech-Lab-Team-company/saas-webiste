export enum CategoryIdEnum {
    BASIC = 1,
    UNIVERSITY = 2,
    GENERAL = 3,
}

/** @deprecated Use CategoryIdEnum for new code. */
export const StudentCategoryEnum = {
    base: CategoryIdEnum.BASIC,
    university: CategoryIdEnum.UNIVERSITY,
    general: CategoryIdEnum.GENERAL,
} as const;
