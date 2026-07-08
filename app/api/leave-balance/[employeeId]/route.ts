import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Get leave balance for an employee
export async function GET(
  request: Request,
  { params }: { params: Promise<{ employeeId: string }> }
) {
  try {
    const { employeeId } = await params;

    const leaveBalance = await prisma.leaveBalance.findUnique({
      where: { employeeId: parseInt(employeeId) },
    });

    if (!leaveBalance) {
      return NextResponse.json({ error: 'Leave balance not found' }, { status: 404 });
    }

    return NextResponse.json(leaveBalance);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch leave balance' }, { status: 500 });
  }
}

// PATCH - Update leave balance
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ employeeId: string }> }
) {
  try {
    const { employeeId } = await params;
    const data = await request.json();

    const updatedBalance = await prisma.leaveBalance.upsert({
      where: { employeeId: parseInt(employeeId) },
      update: {
        annualTotal: data.annualTotal,
        sickTotal: data.sickTotal,
        casualTotal: data.casualTotal,
      },
      create: {
        employeeId: parseInt(employeeId),
        annualTotal: data.annualTotal || 14,
        sickTotal: data.sickTotal || 7,
        casualTotal: data.casualTotal || 5,
      },
    });

    return NextResponse.json(updatedBalance);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update leave balance' }, { status: 500 });
  }
}