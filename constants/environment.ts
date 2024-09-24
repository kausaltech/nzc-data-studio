import { getPublicEnvVariables } from '@/utils/environment';

type DeploymentType = 'production' | 'development' | 'testing';

export const isDev = process.env.NODE_ENV === 'development';

export const authTestPassword = isDev
  ? process.env.AUTH_TEST_PASSWORD
  : undefined;

export const isServer = typeof window === 'undefined';

export const publicEnvVars = getPublicEnvVariables();

export const apiUrl = publicEnvVars.KAUSAL_PUBLIC_API_URL || `${publicEnvVars.KAUSAL_PUBLIC_BACKEND_URL}/v1`;
export const authIssuer = publicEnvVars.KAUSAL_PUBLIC_AUTH_ISSUER || `${publicEnvVars.KAUSAL_PUBLIC_BACKEND_URL}`;

export const deploymentType: DeploymentType =
  publicEnvVars.KAUSAL_PUBLIC_DEPLOYMENT_TYPE as DeploymentType;
