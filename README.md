## TypeScript GraphQL API on Netlify with Yoga

A simple GraphQL API built with TypeScript, GraphQL Yoga, and `@netlify/functions`, ready to deploy on Netlify.

## Installation

```bash
npm install
```

## Development

To run the server in development mode:

```bash
npm run dev
```

For local GraphQL development with GraphiQL:

```bash
netlify dev
```

Then visit `http://localhost:8888/graphql` for the interactive GraphQL playground.

## Build

To compile TypeScript to JavaScript:

```bash
npm run build
```

## Deployment to Netlify

1. Push your code to a Git repository (GitHub, GitLab, etc.)
2. Connect your repository to Netlify
3. Netlify will automatically build and deploy using the `netlify.toml` configuration
4. Your API will be available at `https://your-site.netlify.app/graphql`

## GraphQL API

Query:
- `items`: returns `[Item!]!`
- `item(id: Int!)`: returns `Item`

Mutation:
- `createItem(name: String!): Item!`
- `updateItem(id: Int!, name: String!): Item`
- `deleteItem(id: Int!): Boolean!`

Example:
```bash
curl -X POST https://your-site.netlify.app/graphql \
	-H 'Content-Type: application/json' \
	-d '{"query":"query { items { id name } }"}'
```