import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create or update Admin User
  const adminPasswordHash = await bcrypt.hash('admin123', 10)
  const user = await prisma.user.upsert({
    where: { email: 'admin@kallpay.com' },
    update: {
      passwordHash: adminPasswordHash,
    },
    create: {
      email: 'admin@kallpay.com',
      passwordHash: adminPasswordHash,
    },
  })
  console.log('Admin user created/updated:', user.email)

  // Clear existing BrandProfile to keep single profile
  await prisma.brandProfile.deleteMany()

  const brandProfile = await prisma.brandProfile.create({
    data: {
      title: 'Kallpay',
      bio: 'Ancestral wisdom & modern science. Suplementos, fórmulas herbales y orientación de salud personalizada 🌿',
      logoUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=200&q=80',
      whatsappNumber: '16193622288',
      whatsappDefaultMsg: 'Hola! Vengo de su Linktree y quisiera información sobre sus suplementos y programas de salud.',
      bannerText: '✨ Asesoría Inicial de Salud de 20 minutos GRATIS con nuestros especialistas',
      promoCode: 'CONSULTA20',
      showBanner: true,
    },
  })
  console.log('Brand profile created:', brandProfile.title)

  // Clear and seed Products
  await prisma.product.deleteMany()
  await prisma.product.createMany({
    data: [
      {
        title: 'AlgaeCal Collagen',
        price: 55.99,
        badgeText: 'Popular',
        imageUrl: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=500&q=80',
        buyUrl: 'https://kallpay.us/products/algaecal-collagen',
        position: 1,
        active: true,
      },
      {
        title: 'Milk Thistle Plus',
        price: 35.99,
        badgeText: 'Detox & Hígado',
        imageUrl: 'https://images.unsplash.com/photo-1577401239170-897942555fb3?w=500&q=80',
        buyUrl: 'https://kallpay.us/products/allergy-research-group-milk-thistle-plus',
        position: 2,
        active: true,
      },
      {
        title: 'Mastica Digest - 120 Capsules',
        price: 43.99,
        badgeText: 'Salud Digestiva',
        imageUrl: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&q=80',
        buyUrl: 'https://kallpay.us/products/allergy-research-group-mastica-digest-120-capsules',
        position: 3,
        active: true,
      },
      {
        title: 'Nattokinase Circulatory Enzymes',
        price: 44.99,
        badgeText: 'Circulación',
        imageUrl: 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=500&q=80',
        buyUrl: 'https://kallpay.us/products/allergy-research-group-nattokinase-circulatory-systemic-enzymes',
        position: 4,
        active: true,
      },
      {
        title: 'Consulta Inicial Coaching de Salud (20 min)',
        price: 0,
        badgeText: 'Recomendado',
        imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=500&q=80',
        buyUrl: 'https://kallpay.us/pages/book-now-20',
        position: 5,
        active: true,
      },
    ],
  })
  console.log('Products seeded.')

  // Clear and seed Links
  await prisma.link.deleteMany()
  await prisma.link.createMany({
    data: [
      {
        title: '🛒 Tienda Completa de Suplementos',
        url: 'https://kallpay.us/collections/all',
        icon: 'shopping-bag',
        position: 1,
        active: true,
      },
      {
        title: '📅 Agendar Consulta Gratuita (20 min)',
        url: 'https://kallpay.us/pages/book-now-20',
        icon: 'calendar',
        position: 2,
        active: true,
      },
      {
        title: '🌿 Sobre Nosotros & Historia Kallpay',
        url: 'https://kallpay.us/pages/our-story',
        icon: 'globe',
        position: 3,
        active: true,
      },
      {
        title: '📸 Instagram Oficial (@kallpay.us)',
        url: 'https://www.instagram.com/kallpay.us/',
        icon: 'instagram',
        position: 4,
        active: true,
      },
    ],
  })
  console.log('Links seeded.')

  console.log('Seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
