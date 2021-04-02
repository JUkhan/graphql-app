import "reflect-metadata";
import { ID } from "type-graphql";
import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  BeforeInsert,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@ObjectType()
@Entity()
export class Post extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column("text")
  title: string;

  @Field()
  @Column("varchar")
  crearedAt: number;

  @Field()
  @Column("varchar")
  modifiedAt: number;

  @BeforeInsert()
  addDates() {
    this.crearedAt = new Date().getTime();
    this.modifiedAt = new Date().getTime();
  }
}
