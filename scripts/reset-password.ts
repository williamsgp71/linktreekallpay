import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const newPassword = process.argv[2];
  const email = process.argv[3] || 'admin@kallpay.us';

  if (!newPassword) {
    console.log('Uso: npx tsx scripts/reset-password.ts <nueva_contraseña> [email]');
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    await prisma.user.update({
      where: { email },
      data: { passwordHash },
    });
  } else {
    await prisma.user.create({
      data: {
        email,
        passwordHash,
      },
    });
  }

  console.log(`✅ Contraseña para ${email} actualizada con éxito.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
