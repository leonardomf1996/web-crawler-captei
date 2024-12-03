import { PrismaClient } from '@prisma/client';
import * as cheerio from 'cheerio';
import axios from 'axios';
import { client } from './elasticsearchClient';

const prisma = new PrismaClient();

interface Property {
   titulo: string;
   descricao: string;
   portal: string;
   url: string;
   tipoNegocio: string;
   endereco: string;
   preco: number;
   quartos: number;
   banheiros: number;
   vagasGaragem: number;
   areaUtil: number;
   capturadoEm: string;
}

async function fetchRealEstateData(): Promise<Property[]> {
   const properties: Property[] = [];
   const url = 'https://www.imoveis-sc.com.br/florianopolis/comprar/casa';

   try {
      const { data } = await axios.get(url);
      const $ = cheerio.load(data);

      $('.imovel').each((_, element) => {
         const titulo = $(element).find('.imovel-titulo a').text().trim();
         const descricao = $(element).find('.imovel-descricao').text().trim() || 'Sem descrição';
         const portal = 'imoveis-sc';
         const propertyUrl = $(element).find('.imovel-titulo a').attr('href') || '';
         const tipoNegocio = 'Venda'; // O tipo de negócio está fixo para "Venda" neste exemplo.
         const endereco = $(element).find('.imovel-extra strong').text().trim();
         const precoText = $(element).find('.imovel-preco small[itemprop="price"]').text().trim();
         const preco = parseFloat(precoText.replace(/[^0-9.-]+/g, '')) || 0;
         const quartos = parseInt($(element).find('.imovel-info li').eq(0).find('strong').text().trim(), 10) || 0;
         const banheiros = parseInt($(element).find('.imovel-info li').eq(1).find('strong').text().trim(), 10) || 0;
         const vagasGaragem = parseInt($(element).find('.imovel-info li').eq(2).find('strong').text().trim(), 10) || 0;
         const areaUtilText = $(element).find('.imovel-info li').eq(3).find('strong').text().trim();
         const areaUtil = parseFloat(areaUtilText.replace(/[^0-9.]+/g, '')) || 0;

         const data = {
            titulo,
            descricao,
            portal,
            url: propertyUrl,
            tipoNegocio,
            endereco,
            preco,
            quartos,
            banheiros,
            vagasGaragem,
            areaUtil,
            capturadoEm: new Date().toISOString(),
         }

         properties.push(data);
      });
   } catch (error) {
      console.error('Erro ao capturar dados do portal:', error);
   }

   return properties;
}

async function insertIntoElasticsearch(data: Property) {
   try {
      await client.index({
         index: 'imoveis',
         document: data,
      });
      console.log(`Inserido no Elasticsearch: ${data.titulo}`);
   } catch (error) {
      console.error('Erro ao inserir no Elasticsearch:', error);
   }
}

async function startCrawler() {
   const portal = await prisma.portal.findFirst({
      where: { nome: 'imoveis-sc' },
   });

   if (!portal) {
      console.error('Portal não encontrado no banco de dados.');
      return;
   }

   const captureRecord = await prisma.captura.create({
      data: {
         portalId: portal.id,
         filtros: JSON.stringify({}),
         status: 'rodando',
         dataHoraInicio: new Date(),
         dataHoraFim: new Date(),
      },
   });

   try {
      const realEstateData = await fetchRealEstateData();
      for (const property of realEstateData) {
         console.log(property)
         // await insertIntoElasticsearch(property);
      }

      await prisma.captura.update({
         where: { id: captureRecord.id },
         data: {
            status: 'concluído',
            dataHoraFim: new Date(),
         },
      });
      console.log('Captura concluída.');
   } catch (error) {
      await prisma.captura.update({
         where: { id: captureRecord.id },
         data: { status: 'erro' },
      });
      console.error('Erro durante a captura:', error);
   }
}

startCrawler().finally(async () => {
   await prisma.$disconnect();
});
