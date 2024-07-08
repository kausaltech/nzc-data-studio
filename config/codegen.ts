import { CodegenConfig } from '@graphql-codegen/cli';
import { TypeScriptDocumentsPluginConfig } from '@graphql-codegen/typescript-operations';

require('dotenv').config({ path: '.env.local' });

const apiUrl = process.env.KAUSAL_PUBLIC_API_URL;

if (!apiUrl) {
  throw new Error(
    'GraphQL API not specified, provide a URL via KAUSAL_PUBLIC_API_URL in your .env file.'
  );
}

const tsoConfig: TypeScriptDocumentsPluginConfig = {
  arrayInputCoercion: false,
  mergeFragmentTypes: true,
};

const config: CodegenConfig = {
  schema: `${apiUrl}/v1/graphql/`,
  generates: {
    'types/__generated__/possible_types.json': {
      plugins: ['fragment-matcher'],
      config: {
        useExplicitTyping: true,
      },
    },
    'types/__generated__/graphql.ts': {
      plugins: ['typescript', 'typescript-operations'],
      config: tsoConfig,
    },
  },
};

export default config;
