import "../styles/globals.css";
import "semantic-ui-css/semantic.min.css";



import { ApolloClient, InMemoryCache, ApolloProvider, from, HttpLink } from '@apollo/client';
import { onError } from "@apollo/client/link/error";

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      ),
    );

  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const client = new ApolloClient({
  //ssrMode: true,
  cache: new InMemoryCache(),
  // Enable sending cookies over cross-origin requests
  //credentials: 'include',

  link: from([
    errorLink,
    new HttpLink({
      uri: 'http://localhost:4000/graphql',
      credentials: 'include',

    })
  ])
});



function MyApp({ Component, pageProps }) {
  return <ApolloProvider client={client}>
    <Component {...pageProps} />
  </ApolloProvider>

}

export default MyApp;
