# Web Crawler Captei

Este projeto é um **web crawler** que coleta informações de sites, armazena os dados em um banco de dados PostgreSQL e os indexa no Elasticsearch para pesquisas eficientes.

## Funcionalidades

- Coleta de dados de sites usando 'axios' e 'cheerio'.
- Armazenamento dos dados no PostgreSQL via 'Prisma'.
- Indexação no Elasticsearch para busca rápida.
- Uso de contêineres Docker para serviços de banco de dados e Elasticsearch.

## Requisitos

- Node.js (versão 16 ou superior)
- Docker e Docker Compose

## Configuração

### 1. Clonar o repositório

```bash
git clone <URL_DO_REPOSITORIO>
cd web-crawler-captei
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Iniciar os serviços com Docker

Suba o PostgreSQL e o Elasticsearch usando Docker Compose:

```bash
docker-compose up -d
```

### 4. Configurar o Prisma

Sincronize o esquema do banco de dados com PostgreSQL usando Prisma:

```bash
npx prisma migrate dev --name init
```

### 5. Executar o crawler

Inicie o crawler com o seguinte comando:

```bash
npx ts-node src/createPortal.ts
npm run start
```

## Estrutura do Projeto

```bash
.
├── prisma/
│   └── schema.prisma
├── src/
│   └── crawler.ts
├── docker-compose.yml
├── package.json
└── tsconfig.json
```

## Scripts Disponíveis

- ```npm run start```: Executa o crawler com 'ts-node'.

## Tecnologias Utilizadas

- **Node.js** e **TypeScript**: Base da aplicação.
- **Axios**: Para requisições HTTP.
- **Cheerio**: Para raspagem de dados HTML.
- **Prisma**: ORM para interagir com PostgreSQL.
- **Elasticsearch**: Indexação e busca de dados.
- **Docker** e **Docker Compose**: Gerenciamento dos serviços.

## Arquitetura Docker

O arquivo 'docker-compose.yml' define dois serviços principais:

1. **Elasticsearch**:
   - Porta: '9200'
   - Configurado como nó único.
2. **PostgreSQL**:
   - Porta: '5432'
   - Configurado com usuário, senha e banco de dados padrão.

### Exemplo do 'docker-compose.yml':

```yaml
version: '3'
services:
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.10.0
    container_name: elasticsearch_crawler
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false
    ports:
      - '9200:9200'
    networks:
      - crawler_network
    volumes:
      - elasticsearch_data:/usr/share/elasticsearch/data

  postgres:
    image: postgres:14
    container_name: postgres_crawler
    environment:
      POSTGRES_USER: crawler_user
      POSTGRES_PASSWORD: crawler_pass
      POSTGRES_DB: crawler_db
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - crawler_network

networks:
  crawler_network:
    driver: bridge

volumes:
  postgres_data:
  elasticsearch_data:
'
```

### Melhorias
   - Tive problema de conexão com o ElasticSearch, e não funcionou da forma esperada;
   - Por ser um projeto pequeno, não apliquei nenhuma prática de arquitetura/design;
   - Criei um script para adição do portal manualmente, poderia ser de forma automática.