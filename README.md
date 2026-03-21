# TypeScript REST API on Netlify

A simple REST API built with Express.js and TypeScript, ready to deploy on Netlify as serverless functions.

## Installation

```bash
npm install
```

## Development

To run the server in development mode (with hot reload):

```bash
npm run dev
```

## Build

To compile TypeScript to JavaScript:

```bash
npm run build
```

## Deployment to Netlify

1. Push your code to a Git repository (GitHub, GitLab, etc.)
2. Connect your repository to Netlify
3. Netlify will automatically build and deploy using the `netlify.toml` configuration
4. Your API will be available at `https://your-site.netlify.app/api/items`

## API Endpoints

- `GET /api/items` - Get all items
- `GET /api/items/:id` - Get item by ID
- `POST /api/items` - Create a new item (body: { "name": "Item Name" })
- `PUT /api/items/:id` - Update item by ID (body: { "name": "Updated Name" })
- `DELETE /api/items/:id` - Delete item by ID