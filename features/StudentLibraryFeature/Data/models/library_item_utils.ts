export type UnknownRecord = Record<string, unknown>;

export const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export const toText = (value: unknown, fallback = ""): string =>
  typeof value === "string" || typeof value === "number"
    ? String(value).trim()
    : fallback;

export const toNumber = (value: unknown, fallback = 0): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const asRecordArray = (value: unknown): UnknownRecord[] =>
  Array.isArray(value)
    ? value.filter(isRecord)
    : [];

/**
 * Supports the common API response forms: `data: []`, paginated
 * `data: { data: [] }`, and named `courses` / `books` collections.
 */
export const extractLibraryRecords = (value: unknown): UnknownRecord[] => {
  const direct = asRecordArray(value);
  if (direct.length || Array.isArray(value)) return direct;
  if (!isRecord(value)) return [];

  for (const key of ["items", "results", "courses", "books", "data"]) {
    const items = asRecordArray(value[key]);
    if (items.length || Array.isArray(value[key])) return items;
  }

  if (isRecord(value.data)) {
    return extractLibraryRecords(value.data);
  }

  return [];
};

export const nestedRecord = (
  record: UnknownRecord,
  ...keys: string[]
): UnknownRecord => {
  for (const key of keys) {
    if (isRecord(record[key])) return record[key];
  }
  return record;
};

export const imageUrl = (value: unknown): string | null => {
  if (isRecord(value)) {
    return imageUrl(value.img ?? value.url ?? value.src ?? value.image);
  }

  const image = toText(value);
  return image || null;
};
