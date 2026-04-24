# Deploy na VPS

Este projeto pode rodar em uma VPS com Docker Compose, PostgreSQL em container e Caddy fazendo reverse proxy com HTTPS automatico.

> Se a VPS ja tem Nginx usando as portas `80` e `443`, use a secao "Deploy com Nginx existente". Nao suba o `docker-compose.prod.yml` com Caddy nesse caso.

## 1. DNS

No painel do dominio, crie ou confirme este registro:

```txt
Tipo: A
Nome: crm
Valor: 129.121.37.64
```

Aguarde a propagacao antes de subir o HTTPS. Voce pode conferir com:

```bash
dig crm.marcos-hh-oshiro.com
```

## 2. Preparar a VPS

Entre na VPS:

```bash
ssh root@129.121.37.64
```

Instale Docker e Git se ainda nao estiverem instalados:

```bash
apt update
apt install -y ca-certificates curl git
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}") stable" > /etc/apt/sources.list.d/docker.list
apt update
apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

Libere as portas HTTP/HTTPS no firewall, se usar UFW:

```bash
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

## 3. Enviar o projeto

Clone o repositorio ou envie os arquivos para a VPS:

```bash
git clone <URL_DO_REPOSITORIO> /opt/crm-saas
cd /opt/crm-saas
```

Se voce ainda nao tiver o projeto em um repositorio remoto, pode enviar por `scp` ou criar o repositorio antes.

## 4. Configurar variaveis

Crie o arquivo de ambiente de producao:

```bash
cp .env.production.example .env.production
nano .env.production
```

Troque pelo menos:

```env
POSTGRES_PASSWORD=uma-senha-forte-sem-caracteres-especiais
JWT_ACCESS_SECRET=um-segredo-longo
JWT_REFRESH_SECRET=outro-segredo-longo
```

Para gerar a senha do Postgres, prefira caracteres sem simbolos para evitar quebrar a `DATABASE_URL`:

```bash
openssl rand -hex 24
```

Para gerar os segredos JWT:

```bash
openssl rand -base64 48
```

## 5. Subir a aplicacao

Na raiz do projeto:

```bash
docker compose -f docker-compose.prod.yml --env-file .env.production up -d --build
```

O container da API aplica as migrations Prisma automaticamente antes de iniciar.

## 6. Conferir

Veja os containers:

```bash
docker compose -f docker-compose.prod.yml --env-file .env.production ps
```

Veja logs:

```bash
docker compose -f docker-compose.prod.yml --env-file .env.production logs -f api web caddy
```

Teste a API:

```bash
curl https://crm.marcos-hh-oshiro.com/api/health
```

Acesse:

```txt
https://crm.marcos-hh-oshiro.com
```

## Deploy com Nginx existente

Use este caminho quando a VPS ja tem Nginx nas portas `80` e `443`.

Neste modo:

- Nginx continua sendo o proxy publico
- Web roda apenas em `127.0.0.1:3001`
- API roda apenas em `127.0.0.1:3335`
- Postgres fica interno no Docker
- Caddy nao e usado

### 1. Confirmar Docker

Se aparecer `Cannot connect to the Docker daemon`, rode:

```bash
systemctl status docker
systemctl start docker
systemctl enable docker
```

Se o servico Docker nao existir, instale Docker seguindo a etapa "Preparar a VPS".

### 2. Subir containers sem Caddy

Na raiz do projeto:

```bash
docker compose -f docker-compose.nginx.yml --env-file .env.production up -d --build
```

Confira:

```bash
docker compose -f docker-compose.nginx.yml --env-file .env.production ps
curl http://127.0.0.1:3335/api/health
curl -I http://127.0.0.1:3001
```

### 3. Configurar Nginx

Copie a configuracao de exemplo:

```bash
cp deploy/nginx.crm.conf /etc/nginx/sites-available/crm.marcos-hh-oshiro.com
ln -s /etc/nginx/sites-available/crm.marcos-hh-oshiro.com /etc/nginx/sites-enabled/crm.marcos-hh-oshiro.com
nginx -t
systemctl reload nginx
```

### 4. Ativar HTTPS

Se voce usa Certbot:

```bash
certbot --nginx -d crm.marcos-hh-oshiro.com
```

Depois teste:

```bash
curl https://crm.marcos-hh-oshiro.com/api/health
```

## Atualizar deploy

Para atualizar depois de novos commits:

```bash
cd /opt/crm-saas
git pull
docker compose -f docker-compose.prod.yml --env-file .env.production up -d --build
```

## Backup rapido do banco

```bash
docker exec crm-saas-postgres pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB" > crm-saas-backup.sql
```
