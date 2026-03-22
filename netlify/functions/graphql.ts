import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import { createYoga } from 'graphql-yoga';
import { makeExecutableSchema } from '@graphql-tools/schema';

type Item = { id: number; name: string };
const items: Item[] = [
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
    item: (_: any, { id }: { id: number }) => items.find((i) => i.id === id) || null,
  },
  Mutation: {
    createItem: (_: any, { name }: { name: string }) => {
      const nextId = items.length ? Math.max(...items.map((i) => i.id)) + 1 : 1;
      const newItem = { id: nextId, name };
      items.push(newItem);
      return newItem;
    },
    updateItem: (_: any, { id, name }: { id: number; name: string }) => {
      const item = items.find((i) => i.id === id);
      if (!item) return null;
      item.name = name;
      return item;
    },
    deleteItem: (_: any, { id }: { id: number }) => {
      const index = items.findIndex((i) => i.id === id);
      if (index === -1) return false;
      items.splice(index, 1);
      return true;
    },
  },
};

const schema = makeExecutableSchema({ typeDefs, resolvers });

const yoga = createYoga({
  schema,
  graphiql: true,
});

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  const url = new URL(`http://localhost${event.path}${event.rawQuery ? `?${event.rawQuery}` : ''}`);
  const request = new Request(url, {
    method: event.httpMethod,
    headers: event.headers as any,
    body: event.body ? event.body : undefined,
  });

  const response = await yoga.fetch(request);

  return {
    statusCode: response.status,
    headers: Object.fromEntries(response.headers.entries()),
    body: await response.text(),
  };
};