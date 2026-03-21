import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';

type Item = { id: number; name: string };
const items: Item[] = [
	{ id: 1, name: 'Item 1' },
	{ id: 2, name: 'Item 2' },
];

const buildResponse = (statusCode: number, body: unknown) => ({
	statusCode,
	body: JSON.stringify(body),
	headers: {
		'Content-Type': 'application/json',
	},
});

const parseBody = (body: string | null) => {
	if (!body) return null;
	try {
		return JSON.parse(body);
	} catch {
		return null;
	}
};

export const handler: Handler = async (
	event: HandlerEvent,
	context: HandlerContext
) => {
	const path = (event.path || '').replace(/^\/api/, '').replace(/\/$/, '');
	const segments = path.split('/').filter(Boolean);
	const method = event.httpMethod;

	if (segments.length === 0 || segments[0] !== 'items') {
		return buildResponse(404, { error: 'Not found' });
	}

	const id = segments[1] ? Number(segments[1]) : undefined;

	if (method === 'GET' && segments.length === 1) {
		return buildResponse(200, items);
	}

	if (method === 'GET' && id) {
		const item = items.find(i => i.id === id);
		return item
			? buildResponse(200, item)
			: buildResponse(404, { error: 'Item not found' });
	}

	if (method === 'POST' && segments.length === 1) {
		const body = parseBody(event.body);
		if (!body || typeof body.name !== 'string') {
			return buildResponse(400, { error: 'Invalid body (name required)' });
		}
		const nextId = items.length ? Math.max(...items.map(i => i.id)) + 1 : 1;
		const newItem = { id: nextId, name: body.name };
		items.push(newItem);
		return buildResponse(201, newItem);
	}

	if (method === 'PUT' && id) {
		const body = parseBody(event.body);
		if (!body || typeof body.name !== 'string') {
			return buildResponse(400, { error: 'Invalid body (name required)' });
		}
		const item = items.find(i => i.id === id);
		if (!item) {
			return buildResponse(404, { error: 'Item not found' });
		}
		item.name = body.name;
		return buildResponse(200, item);
	}

	if (method === 'DELETE' && id) {
		const index = items.findIndex(i => i.id === id);
		if (index === -1) {
			return buildResponse(404, { error: 'Item not found' });
		}
		items.splice(index, 1);
		return buildResponse(200, { message: 'Item deleted' });
	}

	return buildResponse(405, { error: 'Method not allowed' });
};