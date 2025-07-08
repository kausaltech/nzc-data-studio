import type { CodegenConfig } from '@graphql-codegen/cli';
import type { TypeScriptDocumentsPluginConfig } from '@graphql-codegen/typescript-operations';
import type dotenv from 'dotenv';

(require('dotenv') as typeof dotenv).config({ path: '.env.local' });

const apiUrl = process.env.PATHS_BACKEND_URL;

if (!apiUrl) {
  throw new Error(
    'GraphQL API not specified, provide a URL via PATHS_BACKEND_URL in your .env file.'
  );
}

const tsoConfig: TypeScriptDocumentsPluginConfig = {
  arrayInputCoercion: false,
  mergeFragmentTypes: true,
  scalars: {
    UUID: 'string',
    RichText: 'string',
    PositiveInt: 'number',
    DateTime: 'string',
    JSONString: 'string',
  },
};

const config: CodegenConfig = {
  schema: `${apiUrl}/v1/graphql/`,
  documents: ['src/**/*.{ts,tsx}'],
  generates: {
    'src/types/__generated__/possible_types.json': {
      plugins: ['fragment-matcher'],
      config: {
        useExplicitTyping: true,
      },
    },
    'src/types/__generated__/graphql.ts': {
      plugins: ['typescript', 'typescript-operations'],
      config: tsoConfig,
    },
  },
};

export default config;
