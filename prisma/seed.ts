import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const adminName = process.env.ADMIN_NAME || 'admin'
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'

  const existing = await prisma.user.findUnique({
    where: { name: adminName },
  })

  if (existing) {
    console.log(`Admin user "${adminName}" already exists. Skipping.`)
    return
  }

  const passwordHash = await bcrypt.hash(adminPassword, 12)

  await prisma.user.create({
    data: {
      name: adminName,
      passwordHash,
      role: 'admin',
    },
  })

  console.log(`Admin user "${adminName}" created successfully.`)
}

main()
  .catch((e) => {
    console.error('Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
