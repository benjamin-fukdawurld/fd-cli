export interface OrderByOptions {
  column: string;
  order?: 'asc' | 'desc';
}

export function parseOrderOptions(orderBy?: string): OrderByOptions[] | undefined {
  return orderBy?.split(',').map((field: string): OrderByOptions => {
    const [column, dir] = field.split(' ');
    let order: 'asc' | 'desc' | undefined;
    if (dir) {
      if (dir === 'a') {
        order = 'asc';
      } else if (dir === 'd') {
        order = 'desc';
      }
    }

    return {
      column,
      order,
    };
  });
}

export default { parseOrderOptions };
