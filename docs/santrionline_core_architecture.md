# SantriOnline.com Super App Core Architecture

## Rekomendasi Tech Stack

### Frontend Web (Super App Shell)

- **Framework**: Remix + Vite dengan React 18 dan TypeScript (menggunakan Cloudflare Pages/Workers sebagai runtime).
- **UI Layer**: Tailwind CSS dengan komponen Headless UI/Shadcn untuk aksesibilitas.
- **State Management**: React Query (TanStack Query) untuk pengambilan data, Zustand untuk state lokal ringan.
- **Internasionalisasi**: remix-i18next atau solusi i18n berbasis Remix dengan fallback ke bahasa Indonesia, Inggris, dan Arab.
- **Analitik**: Integrasi Segment/Amplitude SDK + Cloudflare Web Analytics/PostHog untuk event kustom per modul.

### Mobile

- **Framework**: Expo (React Native) dengan monorepo yang berbagi komponen dan utilitas melalui paket bersama lintas platform.
- **Distribusi**: Expo EAS untuk build Android/iOS.

### Backend & API

- **Framework**: NestJS (TypeScript) dengan arsitektur modular, mendukung REST & GraphQL.
- **ORM**: Prisma dengan PostgreSQL (Managed: Neon/PlanetScale untuk global read replicas).
- **Autentikasi**: Clerk/Auth0 untuk multi-platform OAuth, fallback email OTP; JWT untuk sesi API; dukungan SSO pesantren.
- **Cache & Queue**: Redis (Upstash/ElastiCache) untuk rate limiting, session store, job queue (BullMQ).
- **Object Storage**: S3-compatible (Cloudflare R2/Wasabi) untuk media kajian.
- **Search**: MeiliSearch/Algolia untuk konten kajian & produk.

### Infrastruktur

- **Deployment**: Cloudflare Pages/Workers untuk aplikasi Remix web, Fly.io/Render/Kubernetes untuk layanan NestJS & worker.
- **API Gateway**: Kong/NGINX Ingress dengan observabilitas (OpenTelemetry, Grafana, Prometheus).
- **CI/CD**: GitHub Actions dengan lint, test, preview deploy; Infrastructure-as-Code (Terraform) untuk environment konsisten.

### Data & Observabilitas

- **Database**: PostgreSQL multi-tenant (schema per modul) + Read replicas.
- **Analytics & Logging**: OpenTelemetry + Grafana Loki + ClickHouse untuk event analytics mendalam.
- **Feature Flag**: LaunchDarkly/GrowthBook untuk rollout modular.

### Keamanan & Kepatuhan

- **Secrets Management**: Doppler/Vault.
- **Compliance**: Enkripsi at-rest (KMS), audit trail (temporal tables), dan log kegiatan admin.

## Skema Database Modul Inti

```mermaid
erDiagram
    USER ||--o{ USER_SESSION : has
    USER ||--|| USER_PROFILE : owns
    USER ||--o{ USER_ROLE : assigned
    USER ||--o{ USER_PREFERENCE : configures
    USER ||--o{ USER_VERIFICATION : requests
    ROLE ||--o{ USER_ROLE : includes
    USER ||--o{ NOTIFICATION : receives
    NOTIFICATION ||--o{ NOTIFICATION_EVENT : triggered_by
    USER ||--o{ AUDIT_LOG : generates

    USER {
        uuid id PK
        string email UK
        string password_hash
        string phone_number
        boolean is_active
        boolean is_email_verified
        timestamp created_at
        timestamp updated_at
    }

    USER_PROFILE {
        uuid user_id PK, FK -> USER.id
        string full_name
        string display_name
        string gender ENUM('male','female','other')
        date birth_date
        string pesantren_affiliation
        string country_code
        string timezone
        jsonb metadata
        timestamp created_at
        timestamp updated_at
    }

    USER_SESSION {
        uuid id PK
        uuid user_id FK -> USER.id
        string refresh_token_hash
        string user_agent
        string ip_address
        timestamp last_seen_at
        timestamp expires_at
        timestamp created_at
    }

    ROLE {
        uuid id PK
        string code UK
        string name
        string description
        timestamp created_at
    }

    USER_ROLE {
        uuid id PK
        uuid user_id FK -> USER.id
        uuid role_id FK -> ROLE.id
        string scope -- modul (core, cms, elearning, dsb.)
        timestamp assigned_at
        uuid assigned_by FK -> USER.id
    }

    USER_PREFERENCE {
        uuid id PK
        uuid user_id FK -> USER.id
        string key
        jsonb value
        timestamp created_at
        timestamp updated_at
    }

    USER_VERIFICATION {
        uuid id PK
        uuid user_id FK -> USER.id
        string channel ENUM('email','sms','whatsapp')
        string code_hash
        integer attempt_count
        timestamp expires_at
        timestamp verified_at
        timestamp created_at
    }

    NOTIFICATION {
        uuid id PK
        uuid user_id FK -> USER.id
        string channel ENUM('in_app','email','push','whatsapp')
        string title
        text body
        jsonb payload
        string status ENUM('pending','sent','failed','read')
        timestamp scheduled_for
        timestamp sent_at
        timestamp read_at
        timestamp created_at
    }

    NOTIFICATION_EVENT {
        uuid id PK
        uuid notification_id FK -> NOTIFICATION.id
        string event_type ENUM('delivery','open','click','error')
        jsonb metadata
        timestamp created_at
    }

    AUDIT_LOG {
        uuid id PK
        uuid user_id FK -> USER.id
        string action
        string module
        jsonb context
        string ip_address
        timestamp created_at
    }
```

## Contoh Implementasi API (NestJS + Prisma)

```ts
// src/auth/dto/register.dto.ts
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsOptional()
  @IsString()
  fullName?: string;
}
```

```ts
// src/auth/dto/login.dto.ts
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  password!: string;
}
```

```ts
// src/auth/auth.service.ts
import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(payload: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: payload.email } });
    if (existing) {
      throw new ConflictException('Email sudah terdaftar.');
    }

    const passwordHash = await argon2.hash(payload.password);

    const user = await this.prisma.user.create({
      data: {
        email: payload.email,
        passwordHash,
        profile: {
          create: {
            fullName: payload.fullName ?? '',
          },
        },
      },
      include: { profile: true },
    });

    const tokens = await this.generateTokens(user.id, user.email);

    return { user, ...tokens };
  }

  async login(payload: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: payload.email } });

    if (!user) {
      throw new UnauthorizedException('Kredensial tidak valid.');
    }

    const passwordValid = await argon2.verify(user.passwordHash, payload.password);
    if (!passwordValid) {
      throw new UnauthorizedException('Kredensial tidak valid.');
    }

    const tokens = await this.generateTokens(user.id, user.email);
    return { user, ...tokens };
  }

  private async generateTokens(userId: string, email: string) {
    const payload = { sub: userId, email };
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '30d',
      secret: process.env.JWT_REFRESH_SECRET,
    });

    await this.prisma.userSession.create({
      data: {
        userId,
        refreshTokenHash: await argon2.hash(refreshToken),
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      },
    });

    return { accessToken, refreshToken };
  }
}
```

```ts
// src/auth/auth.controller.ts
import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() payload: RegisterDto) {
    return this.authService.register(payload);
  }

  @Post('login')
  login(@Body() payload: LoginDto) {
    return this.authService.login(payload);
  }
}
```

```ts
// src/prisma/prisma.service.ts
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
```

```ts
// src/app.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '15m' },
    }),
    AuthModule,
  ],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
```

```ts
// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, PrismaService],
})
export class AuthModule {}
```

```prisma
// prisma/schema.prisma
model User {
  id             String         @id @default(uuid())
  email          String         @unique
  passwordHash   String
  phoneNumber    String?        @db.VarChar(32)
  isActive       Boolean        @default(true)
  isEmailVerified Boolean       @default(false)
  createdAt      DateTime       @default(now())
  updatedAt      DateTime       @updatedAt
  profile        UserProfile?
  sessions       UserSession[]
  roles          UserRole[]
  preferences    UserPreference[]
  verifications  UserVerification[]
  notifications  Notification[]
  auditLogs      AuditLog[]
}

model UserProfile {
  userId             String   @id
  fullName           String   @default("")
  displayName        String?  @db.VarChar(120)
  gender             Gender?
  birthDate          DateTime?
  pesantrenAffiliation String?
  countryCode        String?  @db.VarChar(8)
  timezone           String?  @db.VarChar(64)
  metadata           Json?
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt
  user               User     @relation(fields: [userId], references: [id])
}

enum Gender {
  male
  female
  other
}

model UserSession {
  id               String   @id @default(uuid())
  userId           String
  refreshTokenHash String
  userAgent        String?
  ipAddress        String? @db.VarChar(64)
  lastSeenAt       DateTime?
  expiresAt        DateTime
  createdAt        DateTime @default(now())
  user             User     @relation(fields: [userId], references: [id])
}

model Role {
  id          String    @id @default(uuid())
  code        String    @unique
  name        String
  description String?
  createdAt   DateTime  @default(now())
  users       UserRole[]
}

model UserRole {
  id         String   @id @default(uuid())
  userId     String
  roleId     String
  scope      String?  @db.VarChar(64)
  assignedAt DateTime @default(now())
  assignedBy String?
  user       User     @relation(fields: [userId], references: [id])
  role       Role     @relation(fields: [roleId], references: [id])
}

model UserPreference {
  id        String   @id @default(uuid())
  userId    String
  key       String
  value     Json
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  user      User     @relation(fields: [userId], references: [id])
}

model UserVerification {
  id           String   @id @default(uuid())
  userId       String
  channel      VerificationChannel
  codeHash     String
  attemptCount Int      @default(0)
  expiresAt    DateTime
  verifiedAt   DateTime?
  createdAt    DateTime @default(now())
  user         User     @relation(fields: [userId], references: [id])
}

enum VerificationChannel {
  email
  sms
  whatsapp
}

model Notification {
  id           String    @id @default(uuid())
  userId       String
  channel      NotificationChannel
  title        String
  body         String
  payload      Json?
  status       NotificationStatus @default(pending)
  scheduledFor DateTime?
  sentAt       DateTime?
  readAt       DateTime?
  createdAt    DateTime @default(now())
  user         User      @relation(fields: [userId], references: [id])
  events       NotificationEvent[]
}

enum NotificationChannel {
  in_app
  email
  push
  whatsapp
}

enum NotificationStatus {
  pending
  sent
  failed
  read
}

model NotificationEvent {
  id             String   @id @default(uuid())
  notificationId String
  eventType      NotificationEventType
  metadata       Json?
  createdAt      DateTime @default(now())
  notification   Notification @relation(fields: [notificationId], references: [id])
}

enum NotificationEventType {
  delivery
  open
  click
  error
}

model AuditLog {
  id        String   @id @default(uuid())
  userId    String
  action    String
  module    String
  context   Json?
  ipAddress String? @db.VarChar(64)
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id])
}
```
