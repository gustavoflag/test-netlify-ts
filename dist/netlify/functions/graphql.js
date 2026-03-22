"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const graphql_yoga_1 = require("graphql-yoga");
const schema_1 = require("@graphql-tools/schema");
const items = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
];
const typeDefs = `
  type Item {
    id: Int!
    name: String!
  }

  type Query {
    items: [Item!]!
    item(id: Int!): Item
  }

  type Mutation {
    createItem(name: String!): Item!
    updateItem(id: Int!, name: String!): Item
    deleteItem(id: Int!): Boolean!
  }
`;
const resolvers = {
    Query: {
        items: () => items,
        item: (_, { id }) => items.find((i) => i.id === id) || null,
    },
    Mutation: {
        createItem: (_, { name }) => {
            const nextId = items.length ? Math.max(...items.map((i) => i.id)) + 1 : 1;
            const newItem = { id: nextId, name };
            items.push(newItem);
            return newItem;
        },
        updateItem: (_, { id, name }) => {
            const item = items.find((i) => i.id === id);
            if (!item)
                return null;
            item.name = name;
            return item;
        },
        deleteItem: (_, { id }) => {
            const index = items.findIndex((i) => i.id === id);
            if (index === -1)
                return false;
            items.splice(index, 1);
            return true;
        },
    },
};
const schema = (0, schema_1.makeExecutableSchema)({ typeDefs, resolvers });
const yoga = (0, graphql_yoga_1.createYoga)({
    schema,
    graphiql: true,
});
const handler = async (event, context) => {
    const url = new URL(`http://localhost${event.path}${event.rawQuery ? `?${event.rawQuery}` : ''}`);
    const request = new Request(url, {
        method: event.httpMethod,
        headers: event.headers,
        body: event.body ? event.body : undefined,
    });
    const response = await yoga.fetch(request);
    return {
        statusCode: response.status,
        headers: Object.fromEntries(response.headers.entries()),
        body: await response.text(),
    };
};
exports.handler = handler;
