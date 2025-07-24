export abstract class BaseCommand {
  public readonly id: string;

  public constructor(id: string) {
    this.id = id;
  }
}
