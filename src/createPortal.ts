import { prisma } from './prismaClient';

async function createPortal() {
   const portal = await prisma.portal.create({
      data: {
         nome: 'Imoveis SC',
         url: 'https://www.imoveis-sc.com.br/florianopolis/comprar/casa',
         observacoes: 'Portal de imóveis de aluguel e venda.',
      },
   });

   console.log(portal);
}

createPortal().catch(console.error);
