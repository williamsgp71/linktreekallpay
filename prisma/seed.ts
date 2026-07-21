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
      title: 'Kallpay Fitness',
      bio: 'Suplementos de Alta Calidad & Nutrición Deportiva Avanzada. Potencia tus entrenamientos con lo mejor.',
      logoUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300&auto=format&fit=crop&q=80',
      whatsappNumber: '+573000000000',
      whatsappDefaultMsg: '¡Hola! Quisiera obtener información y asesoría sobre los productos Kallpay Fitness.',
      bannerText: '🔥 ¡ENVÍO GRATIS en compras superiores a $50! Usa el código KALLPAY10',
      promoCode: 'KALLPAY10',
      showBanner: true,
    },
  })
  console.log('Brand profile created:', brandProfile.title)

  // Seed Products if none exist
  const existingProducts = await prisma.product.count()
  if (existingProducts === 0) {
    await prisma.product.createMany({
      data: [
        {
          title: 'Creatina Monohidratada 100% Pura 500g',
          price: 39.99,
          imageUrl: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=500&auto=format&fit=crop&q=60',
          buyUrl: 'https://kallpay.com/products/creatina-500g',
          badgeText: 'MÁS VENDIDO',
          position: 1,
          active: true,
        },
        {
          title: 'Proteína Whey Isolate Premium 2kg',
          price: 64.99,
          imageUrl: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=500&auto=format&fit=crop&q=60',
          buyUrl: 'https://kallpay.com/products/whey-isolate-2kg',
          badgeText: 'TOP CALIDAD',
          position: 2,
          active: true,
        },
        {
          title: 'Pre-Workout Energy Explosion 300g',
          price: 29.99,
          imageUrl: 'https://images.unsplash.com/photo-1546483875-ad9014c88eba?w=500&auto=format&fit=crop&q=60',
          buyUrl: 'https://kallpay.com/products/pre-workout-300g',
          badgeText: 'NUEVO',
          position: 3,
          active: true,
        },
      ],
    })
    console.log('Products seeded.')
  }

  // Seed Links if none exist
  const existingLinks = await prisma.link.count()
  if (existingLinks === 0) {
    await prisma.link.createMany({
      data: [
        {
          title: '🌐 Sitio Web Oficial',
          url: 'https://kallpay.com',
          icon: 'Globe',
          position: 1,
          active: true,
        },
        {
          title: '💬 Asesoría Personalizada por WhatsApp',
          url: 'https://wa.me/573000000000',
          icon: 'MessageCircle',
          position: 2,
          active: true,
        },
        {
          title: '📸 Síguenos en Instagram',
          url: 'https://instagram.com/kallpay.fit',
          icon: 'Instagram',
          position: 3,
          active: true,
        },
        {
          title: '🎵 Comunidad TikTok',
          url: 'https://tiktok.com/@kallpay.fit',
          icon: 'Video',
          position: 4,
          active: true,
        },
      ],
    })
    console.log('Links seeded.')
  }

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
