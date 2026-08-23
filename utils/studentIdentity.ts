export interface StudentIdentitySource {
  name?: string | null;
  firstName?: string | null;
  lastName?: string | null;
}

export interface StudentIdentity {
  fullName: string;
  firstName: string;
  initial: string;
}

const normalizeWhitespace = (value: unknown): string =>
  typeof value === "string" ? value.trim().replace(/\s+/gu, " ") : "";

const stripTrailingPhone = (value: string): string => {
  const match = value.match(/^(.*?)\s+(\+?[\d\s().-]{8,}\d)$/u);
  if (!match) return value;

  const digits = match[2].replace(/\D/gu, "");
  return digits.length >= 10 && digits.length <= 15
    ? normalizeWhitespace(match[1])
    : value;
};

export const resolveStudentIdentity = (
  source: StudentIdentitySource | null | undefined,
): StudentIdentity => {
  if (!source) return { fullName: "", firstName: "", initial: "" };

  const explicitFirstName = normalizeWhitespace(source.firstName);
  const explicitFullName = normalizeWhitespace(
    [source.firstName, source.lastName].filter(Boolean).join(" "),
  );
  const storedFullName = stripTrailingPhone(normalizeWhitespace(source.name));
  const fullName = storedFullName || explicitFullName;
  const firstName = explicitFirstName || fullName.split(" ")[0] || "";
  const initial = Array.from(firstName)[0]?.toLocaleUpperCase() || "";

  return { fullName, firstName, initial };
};
