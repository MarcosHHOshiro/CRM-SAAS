FROM node:24-alpine

WORKDIR /app

ARG NEXT_PUBLIC_API_URL=/api
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json
COPY packages/eslint-config/package.json packages/eslint-config/package.json
COPY packages/tsconfig/package.json packages/tsconfig/package.json
COPY packages/types/package.json packages/types/package.json

RUN npm ci

COPY . .

RUN npm run build:web

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["npm", "--workspace", "@crm-saas/web", "run", "start"]
