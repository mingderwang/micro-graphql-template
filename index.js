const cors = require('micro-cors')(); // highlight-line
const { ApolloServer, gql } = require('apollo-server-micro');
const { send } = require('micro');
const axios = require("axios");

const options = {
  method: 'POST',
  url: 'https://blockchain-http-rpc.p.rapidapi.com/api/ethereum/mainnet',
  headers: {
    'content-type': 'application/json',
    'X-RapidAPI-Key': '76d5c05f7emsh731556d3b28871bp17b47ajsnd26fa8bee8e7',
    'X-RapidAPI-Host': 'blockchain-http-rpc.p.rapidapi.com'
  },
  data: '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":83}'
};

axios.request(options).then(function (response) {
	console.log(response.data);
}).catch(function (error) {
	console.error(error);
});

const typeDefs = gql`
  type Query {
    sayHello: String
  }
`;

const resolvers = {
  Query: {
    async sayHello(parent, args, context) {
      const respone = await axios.request(options)
      const result = await JSON.stringify(respone.data)
      return result;
    },
  },
};

const apolloServer = new ApolloServer({ typeDefs, resolvers });
module.exports = apolloServer.start().then(() => {
  const handler = apolloServer.createHandler();
  return cors((req, res) => req.method === 'OPTIONS' ? send(res, 200, 'ok') : handler(req, res))
});
