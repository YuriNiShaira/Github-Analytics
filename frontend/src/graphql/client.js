import { ApolloClient, InMemoryCache, gql } from '@apollo/client';


const GRAPHQL_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL.replace('/api', '')}/graphql/`
  : 'http://localhost:8000/graphql/';

const client = new ApolloClient({
  uri: GRAPHQL_URL,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'network-only',
    },
  },
});

export const GET_CONTRIBUTIONS = gql`
  query GetContributions($username: String!, $days: Int!) {
    githubContributions(username: $username, days: $days) {
      totalContributions
      totalCommits
      source
      dailyActivity {
        date
        commits
      }
    }
  }
`;

export default client;