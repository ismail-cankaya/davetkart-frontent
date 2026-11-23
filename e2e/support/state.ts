import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

/** Gift code seeded by scripts/e2e/backend.ps1 (100 %, every plan). */
export const GIFT_CODE = process.env.E2E_GIFT_CODE ?? 'E2EHEDIYE100';

const STATE_DIR = path.join(process.cwd(), 'e2e', '.state');

/** Owner's browser storage (auth token) after the publish journey. */
export const OWNER_STORAGE = path.join(STATE_DIR, 'owner.json');

const PUBLISHED = path.join(STATE_DIR, 'published.json');

export interface Published {
  invitationId: string;
  ownerEmail: string;
  names: { first: string; second: string };
}

export function savePublished(value: Published): void {
  mkdirSync(STATE_DIR, { recursive: true });
  writeFileSync(PUBLISHED, JSON.stringify(value, null, 2));
}

export function readPublished(): Published {
  return JSON.parse(readFileSync(PUBLISHED, 'utf8')) as Published;
}
