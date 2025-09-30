# NextAuth.js Authentication Setup

This project now includes NextAuth.js authentication with Prisma integration. Here's what has been implemented:

## 🔧 What's Been Added

### 1. **Dependencies**
- `next-auth` - Authentication library
- `@next-auth/prisma-adapter` - Prisma adapter for NextAuth
- `bcryptjs` - Password hashing

### 2. **Database Schema Updates**
Updated `prisma/schema.prisma` with NextAuth.js required models:
- `User` - Extended with NextAuth fields
- `Account` - OAuth provider accounts
- `Session` - User sessions
- `VerificationToken` - Email verification tokens

### 3. **Authentication Configuration**
- `lib/auth.ts` - NextAuth configuration with credentials provider
- `app/api/auth/[...nextauth]/route.ts` - NextAuth API routes
- `app/api/auth/register/route.ts` - User registration endpoint

### 4. **Authentication Pages**
- `app/auth/signin/page.tsx` - Login page
- `app/auth/signup/page.tsx` - Registration page

### 5. **Components**
- `components/auth/logout-button.tsx` - Logout component
- Updated `components/admin/admin-header.tsx` - Shows user info
- Updated `components/admin/admin-login.tsx` - Redirects to signin

### 6. **Middleware**
- `middleware.ts` - Protects admin routes

### 7. **Layout Updates**
- Updated `app/layout.tsx` - Added SessionProvider

## 🚀 Setup Instructions

### 1. **Environment Variables**
Create a `.env` file with:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/my_ai_app"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
```

### 2. **Database Migration**
Run the migration to update your database:
```bash
npx prisma migrate dev --name add-nextauth-models
```

### 3. **Generate Prisma Client**
```bash
npx prisma generate
```

### 4. **Start Development Server**
```bash
pnpm dev
```

## 📱 Usage

### **Creating an Admin Account**
1. Visit `/auth/signup`
2. Fill in your details
3. Click "Criar Conta"

### **Logging In**
1. Visit `/auth/signin`
2. Enter your credentials
3. You'll be redirected to `/admin`

### **Accessing Admin Panel**
- Visit `/admin` (protected route)
- If not logged in, you'll see the login prompt
- Once logged in, you'll see the admin dashboard

### **Logging Out**
- Click the "Sair" button in the admin header
- You'll be redirected to the home page

## 🔒 Security Features

- **Password Hashing**: Passwords are hashed using bcryptjs
- **JWT Sessions**: Secure session management
- **Route Protection**: Admin routes are protected by middleware
- **Input Validation**: Form validation with Zod schemas

## 🛠️ Customization

### **Adding OAuth Providers**
To add Google, GitHub, or other OAuth providers, update `lib/auth.ts`:

```typescript
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    // ... existing credentials provider
  ],
  // ... rest of config
};
```

### **Customizing User Model**
The User model can be extended with additional fields in `prisma/schema.prisma`:

```prisma
model User {
  id            String    @id @default(cuid())
  nome          String
  email         String    @unique
  password      String?
  emailVerified DateTime? @map("email_verified")
  image         String?
  role          String    @default("user") // Add custom fields
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")
  // ... rest of fields
}
```

## 🐛 Troubleshooting

### **Database Connection Issues**
- Ensure your `DATABASE_URL` is correct
- Check if your database server is running
- Verify network connectivity

### **Prisma Client Errors**
- Run `npx prisma generate` after schema changes
- Ensure all migrations are applied

### **NextAuth Errors**
- Check `NEXTAUTH_SECRET` is set
- Verify `NEXTAUTH_URL` matches your domain
- Check browser console for detailed errors

## 📚 Next Steps

1. **Email Verification**: Add email verification for new accounts
2. **Password Reset**: Implement password reset functionality
3. **Role-Based Access**: Add user roles and permissions
4. **OAuth Integration**: Add social login providers
5. **Audit Logging**: Track user actions and login attempts
