type UnknownRecord = Record<string, unknown>;

export interface QuestionBankContentImage {
  img: string;
  alt: string;
}

export interface QuestionBankAnswer {
  id: number;
  text: string;
  image: string | null;
  isCorrect: boolean | null;
}

export interface QuestionBankQuestion {
  id: number;
  text: string;
  image: string | null;
  explanation: string;
  sectionTitle: string;
  selectedAnswerId: number | null;
  answers: QuestionBankAnswer[];
}

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const toText = (value: unknown): string =>
  typeof value === "string" || typeof value === "number"
    ? String(value).trim()
    : "";

const toNumber = (value: unknown, fallback = 0): number => {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
};

const toNullableNumber = (value: unknown): number | null => {
  if (value === null || value === undefined || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : null;
};

const toNullableBoolean = (value: unknown): boolean | null => {
  if (value === null || value === undefined || value === "") return null;
  if (value === true || value === 1 || value === "1" || value === "true") {
    return true;
  }
  if (value === false || value === 0 || value === "0" || value === "false") {
    return false;
  }
  return null;
};

const imageUrl = (value: unknown): string | null => {
  const source = isRecord(value)
    ? toText(value.img ?? value.src ?? value.url)
    : toText(value);
  if (!source) return null;
  if (source.startsWith("/")) return source;

  try {
    const url = new URL(source);
    return ["http:", "https:"].includes(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
};

const mapImage = (value: unknown): QuestionBankContentImage | null => {
  const img = imageUrl(value);
  if (!img) return null;
  return {
    img,
    alt: isRecord(value) ? toText(value.alt) : "",
  };
};

const mapAnswer = (value: unknown, index: number): QuestionBankAnswer | null => {
  if (!isRecord(value)) return null;
  const text = toText(value.answer ?? value.title ?? value.text ?? value.content);
  const image = imageUrl(value.image);
  if (!text && !image) return null;

  return {
    id: toNumber(value.id, index + 1),
    text,
    image,
    isCorrect: toNullableBoolean(
      value.is_correct ?? value.correct ?? value.isCorrect,
    ),
  };
};

const selectedAnswerId = (question: UnknownRecord): number | null => {
  const directAnswer =
    question.selected_answer_id
    ?? question.student_answer_id
    ?? question.user_answer_id
    ?? question.submitted_answer_id;
  const directId = toNullableNumber(directAnswer);
  if (directId) return directId;

  const answers = Array.isArray(question.answers) ? question.answers : [];
  const selectedAnswer = answers.find(
    (answer) =>
      isRecord(answer)
      && toNullableBoolean(answer.is_selected ?? answer.selected) === true,
  );
  return isRecord(selectedAnswer) ? toNullableNumber(selectedAnswer.id) : null;
};

const mapQuestion = (
  value: unknown,
  index: number,
  sectionTitle = "",
): QuestionBankQuestion | null => {
  if (!isRecord(value)) return null;
  const text = toText(
    value.question ?? value.title ?? value.text ?? value.content,
  );
  const image = imageUrl(value.image);
  if (!text && !image) return null;

  const answersSource = Array.isArray(value.answers)
    ? value.answers
    : Array.isArray(value.options)
      ? value.options
      : Array.isArray(value.choices)
        ? value.choices
        : [];

  return {
    id: toNumber(value.id, index + 1),
    text,
    image,
    explanation: toText(
      value.explanation ?? value.explain ?? value.answer_explanation,
    ),
    sectionTitle: sectionTitle || toText(value.section_title ?? value.section),
    selectedAnswerId: selectedAnswerId(value),
    answers: answersSource
      .map(mapAnswer)
      .filter((answer): answer is QuestionBankAnswer => answer !== null),
  };
};

const extractQuestions = (value: unknown): QuestionBankQuestion[] => {
  const source = Array.isArray(value) ? value : [];
  const questions: QuestionBankQuestion[] = [];

  source.forEach((item, itemIndex) => {
    if (!isRecord(item)) return;
    const nestedQuestions = Array.isArray(item.questions)
      ? item.questions
      : Array.isArray(item.items)
        ? item.items
        : null;

    if (nestedQuestions) {
      const sectionTitle = toText(item.title ?? item.name ?? item.section_title);
      nestedQuestions.forEach((question) => {
        const mapped = mapQuestion(question, questions.length, sectionTitle);
        if (mapped) questions.push(mapped);
      });
      return;
    }

    const mapped = mapQuestion(item, itemIndex);
    if (mapped) questions.push(mapped);
  });

  return questions;
};

export default class QuestionBankContentModel {
  id: number;
  title: string;
  description: string;
  image: QuestionBankContentImage | null;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  remainingQuestions: number;
  questions: QuestionBankQuestion[];

  constructor(
    id: number,
    title: string,
    description: string,
    image: QuestionBankContentImage | null,
    totalQuestions: number,
    correctAnswers: number,
    wrongAnswers: number,
    remainingQuestions: number,
    questions: QuestionBankQuestion[],
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.image = image;
    this.totalQuestions = totalQuestions;
    this.correctAnswers = correctAnswers;
    this.wrongAnswers = wrongAnswers;
    this.remainingQuestions = remainingQuestions;
    this.questions = questions;
  }

  static fromMap(value: unknown): QuestionBankContentModel {
    const root = isRecord(value) ? value : {};
    const nestedData = isRecord(root.data) ? root.data : null;
    const data = nestedData ?? root;
    const bank = isRecord(data.question_bank)
      ? data.question_bank
      : isRecord(data.bank)
        ? data.bank
        : data;
    const questionsSource = Array.isArray(value)
      ? value
      : data.questions
        ?? data.question_bank_questions
        ?? data.items
        ?? bank.questions
        ?? [];
    const questions = extractQuestions(questionsSource);
    const totalQuestions = Math.max(
      questions.length,
      toNumber(
        data.all_questions
        ?? data.total_questions
        ?? bank.all_questions
        ?? bank.total_questions,
      ),
    );
    const correctAnswers = toNumber(
      data.correct_answers ?? bank.correct_answers,
    );
    const wrongAnswers = toNumber(data.wrong_answers ?? bank.wrong_answers);

    return new QuestionBankContentModel(
      toNumber(bank.id ?? data.question_bank_id),
      toText(bank.title ?? data.title) || "بنك الأسئلة",
      toText(bank.description ?? data.description),
      mapImage(bank.image ?? data.image),
      totalQuestions,
      correctAnswers,
      wrongAnswers,
      Math.max(
        0,
        toNumber(
          data.rest_questions
          ?? data.remaining_questions
          ?? bank.rest_questions
          ?? bank.remaining_questions,
          totalQuestions - correctAnswers - wrongAnswers,
        ),
      ),
      questions,
    );
  }
}
