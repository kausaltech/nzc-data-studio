// @ts-check
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { globalIgnores } from 'eslint/config';

import { getEslintConfig } from './kausal_common/configs/eslint.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config = getEslintConfig(__dirname);
config.push(globalIgnores(['./kausal_common/src/themes/**']));
export default config;
