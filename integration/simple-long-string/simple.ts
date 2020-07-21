//  Adding a comment to the syntax will become the first
//  comment in the output source file.
//
import { ImportedThing } from './import_dir/thing';
import { Observable } from 'rxjs';
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';


/**
 * * Example comment on the Simple message  */
export interface Simple {
  /**
   *  Name field
   */
  name: string;
  /**
   *  Age  */
  age: number;
  /**
   *  This comment will also attach
   */
  createdAt: Date | undefined;
  child: Child | undefined;
  state: StateEnum;
  grandChildren: Child[];
  coins: number[];
  snacks: string[];
  oldStates: StateEnum[];
  /**
   *  A thing (imported from thing)
   */
  thing: ImportedThing | undefined;
}

export interface Child {
  name: string;
  type: Child_Type;
}

export interface Nested {
  name: string;
  message: Nested_InnerMessage | undefined;
  state: Nested_InnerEnum;
}

/**
 *  Comment for a nested message * /
 */
export interface Nested_InnerMessage {
  name: string;
  deep: Nested_InnerMessage_DeepMessage | undefined;
}

export interface Nested_InnerMessage_DeepMessage {
  name: string;
}

export interface OneOfMessage {
  first: string | undefined;
  last: string | undefined;
}

export interface SimpleWithWrappers {
  name: string | undefined;
  age: number | undefined;
  enabled: boolean | undefined;
  coins: number[];
  snacks: string[];
}

export interface Entity {
  id: number;
}

export interface SimpleWithMap {
  entitiesById: { [key: number]: Entity };
  nameLookup: { [key: string]: string };
  intLookup: { [key: number]: number };
}

export interface SimpleWithMap_EntitiesByIdEntry {
  key: number;
  value: Entity | undefined;
}

export interface SimpleWithMap_NameLookupEntry {
  key: string;
  value: string;
}

export interface SimpleWithMap_IntLookupEntry {
  key: number;
  value: number;
}

export interface SimpleWithSnakeCaseMap {
  entitiesById: { [key: number]: Entity };
}

export interface SimpleWithSnakeCaseMap_EntitiesByIdEntry {
  key: number;
  value: Entity | undefined;
}

export interface PingRequest {
  input: string;
}

export interface PingResponse {
  output: string;
}

export interface Numbers {
  double: number;
  float: number;
  int32: number;
  int64: string;
  uint32: number;
  uint64: string;
  sint32: number;
  sint64: string;
  fixed32: number;
  fixed64: string;
  sfixed32: number;
  sfixed64: string;
}

export interface PingServiceController {

  ping(request: PingRequest): Observable<PingResponse>;

}

export interface PingServiceClient {

  ping(request: PingRequest): Observable<PingResponse>;

}

export function PingServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ['ping'];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod('PingService', method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod('PingService', method)(constructor.prototype[method], method, descriptor);
    }
  }
}

export const StateEnum = {
  UNKNOWN: 0 as const,
  ON: 2 as const,
  OFF: 3 as const,
  UNRECOGNIZED: -1 as const,
}

export type StateEnum = 0 | 2 | 3 | -1;

export const Child_Type = {
  UNKNOWN: 0 as const,
  GOOD: 1 as const,
  BAD: 2 as const,
  UNRECOGNIZED: -1 as const,
}

export type Child_Type = 0 | 1 | 2 | -1;

export const Nested_InnerEnum = {
  UNKNOWN_INNER: 0 as const,
  GOOD: 100 as const,
  BAD: 1000 as const,
  UNRECOGNIZED: -1 as const,
}

export type Nested_InnerEnum = 0 | 100 | 1000 | -1;

export const SIMPLE_PACKAGE_NAME = 'simple'
export const PING_SERVICE_NAME = 'PingService';