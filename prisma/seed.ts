import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding...')

  // Clear existing data
  await prisma.review.deleteMany()
  await prisma.product.deleteMany()
  await prisma.heroSlide.deleteMany()

  console.log('Cleared all existing products, hero slides, and reviews.')
  console.log('Seeding finished. Add products and slides via the Admin Dashboard.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
