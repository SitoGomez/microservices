export interface IQueryHandler<TQuery, TResult = void> {
  execute(query: TQuery): Promise<TResult>;
}
