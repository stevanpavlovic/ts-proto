import { Observable } from 'rxjs';
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';


export interface BatchQueryRequest {
  ids: string[];
}

export interface BatchQueryResponse {
  entities: Entity[];
}

export interface BatchMapQueryRequest {
  ids: string[];
}

export interface BatchMapQueryResponse {
  entities: { [key: string]: Entity };
}

export interface BatchMapQueryResponse_EntitiesEntry {
  key: string;
  value: Entity | undefined;
}

export interface GetOnlyMethodRequest {
  id: string;
}

export interface GetOnlyMethodResponse {
  entity: Entity | undefined;
}

export interface WriteMethodRequest {
  id: string;
}

export interface WriteMethodResponse {
}

export interface Entity {
  id: string;
  name: string;
}

export interface EntityServiceController<Context extends DataLoaders> {

  batchQuery(ctx: Context, request: BatchQueryRequest): Observable<BatchQueryResponse>;

  batchMapQuery(ctx: Context, request: BatchMapQueryRequest): Observable<BatchMapQueryResponse>;

  /**
   *  Add a method that is not batchable to show it's still cached
   */
  getOnlyMethod(ctx: Context, request: GetOnlyMethodRequest): Observable<GetOnlyMethodResponse>;

  /**
   *  Add a method that won't get cached
   */
  writeMethod(ctx: Context, request: WriteMethodRequest): Observable<WriteMethodResponse>;

}

export interface EntityServiceClient<Context extends DataLoaders> {

  batchQuery(ctx: Context, request: BatchQueryRequest): Observable<BatchQueryResponse>;

  batchMapQuery(ctx: Context, request: BatchMapQueryRequest): Observable<BatchMapQueryResponse>;

  /**
   *  Add a method that is not batchable to show it's still cached
   */
  getOnlyMethod(ctx: Context, request: GetOnlyMethodRequest): Observable<GetOnlyMethodResponse>;

  /**
   *  Add a method that won't get cached
   */
  writeMethod(ctx: Context, request: WriteMethodRequest): Observable<WriteMethodResponse>;

}

export function EntityServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ['batchQuery', 'batchMapQuery', 'getOnlyMethod', 'writeMethod'];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod('EntityService', method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod('EntityService', method)(constructor.prototype[method], method, descriptor);
    }
  }
}

export const BATCHING_PACKAGE_NAME = 'batching'
export const ENTITY_SERVICE_NAME = 'EntityService';