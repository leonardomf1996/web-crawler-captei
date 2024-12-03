import { Client } from '@elastic/elasticsearch';

export const esClient = new Client({
   node: 'http://elasticsearch:9200',  // Nome do serviço do Docker
});