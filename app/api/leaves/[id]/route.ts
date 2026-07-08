import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PATCH - Approve or Reject a leave request
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();

    const updatedLeave = await prisma.leaveRequest.update({
      where: { id: parseInt(id) },
      data: {
        status: data.status, // "approved" or "rejected"
      },
    });

    return NextResponse.json(updatedLeave);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update leave' }, { status: 500 });
  }
}