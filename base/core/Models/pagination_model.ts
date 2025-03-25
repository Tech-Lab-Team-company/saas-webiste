class PaginationModel {
  public prev: number | null;
  public next: number | null;
  public current: number | null;
  public count: number | null;
  public last: number | null;
  public total: number | null;

  constructor(
    prev: number | null,
    count: number | null,
    next: number | null,
    current: number | null,
    last: number | null,
    total: number | null
  ) {
    this.prev = prev;
    this.next = next;
    this.total = total;
    this.current = current;
    this.count = count;
    this.last = last;
  }

  static fromMap(map: { [key: string]: any }): PaginationModel {
    return new PaginationModel(
      map["from"] ?? 0,
      map["per_page"] ?? 0,
      map["to"] ?? 0,
      map["current_page"] ?? 0,
      map["last_page"] ?? 0,
      map["total"] ?? 0
    );
  }

  public checkAvailablePages(): boolean | undefined {
    if (this.current && this.count) return this.current < this.count;
  }

  public checkAvailableNext(): boolean | undefined {
    if (this.current && this.count) return this.current < this.count;
  }

  public checkAvailablePrev(): boolean | undefined {
    if (this.current && this.count) return this.current > 1;
  }
}

export default PaginationModel;
