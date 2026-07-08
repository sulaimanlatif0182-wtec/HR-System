import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.employee.createMany({
    data: [
      {
        firstName: "Michael",
        lastName: "Torres",
        email: "michael.t@company.com",
        phone: "+60 12-345 6789",
        department: "Engineering",
        designation: "Senior Developer",
        joinDate: "2023-04-12",
        status: "active",
      },
      {
        firstName: "Aisha",
        lastName: "Patel",
        email: "aisha.p@company.com",
        phone: "+60 17-234 5678",
        department: "Marketing",
        designation: "Marketing Manager",
        joinDate: "2022-11-05",
        status: "active",
      },
    ],
  })

  console.log("✅ Sample employees created!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })