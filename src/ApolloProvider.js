// npm install @apollo/client
// apollo provider provides our apollo client to our application to connect to graphql server
import React from 'react';
import App from './App';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink,
  split,
} from '@apollo/client';

import { setContext } from 'apollo-link-context';

const wsLink = new WebSocketLink({
  uri: `ws://react-socialmeds-server.herokuapp.com/graphql`,
  options: {
    reconnect: true,
  },
});
const httpLink = createHttpLink({
  uri: 'https://react-socialmeds-server.herokuapp.com/',
});

const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink
);

const authLink = setContext((req, pre) => {
  const token = localStorage.getItem('jwtToken');
  // will merge with existing headers
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(link),
  cache: new InMemoryCache(),
});

export default (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
