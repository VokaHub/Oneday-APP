---
name: Bun lockfile installation behavior
description: Compatibility issue between the imported Bun lockfile and the package installer.
---

Before using the Replit package-install callback, check its Bun version against the imported lockfile. Bun 1.3 could not parse this project's `lockfileVersion: 2`, ignored it, rewrote it as version 1, resolved manifest ranges to current compatible versions, and added `bun-1.3` to `.replit`.

**Why:** dependencies were absent, so the initial lint/build checks could not start; installing them without preserving the imported setup changed tracked configuration.

**How to apply:** check the Bun and lockfile versions before dependency setup. After installing packages, inspect `.replit`, `package.json`, and `bun.lock` before continuing. Restore any generated tracked-file changes only if the pre-install tree was verified clean.
