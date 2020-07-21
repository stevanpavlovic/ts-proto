

export interface Issue56 {
  test: EnumWithoutZero;
}

export const EnumWithoutZero = {
  A: 1 as const,
  B: 2 as const,
  UNRECOGNIZED: -1 as const,
}

export type EnumWithoutZero = 1 | 2 | -1;

export const SIMPLE_PACKAGE_NAME = 'simple'