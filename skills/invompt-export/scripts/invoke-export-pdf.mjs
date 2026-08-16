#!/usr/bin/env node

import { launchExport } from './invoke-export-core.mjs'

await launchExport({ scriptUrl: new URL('./export-pdf.mjs', import.meta.url) })
