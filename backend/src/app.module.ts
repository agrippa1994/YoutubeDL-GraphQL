import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { AppResolver } from './app.resolver';

@Module({
  imports: [
    GraphQLModule.forRoot({
      debug: true,
      playground: true,
      autoSchemaFile: true,
    }),
  ],
  controllers: [],
  providers: [AppResolver],
})
export class AppModule {}
