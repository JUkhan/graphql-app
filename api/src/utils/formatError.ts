import { GraphQLError } from "graphql";

export function formatError(err: GraphQLError) {
  if (err?.extensions?.exception?.validationErrors) {
    return err.extensions.exception.validationErrors.reduce(
      (acc: any[], el: any) => {
        acc.push({
          field: el.property,
          message: Object.keys(el.constraints).reduce(
            (res, key) => res + el.constraints[key],
            ""
          ),
        });
        return acc;
      },
      []
    );
  }
  return err;
}
