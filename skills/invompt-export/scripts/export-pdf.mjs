#!/usr/bin/env node

import { runExportCli } from './export-core.mjs'

await runExportCli({ allowedOrigin: 'https://invompt.com' })
