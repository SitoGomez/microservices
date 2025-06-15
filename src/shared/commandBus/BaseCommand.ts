export abstract class BaseCommand {
  public readonly id: string;

  public constructor() {
    this.id = crypto.randomUUID();
  }
}
