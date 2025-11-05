const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.profile.upsert({
    where: { address: '5DUMMYWestendAddressExample1111111111111111111' },
    update: {},
    create: {
      address: '5DUMMYWestendAddressExample1111111111111111111',
      handle: 'bonelli-dev',
      bio: 'EchoID demo profile for Polkadot Cloud hackathon.',
      links: { github: 'https://github.com/Zwin-ux', site: 'https://bonelli.dev' },
      skills: ['nextjs', 'polkadot', 'postgres'],
      score: 20,
      version: 1,
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
