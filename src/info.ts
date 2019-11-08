import { ObjectType, Field } from 'type-graphql';
import { Format } from './format';

@ObjectType()
export class Info {
  @Field({ nullable: true })
  ext: string;

  @Field({ nullable: true })
  extractor: string;

  @Field(type => [Format], { nullable: true })
  formats: Format[];

  @Field({ nullable: true, name: 'fullTitle' })
  fulltitle: string;

  @Field({ nullable: true })
  thumbnail: string;
}
