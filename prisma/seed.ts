import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const adminName = process.env.ADMIN_NAME || 'admin'
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'

  const passwordHash = await bcrypt.hash(adminPassword, 12)

  await prisma.user.upsert({
    where: { name: adminName },
    update: { passwordHash, role: 'admin' },
    create: {
      name: adminName,
      passwordHash,
      role: 'admin',
    },
  })

  console.log(`Admin user "${adminName}" seeded with password successfully.`)
}

main()
  .catch((e) => {
    console.error('Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
