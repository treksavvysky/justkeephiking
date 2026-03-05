# Remaining API Improvements

This document tracks review items that were not included in the initial security fix batch.

## 1) Validate pagination query parameters

Files:
- `app/src/app/api/v1/updates/route.ts`
- `app/src/app/api/trail-updates/route.ts`

Issue:
- `limit` and `offset` are parsed with `parseInt` and used directly.
- Invalid values (`NaN`, negative numbers, very large values) can lead to inconsistent pagination behavior.

Recommended change:
- Enforce bounds and integer validation:
  - `limit`: integer in `1..100`
  - `offset`: integer `>= 0`
- Return HTTP `400` with a `VALIDATION_ERROR` payload when invalid.

## 2) Consolidate API key logic

Files:
- `app/src/lib/api/auth.ts`
- `app/src/lib/api/actions.ts`

Issue:
- API key generation/revocation behavior is duplicated across two modules.
- This increases drift risk and makes permission checks harder to keep consistent.

Recommended change:
- Keep one source of truth for:
  - key generation
  - key revocation
  - shared validation helpers
- Remove dead/unused helpers after consolidation.

## 3) Add automated tests for auth/visibility/validation paths

Current state:
- There is no meaningful API route test coverage for key security paths.

Recommended change:
- Add route-level tests for:
  - API key auth behavior for `/api/v1/updates`
  - admin-only enforcement for `POST /api/trail-updates`
  - public-only aggregation behavior for `/api/v1/stats`
  - query param validation for `limit`/`offset`
- Include at least one regression test per previously identified issue.
