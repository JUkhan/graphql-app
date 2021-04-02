import "reflect-metadata";
import { Field, ID, ObjectType, Root } from "type-graphql";
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@ObjectType("User")
@Entity()
export class AppUser extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  firstName: string;

  @Field()
  @Column()
  lastName: string;

  @Field()
  @Column("varchar", { unique: true, length: 255 })
  email: string;

  @Field()
  @Column("varchar", { unique: true, length: 255 })
  userName: string;

  @Field()
  fullName(@Root() parent: AppUser): string {
    return `${parent.firstName} ${parent.lastName}`;
  }

  @Column()
  password: string;
}
