# Azure Deployment Guide for EuroFunds Platform

## Prerequisites
- Azure account with active subscription
- Azure CLI installed locally
- Node.js application ready for deployment

## Option 1: Azure App Service (Recommended)

### Step 1: Prepare the Application
1. Ensure your `package.json` has the correct start script:
```json
{
  "scripts": {
    "start": "node dist/index.js",
    "build": "npm run build:client && npm run build:server",
    "build:client": "vite build",
    "build:server": "esbuild server/index.ts --bundle --platform=node --outfile=dist/index.js --external:pg-native"
  }
}
```

2. Create a production build:
```bash
npm run build
```

### Step 2: Deploy via Azure CLI
```bash
# Login to Azure
az login

# Create resource group
az group create --name eurofunds-rg --location "East US"

# Create App Service plan
az appservice plan create --name eurofunds-plan --resource-group eurofunds-rg --sku B1 --is-linux

# Create web app
az webapp create --resource-group eurofunds-rg --plan eurofunds-plan --name eurofunds-app --runtime "NODE|20-lts"

# Deploy from local directory
az webapp up --name eurofunds-app --resource-group eurofunds-rg --runtime "NODE|20-lts"
```

### Step 3: Configure Environment Variables
```bash
# Set environment variables
az webapp config appsettings set --resource-group eurofunds-rg --name eurofunds-app --settings \
  NODE_ENV=production \
  DATABASE_URL="your-database-url" \
  OPENAI_API_KEY="your-openai-key"
```

## Option 2: Azure Container Instances

### Step 1: Create Dockerfile
```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]
```

### Step 2: Deploy Container
```bash
# Build and push to Azure Container Registry
az acr create --resource-group eurofunds-rg --name eurofundsacr --sku Basic
az acr build --registry eurofundsacr --image eurofunds:latest .

# Deploy to Container Instances
az container create \
  --resource-group eurofunds-rg \
  --name eurofunds-container \
  --image eurofundsacr.azurecr.io/eurofunds:latest \
  --ports 5000 \
  --environment-variables NODE_ENV=production \
  --secure-environment-variables DATABASE_URL="your-db-url" OPENAI_API_KEY="your-key"
```

## Option 3: Azure Static Web Apps + Azure Functions

### For the Frontend (Static Web App)
```bash
# Deploy frontend to Static Web Apps
az staticwebapp create \
  --name eurofunds-frontend \
  --resource-group eurofunds-rg \
  --source https://github.com/your-username/eurofunds \
  --location "East US 2" \
  --branch main \
  --app-location "/client" \
  --output-location "/dist"
```

### For the Backend (Azure Functions)
Convert your Express routes to Azure Functions format.

## Database Options

### Option A: Azure Database for PostgreSQL
```bash
az postgres server create \
  --resource-group eurofunds-rg \
  --name eurofunds-db \
  --location "East US" \
  --admin-user dbadmin \
  --admin-password YourPassword123! \
  --sku-name B_Gen5_1
```

### Option B: Continue using Neon Database
Keep your existing DATABASE_URL and no changes needed.

## SSL and Domain Setup

### Custom Domain
```bash
# Add custom domain
az webapp config hostname add \
  --webapp-name eurofunds-app \
  --resource-group eurofunds-rg \
  --hostname your-domain.com

# Enable SSL
az webapp config ssl bind \
  --certificate-thumbprint <thumbprint> \
  --ssl-type SNI \
  --name eurofunds-app \
  --resource-group eurofunds-rg
```

## Monitoring and Logging

### Application Insights
```bash
# Create Application Insights
az monitor app-insights component create \
  --app eurofunds-insights \
  --location "East US" \
  --resource-group eurofunds-rg
```

## Cost Optimization
- **Basic Tier (B1)**: ~$13/month for App Service
- **Free Tier**: Available for development/testing
- **Auto-scaling**: Configure based on usage patterns

## Recommended Workflow
1. **Start with App Service** - Easiest deployment
2. **Use existing Neon Database** - No migration needed
3. **Set up CI/CD** - GitHub Actions for automated deployments
4. **Monitor costs** - Set up billing alerts

## Next Steps After Deployment
1. Configure custom domain
2. Set up SSL certificate
3. Configure Application Insights
4. Set up automated backups
5. Configure scaling rules