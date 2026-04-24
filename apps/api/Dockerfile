FROM node:24-alpine

WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json
COPY packages/eslint-config/package.json packages/eslint-config/package.json
COPY packages/tsconfig/package.json packages/tsconfig/package.json
COPY packages/types/package.json packages/types/package.json

RUN npm install

COPY . .

RUN npm --workspace @crm-saas/api run prisma:generate
RUN npm run build:api

ENV NODE_ENV=production
ENV PORT=3334

EXPOSE 3334

CMD ["npm", "--workspace", "@crm-saas/api", "run", "start:prod"]
