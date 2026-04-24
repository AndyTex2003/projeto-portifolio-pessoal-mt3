import bcrypt from 'bcryptjs';
import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('admin123', 10);

  await prisma.user.upsert({
    where: {
      email: 'admin@escola.com'
    },
    update: {
      name: 'Barbara Hammer',
      passwordHash,
      role: Role.ADMIN
    },
    create: {
      name: 'Barbara Hammer',
      email: 'admin@escola.com',
      passwordHash,
      role: Role.ADMIN
    }
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
