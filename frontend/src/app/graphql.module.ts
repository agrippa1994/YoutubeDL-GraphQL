import {NgModule} from '@angular/core';
import {ApolloModule, APOLLO_OPTIONS} from 'apollo-angular';
import {HttpLinkModule, HttpLink} from 'apollo-angular-link-http';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {persistCache} from 'apollo-cache-persist';
import ApolloLinkTimeout from 'apollo-link-timeout';

// const uri = 'https://ytdl.mani94.space/graphql'; // <-- add the URL of the GraphQL server here
const uri = '/graphql'; // <-- add the URL of the GraphQL server here

const cache = new InMemoryCache();
const timeoutLink = new ApolloLinkTimeout(15000);

persistCache({
  cache: cache,
  storage: window.localStorage,
});

export function createApollo(httpLink: HttpLink) {
  return {
    link: timeoutLink.concat(httpLink.create({uri})),
    cache: cache,
  };
}

@NgModule({
  exports: [ApolloModule, HttpLinkModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule {}
