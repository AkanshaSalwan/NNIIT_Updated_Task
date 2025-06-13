import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { generateInitialSlots } from '@/data/initial-data';

const dataFilePath = path.join(process.cwd(), 'data', 'db.json');

// Helper function to read data
async function readData() {
  try {
    const data = await fs.readFile(dataFilePath, 'utf8');
    const parsed = JSON.parse(data);
    // Ensure we return an array
    return Array.isArray(parsed) ? parsed : generateInitialSlots(new Date());
  } catch (error) {
    // If file doesn't exist or is empty, generate initial data
    const initialData = generateInitialSlots(new Date());
    await fs.writeFile(dataFilePath, JSON.stringify(initialData, null, 2));
    return initialData;
  }
}

// Helper function to write data
async function writeData(data: any) {
  await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
}

// GET /api/slots
export async function GET() {
  try {
    const slots = await readData();
    // Ensure we're returning an array
    if (!Array.isArray(slots)) {
      const initialData = generateInitialSlots(new Date());
      await writeData(initialData);
      return NextResponse.json(initialData);
    }
    return NextResponse.json(slots);
  } catch (error) {
    console.error('Error reading slots:', error);
    const initialData = generateInitialSlots(new Date());
    return NextResponse.json(initialData);
  }
}

// POST /api/slots
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const slots = await readData();
    const newSlot = { ...body, id: `slot-${Date.now()}` };
    if (!Array.isArray(slots)) {
      throw new Error('Slots data is not an array');
    }
    slots.push(newSlot);
    await writeData(slots);
    return NextResponse.json(newSlot);
  } catch (error) {
    console.error('Error creating slot:', error);
    return NextResponse.json(
      { error: 'Failed to create slot' },
      { status: 500 }
    );
  }
}

// PUT /api/slots/[id]
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    // In a real application, you would update this in a database
    return NextResponse.json(body);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update slot' },
      { status: 500 }
    );
  }
} 