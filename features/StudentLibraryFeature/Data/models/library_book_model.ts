import {
  imageUrl,
  nestedRecord,
  toNumber,
  toText,
  type UnknownRecord,
} from "./library_item_utils";

export default class LibraryBookModel {
  constructor(
    public readonly id: number,
    public readonly title: string,
    public readonly description: string,
    public readonly image: string | null,
    public readonly pageCount: number,
  ) {}

  static fromMap(record: UnknownRecord): LibraryBookModel | null {
    const book = nestedRecord(record, "book", "favoritable", "favoriteable", "item");
    const id = toNumber(record.book_id ?? book.id ?? record.id, -1);
    const title = toText(book.title ?? record.title ?? record.name);
    if (id < 0 || !title) return null;

    return new LibraryBookModel(
      id,
      title,
      toText(book.description ?? book.subtitle ?? record.description ?? record.subtitle),
      imageUrl(book.image ?? record.image),
      Math.max(0, toNumber(book.number_of_pages ?? book.page_count ?? record.number_of_pages ?? record.page_count)),
    );
  }
}
