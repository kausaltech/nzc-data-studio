# NetZeroPlanner Data Studio

Welcome to the NetZeroPlanner Data Studio project! This repository contains the code for the NetZeroPlanner Data Studio web application, built using Next.js, Material UI (MUI), and next-auth for authentication. This application is designed to help cities collect, manage, and visualize data related to their carbon reduction efforts.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Installation](#installation)
3. [Development](#development)
4. [Folder Structure](#folder-structure)
5. [Contributing](#contributing)
6. [License](#license)

## Getting Started

This section will guide you through setting up your development environment to work on the NetZeroPlanner Data Studio project.

### Prerequisites

Before you begin, ensure you have the following installed on your machine:

- [nvm](https://github.com/nvm-sh/nvm)
- [Node.js](https://nodejs.org/) (version 20.x)
- [npm](https://www.npmjs.com/) (version 9.x or higher)

## Installation

1. **Clone the repository:**

   ```sh
   git clone https://github.com/kausaltech/nzc-data-studio.git
   cd nzc-data-studio
   ```

2. **Ensure you're using the right Node version:**

   ```sh
   nvm use
   ```

3. **Install dependencies:**

   ```sh
   npm install
   ```

4. **Add necessary environment variables:**

   1. Generate an auth secret for next-auth:

      ```sh
      npx auth secret
      ```

      Copy the output to `.env.local`.

   2. Add the `AUTH` [environment variables](#environment-variables) to support authentication. If you're not sure which ones to use, check with the Kausal team.

   3. Add the desired API URL depending on your environment, if you're not sure which one to use, check with the Kausal team

      ```env
      KAUSAL_PUBLIC_API_URL=https://<API_URL>.dev
      ```

## Development

To start the development server:

```sh
npm run dev
```

This command will start the Next.js development server on [http://localhost:3000](http://localhost:3000).

### Building for Production

To build the project for production:

```sh
npm run build
```

This command will create an optimized production build in the `.next` directory.

### Running in Production Mode

After building the project, you can start the production server:

```sh
npm run start
```

The application will be available on [http://localhost:3000](http://localhost:3000).

### Environment variables

Variables prefixed with `KAUSAL_PUBLIC_` are made available client side. When using these environment variables, import them from `@/constants/environment` to support fallbacks.

- `KAUSAL_PUBLIC_PATHS_BACKEND_URL`: Configure the backend URL for Kausal Paths, e.g. a staging or local backend
- `KAUSAL_PUBLIC_DEPLOYMENT_TYPE`: The deployment type e.g `staging` or `production`
- `AUTH_SECRET`: Secret key used for encrypting tokens and cookies (this can be any random string)
- `AUTH_CLIENT_ID`: Client ID for authentication
- `AUTH_CLIENT_SECRET`: Client secret for authentication
- `KAUSAL_PUBLIC_AUTH_ISSUER`: URL of the authentication issuer; if not set, will use `KAUSAL_PUBLIC_PATHS_BACKEND_URL`

### Analyzing the Next Bundle

To analyze the bundle size, add `ANALYZE=true` to `.env.local` and run a production build. A treemap of the build output will open in your browser upon build.

## Folder Structure

Here is an overview of the project's folder structure:

```
nzc-data-studio/
├── public/                # Public assets such as images and fonts
├── app/                   # Next App Router directory, containing all paths and pages
├── components/            # React components
├── theme/                 # Material UI theme overrides
├── utils/                 # Shared utility functions
├── store/                 # Shared application state
```

### Store

We use [Zustand](<(https://github.com/pmndrs/zustand)>) for state management, with custom stores defined in `store/`. These stores handle various aspects of the application state, such as selected tabs, accordions, and framework instances. Unlike React Context, Zustand state can be accessed outside of components.

#### Persisting to local storage

The `useFrameworkInstanceStore` in `selected-framework-instance.ts` uses Zustand's `persist` middleware to save the selected instance, name, and baseline year to local storage. This allows the application to maintain state across page reloads.

When working with persisted stores, it's important to handle hydration correctly for server-side rendering. Our custom `use-store.ts` helper provides a custom hook that ensures the store is only accessed after the component has mounted on the client side:

## License

This project is licensed under the GNU AGPL License. See the [LICENSE](LICENSE) file for more information.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [Learn Material UI](https://mui.com/material-ui/getting-started/)

### Auto formatting with Prettier in VSCode

If you're using VSCode, install the [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) extension, open the VSCode settings and enable `Editor: Format On Save`.
