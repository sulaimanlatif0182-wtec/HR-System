import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // adjust if your path differs

// GET /api/leaves
export async function GET() {
  try {
    const leaves = await prisma.leaveRequest.findMany({
      orderBy: { id: "desc" },
    });
    return NextResponse.json(leaves);
  } catch (err) {
    console.error("GET Leaves Error:", err);
    return NextResponse.json(
      { error: "Failed to load leave requests" },
      { status: 500 }
    );
  }
}

// POST /api/leaves
export async function POST(request: Request) {
  try {
    const data = await request.json();

    // 1) Validate employee id
    const employeeId = Number(data.employeeId);
    if (!Number.isInteger(employeeId) || employeeId <= 0) {
      return NextResponse.json(
        { error: "Please select a valid employee." },
        { status: 400 }
      );
    }

    // 2) Validate dates
    if (!data.startDate || !data.endDate) {
      return NextResponse.json(
        { error: "Start date and end date are required." },
        { status: 400 }
      );
    }

    // 3) Make sure the employee exists (prevents the P2003 foreign-key crash)
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
    });
    if (!employee) {
      return NextResponse.json(
        { error: `Employee #${employeeId} does not exist.` },
        { status: 400 }
      );
    }

    // 4) Create — NOTE: appliedDate & reason are REQUIRED in your schema
    const leave = await prisma.leaveRequest.create({
      data: {
        employeeId: employee.id,
        employeeName:
          data.employeeName?.trim() ||
          `${employee.firstName} ${employee.lastName}`,
        leaveType: data.leaveType || "annual",
        startDate: String(data.startDate),
        endDate: String(data.endDate),
        reason: data.reason?.trim() || "No reason provided", // never null
        status: "pending",
        appliedDate: new Date().toISOString(),               // ← THE MISSING PIECE
      },
    });

    return NextResponse.json(leave, { status: 201 });
  } catch (err) {
    // Surface the actual Prisma message so you can see the real cause
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("POST Leave Error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}