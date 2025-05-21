export class Note {
  private constructor(
    public id: string,
    public title: string,
    public description: string,
    public createdAt: number,
    public updatedAt: number,
  ) {}

  public static create(
    id: string,
    title: string,
    description: string,
    currentTime: number,
  ): Note {
    return new Note(id, title, description, currentTime, currentTime);
  }
}
