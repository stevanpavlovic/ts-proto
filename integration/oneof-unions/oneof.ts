

export interface PleaseChoose {
  name: string;
  /**
   *  Please to be choosing one of the fields within this oneof clause.
   *  This text exists to ensure we transpose comments correctly.
   *
   * a_number
   *  Use this if you want a number. Numbers are great. Who doesn't
   *  like them?
   *
   * a_string
   *  Use this if you want a string. Strings are also nice. Not as
   *  nice as numbers, but what are you going to do...
   *
   * a_bool
   *  We also added a bool option! This was added after the 'age'
   *  field, so it has a higher number.
   */
  choice?: { $case: 'aNumber', aNumber: number } | { $case: 'aString', aString: string } | { $case: 'aMessage', aMessage: PleaseChoose_Submessage } | { $case: 'aBool', aBool: boolean } | { $case: 'bunchaBytes', bunchaBytes: Uint8Array };
  age: number;
  eitherOr?: { $case: 'either', either: string } | { $case: 'or', or: string } | { $case: 'thirdOption', thirdOption: string };
}

export interface PleaseChoose_Submessage {
  name: string;
}

export const ONEOF_PACKAGE_NAME = 'oneof'