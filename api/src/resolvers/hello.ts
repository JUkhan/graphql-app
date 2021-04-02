import "reflect-metadata";
import { Arg, Query, Resolver } from "type-graphql";

@Resolver()
export class HelloResolver {
  @Query(() => String)
  hello(@Arg("name") name: string): string {
    return `hello ${name}`;
  }
}
