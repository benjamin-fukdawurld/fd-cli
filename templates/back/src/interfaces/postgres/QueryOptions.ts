import { OrderByOptions, parseOrderOptions } from './OrderByOptions';

export interface QueryOptions {
  columns?: string[];
  filters?: any;
  limit?: number;
  offset?: number;
  orderBy?: OrderByOptions[];
}

export function parseQueryOptions(query: any): QueryOptions {
  const { limit, offset, orderBy } = query;
  return {
    limit: limit ? parseFloat(limit as string) : undefined,
    offset: offset ? parseFloat(offset as string) : undefined,
    orderBy: parseOrderOptions(orderBy as string | undefined),
  };
}

export default { parseQueryOptions };
