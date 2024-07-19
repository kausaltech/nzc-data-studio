import { getPublicEnvVariables } from '@/utils/environment';

type DeploymentType = 'production' | 'development' | 'testing';

export const isDev = process.env.NODE_ENV === 'development';

export const authTestPassword = isDev
  ? process.env.AUTH_TEST_PASSWORD
  : undefined;

export const isServer = typeof window === 'undefined';

export const publicEnvVars = getPublicEnvVariables();

export const apiUrl = publicEnvVars.KAUSAL_PUBLIC_API_URL;

export const authIssuer = publicEnvVars.KAUSAL_PUBLIC_AUTH_ISSUER;

export const deploymentType: DeploymentType =
  publicEnvVars.KAUSAL_PUBLIC_DEPLOYMENT_TYPE as DeploymentType;
