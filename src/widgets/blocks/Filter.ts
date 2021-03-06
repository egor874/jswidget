export type FilterList = Filter[] | Filter;

export default interface Filter {
  readonly visible: boolean;
  readonly name: string;
  readonly value?: string;
}
