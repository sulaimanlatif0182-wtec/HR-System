import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PATCH - Update Employee
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();

    const updatedEmployee = await prisma.employee.update({
      where: { id: parseInt(id) },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone || null,
        department: data.department,
        designation: data.designation,
      },
    });

    return NextResponse.json(updatedEmployee);
  } catch (error) {
    console.error("Update Employee Error:", error);
    return NextResponse.json({ error: 'Failed to update employee' }, { status: 500 });
  }
}

// DELETE - Delete Employee
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.employee.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error("Delete Employee Error:", error);
    return NextResponse.json({ error: 'Failed to delete employee' }, { status: 500 });
  }
}