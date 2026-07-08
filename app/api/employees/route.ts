import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const employees = await prisma.employee.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: true,
        manager: true,
      },
    });
    return NextResponse.json(employees);
  } catch (error) {
    console.error("GET Employees Error:", error);
    return NextResponse.json({ error: 'Failed to fetch employees' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // 1. Create the Employee first
    const employee = await prisma.employee.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone || null,
        department: data.department,
        designation: data.designation,
        joinDate: new Date().toISOString().split('T')[0],
        status: 'active',
      },
    });

    // 2. Create the User account (linked to the employee)
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: "password123", // Default password
        role: "employee",        // Default role
        employeeId: employee.id,
      },
    });

    return NextResponse.json({ 
      message: "Employee and user account created successfully",
      employee,
      user: { id: user.id, email: user.email, role: user.role }
    }, { status: 201 });

  } catch (error) {
    console.error("Create Employee Error:", error);
    return NextResponse.json({ error: 'Failed to create employee' }, { status: 500 });
  }
}