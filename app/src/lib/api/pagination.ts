export interface PaginationParams {
  limit: number;
  offset: number;
}

export interface PaginationValidationError {
  message: string;
  details: string;
}

interface ParsePaginationOptions {
  defaultLimit?: number;
  maxLimit?: number;
  defaultOffset?: number;
}

export function parsePaginationParams(
  searchParams: URLSearchParams,
  options: ParsePaginationOptions = {}
): { success: true; data: PaginationParams } | { success: false; error: PaginationValidationError } {
  const defaultLimit = options.defaultLimit ?? 20;
  const maxLimit = options.maxLimit ?? 100;
  const defaultOffset = options.defaultOffset ?? 0;

  const limitRaw = searchParams.get('limit');
  const offsetRaw = searchParams.get('offset');

  const limit = limitRaw === null ? defaultLimit : Number(limitRaw);
  const offset = offsetRaw === null ? defaultOffset : Number(offsetRaw);

  if (!Number.isInteger(limit) || limit < 1 || limit > maxLimit) {
    return {
      success: false,
      error: {
        message: 'Invalid limit parameter',
        details: `limit must be an integer between 1 and ${maxLimit}`,
      },
    };
  }

  if (!Number.isInteger(offset) || offset < 0) {
    return {
      success: false,
      error: {
        message: 'Invalid offset parameter',
        details: 'offset must be a non-negative integer',
      },
    };
  }

  return {
    success: true,
    data: { limit, offset },
  };
}
