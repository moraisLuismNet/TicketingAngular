# TicketingAngular

Angular 20 frontend for the Ticketing system.

## Features

- **Authentication**: JWT-based login and registration
- **Tickets Management**: Full CRUD operations with filtering and comments
- **Modern UI**: Clean, professional design with responsive layout
- **Real-time Updates**: Live ticket status and comment updates
- **Progressive Web App (PWA)**: Installable app with offline support and native-like experience

## Prerequisites

- Node.js 18+ and npm
- Angular CLI 20

## Installation

```bash
npm install
```

## Development Server

```bash
npm start
```

Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Build

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Default Credentials

Use these credentials to login (from the backend seeding):

- **Admin**: `admin@ticketing.com` / `Admin123!`
- **Agent**: `agent@ticketing.com` / `Agent123!`
- **Customer**: `customer@ticketing.com` / `Customer123!`

## Project Structure

```
src/
├── app/
│   ├── core/              # Core services, models, guards, interceptors
│   ├── features/          # Feature modules (auth, tickets, etc.)
│   ├── shared/            # Shared components and layouts
│   └── app.config.ts      # Application configuration
├── environments/          # Environment configurations
└── styles.scss           # Global styles
```

## Technologies

- Angular 20 (Standalone Components)
- TypeScript 5.8
- RxJS 7.8
- CSS

## API Configuration

Update the API URL in `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'https://localhost:7001/api'
};
```

## 📱 Progressive Web App (PWA)

This application is configured as a PWA. For detailed information about PWA features, installation, and testing, see [PWA_SETUP.md](PWA_SETUP.md).

**Quick start:**
```bash
# Build for production (PWA only works in production mode)
npm run build

# Serve the production build
npx http-server dist/ticketing-angular/browser -p 8080
```

## 📸 Screenshots

| | | |
| :---: | :---: | :---: |
| <kbd><img src="img/01.png" width="40%" height="90%" alt="TicketingAngular_01"></kbd> | <kbd><img src="img/02.png" width="40%" height="90%" alt="TicketingAngular_02"></kbd> | <kbd><img src="img/03.png" width="90%" height="90%" alt="TicketingAngular_03"></kbd> |
| <kbd><img src="img/04.png" width="90%" height="90%" alt="TicketingAngular_04"></kbd> | <kbd><img src="img/05.png" width="110%" height="90%" alt="TicketingAngular_05"></kbd> | <kbd><img src="img/06.png" width="110%" height="90%" alt="TicketingAngular_06"></kbd> |
| <kbd><img src="img/07.png" width="90%" height="90%" alt="TicketingAngular_07"></kbd> | <kbd><img src="img/08.png" width="90%" height="90%" alt="TicketingAngular_08"></kbd> | <kbd><img src="img/09.png" width="90%" height="90%" alt="TicketingAngular_09"></kbd> |
| <kbd><img src="img/10.png" width="90%" height="90%" alt="TicketingAngular_10"></kbd> 

[DeepWiki moraisLuismNet/TicketingAngular](https://deepwiki.com/moraisLuismNet/TicketingAngular)

deployed in:
https://ticketing-angular.vercel.app/auth/login