import "reflect-metadata";
import { Post } from "./../entity/post";
import { Arg, Mutation, Query, Resolver } from "type-graphql";

@Resolver(() => Post)
export class PostResolver {
  @Query(() => [Post])
  async allPost(): Promise<Post[]> {
    const res = await Post.find();
    return res;
  }
  @Mutation(() => Post)
  async addPost(@Arg("title") title: string) {
    const post = new Post();
    post.title = title;
    return await Post.save(post);
  }
  @Mutation(() => Boolean)
  async updatePost(@Arg("id") id: string, @Arg("title") title: string) {
    const post = await Post.findOne(id);
    if (post) {
      post.title = title;
      post.modifiedAt = new Date().getTime();
      Post.save(post);
      return true;
    }
    return false;
  }
  @Mutation(() => Post)
  async deletePost(@Arg("id") id: string) {
    const post = await Post.findOne(id);
    if (post) {
      await Post.remove(post);
      return true;
    }
    return false;
  }
  @Mutation(() => Post, { nullable: true })
  async findPost(@Arg("id") id: string): Promise<Post | undefined> {
    return await Post.findOne(id);
  }
}
