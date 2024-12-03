import { esClient } from './elasticsearchClient';

interface Imovel {
   id: string;
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
   atualizadoEm: string;
}

export async function saveToElasticsearch(imoveis: Imovel[]) {
   const body = imoveis.flatMap((imovel) => [
      { index: { _index: 'imoveis', _id: imovel.id } },
      imovel,
   ]);

   await esClient.bulk({ refresh: true, body });
   console.log('Dados inseridos no Elasticsearch com sucesso!');
}
