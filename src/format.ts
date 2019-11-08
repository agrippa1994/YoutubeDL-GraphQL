import { ObjectType, Field } from 'type-graphql';

@ObjectType()
export class Format {
  @Field({ nullable: true })
  ext: string;

  @Field({ nullable: true })
  filesize: number;

  @Field({ nullable: true, name: 'formatNote' })
  format_note: string;

  @Field({ nullable: true })
  url: string;
}
