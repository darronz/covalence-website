---
title: How Search Works
description: The 5-signal ranking system behind Covalence's search — semantic similarity, keyword matching, source tiers, recency, and title-match boosting, fused with Reciprocal Rank Fusion.
---

Most memory tools rank results by vector similarity alone. Covalence blends five independent signals into a single relevance score using Reciprocal Rank Fusion (RRF). Each signal answers a different question about relevance — and the fusion means no single signal dominates.

## The five signals

### 1. Semantic similarity

The primary signal. Covalence embeds queries and memories with [`nomic-embed-text-v1.5`](https://huggingface.co/nomic-ai/nomic-embed-text-v1.5), a 256-dimensional Matryoshka vector model running on-device via MLTensor.

Queries and documents are encoded asymmetrically — `search_query:` prefix for your question, `search_document:` prefix for stored content — so similarity scores reflect "does this memory answer this question" rather than "do these strings look alike."

[sqlite-vec](https://github.com/asg017/sqlite-vec) provides cosine-distance KNN search over the vector index.

### 2. Keyword matching

Full-text search via SQLite FTS5 with BM25 scoring. Title matches are weighted **5x** higher than content matches.

This catches exact term matches that semantic search misses. Searching for "FileSyncService" by name is a keyword problem — semantic similarity would surface anything related to file syncing, but BM25 finds the exact string.

For File memories, the title is the file path, so searching for a filename finds the right document even if its content is about something else entirely.

### 3. Source tier

Not all memories carry the same weight. In search ranking, Covalence groups results by intent:

1. **Core** — pinned by the user as permanently important. Most trusted.
2. **File** — auto-indexed from a watched folder. Canonical project documents.
3. **MCP** — stored by an AI client during conversation. Ad-hoc captures.

A file that semantically matches your query is likely more authoritative than an MCP memory that happens to mention the same topic. The tier signal encodes that assumption, weighted at 20% of the RRF contribution.

**Note:** Browse order (when there's no search query) is different — Core, then MCP, then File — because browsing prioritises intentional knowledge over indexer output. Search ranking and browse order serve different purposes.

### 4. Recency

Recent memories get a small boost. The decay function is hyperbolic, not exponential:

```text
decayFactor = 1 / (1 + ageHours / 8760)
```

A memory one year old gets a decay factor of 0.5 — half weight. Two years: one-third. A day old: about 0.997. The curve is gentle early, flatter later, and never hits zero.

For File memories, recency uses the file's modification date, not when Covalence indexed it. A file modified yesterday ranks higher than one modified six months ago, even if both were indexed today.

Recency contributes **10%** of the final score — enough to break ties in favour of fresh content, not enough to override genuine relevance.

### 5. Title-match boost

If every word from the query appears in a result's title, that result gets a small bonus.

This solves version-number lookups. Searching for "roadmap 1.4" should surface `v1.4-ROADMAP.md` first, not every file that mentions "roadmap" somewhere in its body. FTS5 tokenises "1.4" as "1" and "4" separately, losing the version specificity — the title-match boost compensates by checking for the original terms as substrings.

## How the signals combine

Each signal independently ranks every candidate. Reciprocal Rank Fusion merges those ranked lists into one:

```text
finalScore = 0.90 × (vecRRF + ftsRRF + tierRRF + titleBoost)
           + 0.10 × recencyDecay × 0.033
```

Where:

- `vecRRF = 1 / (60 + vectorRank)` — semantic similarity, ranked
- `ftsRRF = 1 / (60 + ftsRank)` — keyword match, ranked
- `tierRRF = 0.20 × 1 / (60 + tier)` — source tier, weighted at 20%
- `titleBoost = 0.01` if all query words appear in the title, else 0
- `recencyDecay = 1 / (1 + ageHours / 8760)` — temporal freshness
- `k = 60` — the RRF smoothing constant from the original paper (Cormack, Clarke, and Buttcher, 2009)

RRF is parameter-free for the fusion step — it works with rank positions, not raw scores, so vector similarity and BM25 don't need to be on the same scale. The only tuned values are named constants, not ML-trained weights.

## Why RRF over learned weights

A developer can read the formula, change a constant, and rebuild in 30 seconds. There is no training loop, no model to retrain, no opaque weight matrix. The system is auditable by design.

The constants that control ranking:

| Constant | Value | Controls |
|----------|-------|----------|
| `k` | 60 | RRF smoothing — how compressed rank differences are |
| Title weight ratio | 5:1 | How much title matches beat content matches in BM25 |
| `fileTierWeight` | 0.20 | How much source type matters in ranking |
| Recency blend | 10% | How much freshness matters |
| Title-match bonus | 0.01 | Boost for full title matches |

## Retrieval quality

Covalence ships with `cov-benchmark`, a 10-query retrieval quality suite that scores result ordering against expected patterns. The benchmark covers:

- File lookup by name
- Broad topic search
- Personal recall
- Canonical file retrieval
- Temporal relevance
- Filtered search (tags, source)
- Exact title match
- Code reference
- Decision recall
- Space-scoped search

Current score: **30/30** (100%).
