

export interface PleaseChoose {
  name: string;
  /**
   *  Use this if you want a number. Numbers are great. Who doesn't
   *  like them?
   */
  aNumber: number | undefined;
  /**
   *  Use this if you want a string. Strings are also nice. Not as
   *  nice as numbers, but what are you going to do...
   */
  aString: string | undefined;
  aMessage: PleaseChoose_Submessage | undefined;
  /**
   *  We also added a bool option! This was added after the 'age'
   *  field, so it has a higher number.
   */
  aBool: boolean | undefined;
  bunchaBytes: Uint8Array | undefined;
  age: number;
  either: string | undefined;
  or: string | undefined;
  thirdOption: string | undefined;
}

export interface PleaseChoose_Submessage {
  name: string;
}

export const ONEOF_PACKAGE_NAME = 'oneof'