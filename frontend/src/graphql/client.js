import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:8000/graphql/',
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