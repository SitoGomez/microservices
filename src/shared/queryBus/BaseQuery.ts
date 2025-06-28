export abstract class BaseQuery {
  public readonly id: string;

  public constructor() {
    this.id = crypto.randomUUID();
  }
}
