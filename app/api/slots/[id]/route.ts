import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'db.json');

// Helper function to read data
async function readData() {
  try {
    const data = await fs.readFile(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Helper function to write data
async function writeData(data: any) {
  await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
}

// GET /api/slots/[id]
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const slots = await readData();
    const slot = slots.find((s: any) => s.id === params.id);
    
    if (!slot) {
      return NextResponse.json(
        { error: 'Slot not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(slot);
  } catch (error) {
    console.error('Error reading slot:', error);
    return NextResponse.json(
      { error: 'Failed to fetch slot' },
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
    const slots = await readData();
    const index = slots.findIndex((s: any) => s.id === params.id);

    if (index === -1) {
      return NextResponse.json(
        { error: 'Slot not found' },
        { status: 404 }
      );
    }

    slots[index] = { ...slots[index], ...body };
    await writeData(slots);
    return NextResponse.json(slots[index]);
  } catch (error) {
    console.error('Error updating slot:', error);
    return NextResponse.json(
      { error: 'Failed to update slot' },
      { status: 500 }
    );
  }
}

// DELETE /api/slots/[id]
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const slots = await readData();
    const filteredSlots = slots.filter((s: any) => s.id !== params.id);
    
    if (filteredSlots.length === slots.length) {
      return NextResponse.json(
        { error: 'Slot not found' },
        { status: 404 }
      );
    }

    await writeData(filteredSlots);
    return NextResponse.json({ message: 'Slot deleted successfully' });
  } catch (error) {
    console.error('Error deleting slot:', error);
    return NextResponse.json(
      { error: 'Failed to delete slot' },
      { status: 500 }
    );
  }
} 