# Novaris

Novaris is a desktop-first decision system for business owners. It connects operational delay risk and financial risk so teams can decide faster with clearer evidence.

## What Novaris does

- Runs two connected simulations:
  - Financial risk (`/financial`)
  - Delay risk (`/delay`)
- Converts delay into business impact (time, probability, and financial pressure)
- Uses objective inputs only (no free-form AI judgment fields)
- Provides narrative guidance in English and Bahasa Indonesia

## Core model design

### 1) Financial engine

The financial engine estimates:

- Survival probability
- Cash runway (months)
- Resilience shields (how many shocks the business can absorb)
- Risk drivers and mitigation suggestions

It uses Monte Carlo simulation and stress scenarios (sales shock, delay shock, and concurrent shocks).

### 2) Delay engine

The delay engine estimates:

- Delay probability
- Expected duration
- Delay range (optimistic to pessimistic)
- Critical bottlenecks
- Mitigation suggestions

It combines objective factors such as complexity, team ratio, supplier variance, external dependencies, historical delay rate, and remaining buffer.

## How confidence is handled (important)

Novaris accepts optional management confidence (`managementConfidence`) in the delay API, but confidence is intentionally bounded.

- Confidence does not replace objective risk data.
- Confidence can only adjust probability in a small range (max +/-12%).
- If stated confidence conflicts with objective signals, the objective signals dominate.

This avoids false certainty and keeps the model explainable.

## When delay monitoring is activated

Delay monitoring turns active when one or more trigger conditions are met:

- Expected completion exceeds target contract duration
- Predicted delay consumes remaining buffer
- Delay probability crosses watch threshold
- Top bottleneck impact is larger than remaining buffer

The API returns:

- `delayMonitoringActive`
- `delayMonitoringState` (`inactive`, `watch`, `active`, `critical`)
- `delayActivationReasons`

These are shown in the Delay simulator so owners know exactly why monitoring is active.

## API endpoints

- `POST /api/financial`
- `POST /api/delay`

Both routes validate payloads with Zod and run the canonical engine in `src/lib/engine/*`.

## Input UX behavior

- Controls are collapsible so users can focus on results.
- Active section shows all inputs at once (no hidden next-step flow).
- Inputs auto-save with clear status (`Saving...` -> `Saved`).
- Number fields support dot grouping for readability (e.g., `1.250.000`).

## Internationalization and currency

- Languages: English (`en`) and Bahasa Indonesia (`id`)
- Financial currency: USD and IDR
- Live FX fetch for USD -> IDR conversion with cached fallback

## SEO and metadata

- Route-level SEO titles/descriptions
- Open Graph and Twitter metadata
- Route-specific JSON-LD structured data
- `robots.txt` and `sitemap.xml`

## Run locally

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
```

## Deploy

This project is deployable on Vercel with API routes under `/api/*` and SPA fallback configured.
