const cors = require('micro-cors')(); // highlight-line
const { ApolloServer, gql } = require('apollo-server-micro');
const { send } = require('micro');
const axios = require("axios");
const ethers = require("ethers")
const defaultProvider = ethers.getDefaultProvider()

const typeDefs = gql`
  type Query {
    blockNumber: String
  }
`;

const resolvers = {
  Query: {
    async blockNumber(parent, args, context) {
      const result = await defaultProvider.getBlockNumber()
      return result;
    },
  },
};

const apolloServer = new ApolloServer({ typeDefs, resolvers });
module.exports = apolloServer.start().then(() => {
  const handler = apolloServer.createHandler();
  return cors((req, res) => req.method === 'OPTIONS' ? send(res, 200, 'ok') : handler(req, res))
});
