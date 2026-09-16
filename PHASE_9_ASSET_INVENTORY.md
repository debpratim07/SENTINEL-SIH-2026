# Phase 9 motion pack inventory

Official input: Industrial_Flow_Motion_Asset_Pack.zip. 74 files. No video, raster, Lottie or binary runtime assets.

Selected React/SVG components: HeroFlow, PipelineLoader, CompletionFlow, EmptyState and their five geometry/accessibility dependencies. One shared pair of CSS files replaces duplicated styles embedded in the 12 SVG exports. SENTINEL overrides the pack palette. No new runtime dependencies.

Unused: preview and preview-dist builds (duplicate React/runtime bundles), package/lock/build scripts (standalone showcase tooling), exported SVGs (duplicate geometry/styles), icons (existing Lucide system retained), process stepper (can imply completed stages), conflict/incomplete/unconnected art (unsupported workflows), generic animation wrappers (existing accessible overlays preserved and hardened).

CompletionFlow is used only inside backend-confirmed capture/review or Supabase-confirmed password success. Empty artwork stays neutral. Hero motion runs once; only genuine loading loops. Reduced motion retains static labels.

| Archive file | Bytes |
| --- | ---: |
| .gitignore | 43 |
| README.md | 6486 |
| THIRD_PARTY_NOTICES.md | 1372 |
| components/AnimatedStatus.tsx | 710 |
| components/CompletionFlow.tsx | 934 |
| components/ConflictJunction.tsx | 722 |
| components/EmptyState.tsx | 1413 |
| components/FlowJunction.tsx | 450 |
| components/FlowLine.tsx | 351 |
| components/FlowNode.tsx | 1151 |
| components/FlowPath.tsx | 351 |
| components/FlowPulse.tsx | 629 |
| components/FlowSymbol.tsx | 1536 |
| components/HeroFlow.tsx | 3766 |
| components/IncompleteFlow.tsx | 704 |
| components/MotionDrawer.tsx | 184 |
| components/MotionModal.tsx | 182 |
| components/MotionPanel.tsx | 182 |
| components/MotionPopover.tsx | 186 |
| components/MotionSurface.tsx | 1508 |
| components/PipelineLoader.tsx | 1225 |
| components/ProcessFlow.tsx | 1871 |
| components/ProcessStepper.tsx | 250 |
| components/Reveal.tsx | 519 |
| components/StaggerGroup.tsx | 569 |
| components/UnconnectedFlow.tsx | 614 |
| components/shared.tsx | 1062 |
| docs/INTEGRATION_GUIDE.md | 8504 |
| docs/MOTION_SYSTEM.md | 4664 |
| docs/VERIFICATION.md | 2580 |
| docs/VISUAL_SYSTEM.md | 4592 |
| icons/blocked.svg | 341 |
| icons/connection.svg | 379 |
| icons/control.svg | 508 |
| icons/history.svg | 332 |
| icons/junction.svg | 432 |
| icons/node.svg | 332 |
| icons/output.svg | 371 |
| icons/route.svg | 410 |
| icons/source.svg | 389 |
| icons/success.svg | 347 |
| illustrations/completion-flow.svg | 12634 |
| illustrations/conflict-junction.svg | 12469 |
| illustrations/empty-activity.svg | 11722 |
| illustrations/empty-collection.svg | 11721 |
| illustrations/empty-review.svg | 11750 |
| illustrations/empty-search.svg | 11697 |
| illustrations/empty-success.svg | 11766 |
| illustrations/hero-flow.svg | 17895 |
| illustrations/incomplete-flow.svg | 12349 |
| illustrations/pipeline-loader.svg | 12362 |
| illustrations/process-flow.svg | 12967 |
| illustrations/unconnected-flow.svg | 12135 |
| index.html | 334 |
| index.ts | 1196 |
| package.json | 1033 |
| pnpm-lock.yaml | 23220 |
| pnpm-workspace.yaml | 50 |
| preview/main.tsx | 13250 |
| preview/showcase.css | 18772 |
| preview/standalone.css | 26958 |
| preview/standalone.html | 359 |
| preview/standalone.js | 254037 |
| preview-dist/assets/index-KU4pc_Go.js | 252013 |
| preview-dist/assets/index-YbF6uS0o.css | 27035 |
| preview-dist/index.html | 431 |
| scripts/build-standalone.mjs | 780 |
| scripts/export-assets.mjs | 345 |
| scripts/export-assets.tsx | 2471 |
| tokens/motion.css | 5083 |
| tokens/motionTokens.ts | 284 |
| tokens/tokens.css | 6155 |
| tsconfig.json | 381 |
| vite.config.ts | 139 |
