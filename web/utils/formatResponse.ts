import { OperationResult } from "urql";

interface Response<Data> {
  data: Data;
  errors: Record<string, string>;
}
interface Error {
  field: string;
  message: string;
}
export function formatResponse<Data>(
  input: OperationResult,
  rootProp: string,
  resultProp: string
) {
  const res = { data: null, errors: null } as Response<Data>;
  if (input.data) {
    res.data = input.data[rootProp][resultProp];
    if (input.data[rootProp].errors) {
      res.errors = input.data[rootProp].errors.reduce(
        (obj: any, item: Error) => {
          obj[item.field] = item.message;
          return obj;
        },
        {}
      );
    }
  } else if (input.error && input.error.graphQLErrors) {
    if (input.error.graphQLErrors.length) {
      const errors = input.error.graphQLErrors[0] as any;
      res.errors = errors.reduce((obj: any, item: Error) => {
        obj[item.field] = item.message;
        return obj;
      }, {});
    }
  }
  return res;
}
