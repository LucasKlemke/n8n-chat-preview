#!/bin/bash

echo "🚀 Setting up NextAuth.js with Prisma..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found. Please create one based on .env.example"
    echo "Required environment variables:"
    echo "- DATABASE_URL"
    echo "- NEXTAUTH_URL"
    echo "- NEXTAUTH_SECRET"
    exit 1
fi

# Generate Prisma client
echo "📦 Generating Prisma client..."
npx prisma generate

# Run database migration
echo "🗄️ Running database migration..."
npx prisma migrate dev --name add-nextauth-models

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Make sure your DATABASE_URL is correct in .env"
echo "2. Run 'pnpm dev' to start the development server"
echo "3. Visit /auth/signup to create your first admin account"
echo "4. Visit /admin to access the admin panel"
