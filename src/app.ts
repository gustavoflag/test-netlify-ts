import express, { Request, Response } from 'express';

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Sample data
let items: { id: number; name: string }[] = [
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' },
];

// Routes
app.get('/items', (req: Request, res: Response) => {
  res.json(items);
});

app.get('/items/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);
  const item = items.find(i => i.id === id);
  if (item) {
    res.json(item);
  } else {
    res.status(404).json({ message: 'Item not found' });
  }
});

app.post('/items', (req: Request, res: Response) => {
  const newItem = {
    id: items.length + 1,
    name: req.body.name,
  };
  items.push(newItem);
  res.status(201).json(newItem);
});

app.put('/items/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);
  const itemIndex = items.findIndex(i => i.id === id);
  if (itemIndex !== -1) {
    items[itemIndex].name = req.body.name;
    res.json(items[itemIndex]);
  } else {
    res.status(404).json({ message: 'Item not found' });
  }
});

app.delete('/items/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);
  const itemIndex = items.findIndex(i => i.id === id);
  if (itemIndex !== -1) {
    const deletedItem = items.splice(itemIndex, 1);
    res.json(deletedItem);
  } else {
    res.status(404).json({ message: 'Item not found' });
  }
});

export default app;