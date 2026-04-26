---
title: Under the Hood
description: How Covalence finds the right memory — embedding model, asymmetric encoding, Matryoshka truncation, hybrid search, and recency weighting, with the concrete numbers that ship in v1.3.
---

Covalence turns text into vectors, stores them in SQLite, and combines vector similarity with keyword search to surface the memory your AI needs. Every step runs on your Mac. This page explains what's in the pipeline, and the numbers we picked.

## The embedding model

Covalence embeds every memory with [`nomic-embed-text-v1.5`](https://huggingface.co/nomic-ai/nomic-embed-text-v1.5), an open-weights text encoder from Nomic. The model ships as fp16 safetensors, bundled inside the app — roughly 261 MB on disk, no download step, no account.

It runs through [`jkrukowski/swift-embeddings`](https://github.com/jkrukowski/swift-embeddings) on `MLTensor`, Apple's unified compute surface. Requires macOS 15 (Sequoia) or later. Scheduling across ANE, GPU, and CPU is handled by the OS — the code does not pin to the Neural Engine.

The raw model output is a 768-dimension vector. We don't keep all of it. (Section 3 explains why.)

Memories shorter than 512 tokens embed as a single chunk. Longer memories split into overlapping chunks with 256 tokens of overlap; search returns the parent note, ranked by its best-matching chunk.

## Asymmetric search

Nomic trained this model to encode queries and documents asymmetrically. A query embedding and a document embedding of the same text are not the same vector — which is the point. Cosine similarity then scores the *retrieval* relationship, not surface resemblance.

The mechanism is a pair of task-specific text prefixes, injected before encoding:

- `search_document: ` — prepended when a memory is stored.
- `search_query: ` — prepended when a search runs.

Same model, different prompt. Queries and documents land in different regions of vector space, and similarity scores reflect "does this document answer this question" rather than "do these two strings look alike".

We could have trained a bi-encoder ourselves. Nomic already shipped one.

## Matryoshka truncation

The model was trained with Matryoshka Representation Learning (2022): the first *N* dimensions of its output are themselves a valid embedding, just at lower fidelity. That means the 768-dim vector can be truncated without retraining and still retrieve usefully.

Covalence keeps the first **256** floats, then re-normalises with vDSP (`vDSP_svesq` + `vDSP_vsdiv`). One truncation step. Not a schedule.

The trade-off, concretely: about 2% quality loss against the full 768-dim vector, three times smaller on disk — 1 KB per memory instead of 3. For a memory store that grows with every conversation, the factor of three matters more than the two percent.

No schedule. No rebuild step. Just the first 256 floats and a normalisation.

<svg role="img" aria-labelledby="rs-title rs-desc" width="760" height="260" viewBox="0 0 760 260" xmlns="http://www.w3.org/2000/svg" style="max-width: 100%; height: auto; margin: 1.5rem 0;">
  <title id="rs-title">Covalence retrieval pipeline</title>
  <desc id="rs-desc">A query flows through the embedding encoder and Matryoshka truncation to 256 dimensions, then fans out to vector search and keyword search in parallel; their ranked lists merge via reciprocal rank fusion, recency weighting is applied, and the final ranked results are returned.</desc>
  <defs>
    <marker id="rs-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
    </marker>
  </defs>
  <g stroke="currentColor" fill="none" stroke-width="1.5">
    <!-- Row 1: Query -> Encoder -> Truncation -->
    <rect x="10"  y="20" width="90"  height="36" rx="4" />
    <rect x="150" y="20" width="160" height="36" rx="4" />
    <rect x="360" y="20" width="290" height="36" rx="4" />
    <!-- Row 2: Vector search (left) and Keyword search (right) -->
    <rect x="60"  y="110" width="230" height="36" rx="4" />
    <rect x="410" y="110" width="230" height="36" rx="4" />
    <!-- Row 3: RRF merge -->
    <rect x="240" y="180" width="220" height="30" rx="4" />
    <!-- Row 4: Recency weighting -->
    <rect x="240" y="222" width="220" height="30" rx="4" />
    <!-- Connecting lines -->
    <line x1="100" y1="38" x2="150" y2="38" marker-end="url(#rs-arrow)" />
    <line x1="310" y1="38" x2="360" y2="38" marker-end="url(#rs-arrow)" />
    <!-- Truncation fans out to two branches -->
    <line x1="505" y1="56" x2="505" y2="80" />
    <line x1="175" y1="80" x2="775" y2="80" stroke="none" />
    <line x1="175" y1="80" x2="505" y2="80" />
    <line x1="505" y1="80" x2="525" y2="80" />
    <line x1="175" y1="80" x2="175" y2="110" marker-end="url(#rs-arrow)" />
    <line x1="525" y1="80" x2="525" y2="110" marker-end="url(#rs-arrow)" />
    <!-- Two branches converge into RRF -->
    <line x1="175" y1="146" x2="175" y2="165" />
    <line x1="525" y1="146" x2="525" y2="165" />
    <line x1="175" y1="165" x2="525" y2="165" />
    <line x1="350" y1="165" x2="350" y2="180" marker-end="url(#rs-arrow)" />
    <!-- RRF -> Recency -->
    <line x1="350" y1="210" x2="350" y2="222" marker-end="url(#rs-arrow)" />
  </g>
  <g fill="currentColor" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="12" text-anchor="middle">
    <text x="55"  y="43">Query</text>
    <text x="230" y="43">Embedding encoder</text>
    <text x="505" y="43">Matryoshka truncation: 768 → 256</text>
    <text x="175" y="133">Vector search (vec0 KNN)</text>
    <text x="525" y="133">FTS5 keyword search (BM25)</text>
    <text x="350" y="200">RRF merge (k = 60)</text>
    <text x="350" y="242">Recency weighting (10%)</text>
  </g>
</svg>

## Hybrid search

Two independent queries run on every search, and their ranked lists are merged.

- **Vector search** is a `vec0` K-nearest-neighbours query over the `memories_vec` virtual table from [sqlite-vec](https://github.com/asg017/sqlite-vec). It returns the closest 256-dim vectors by cosine similarity.
- **Keyword search** is an FTS5 BM25 query over `memories_fts`. Same database, different index.

Each branch fetches `max(limit × 4, 20)` candidates — and ×6 when any filter (tags, source, core) is active, because filters run after fetch in Swift, not in SQL. The branch has to over-fetch to leave enough survivors. Vector candidates also pass a pre-merge cosine threshold (default 0.3, configurable) so noise never reaches the merge step.

The merge itself is Reciprocal Rank Fusion — Cormack, Clarke, and Büttcher, 2009. Each document's fused score is a simple sum across branches:

```text
rrfScore(d) = Σ over branches  1 / (k + rank(d, branch))
```

Covalence uses `k = 60`, the widely-cited default from the original paper. The same constant ships in Microsoft Azure AI Search and Elastic's Reciprocal Rank Fusion retriever. It is not our choice — it is the standard.

## Recency weighting

After RRF, each candidate earns a recency adjustment based on the age of the memory.

The decay function is hyperbolic, not exponential:

```text
decayFactor = 1.0 / (1.0 + ageHours / 8760.0)
```

8760 is hours per year (24 × 365). A memory exactly one year old gets a decay factor of 0.5 — half weight in the recency component. Two years old: 1/3. A day old: about 0.997. The curve is gentle early, flatter later, and never quite hits zero.

Composition into the final ranking score:

```text
finalScore = 0.9 × rrfScore + 0.1 × decayFactor × 0.033
```

The `× 0.033` scales the decay factor into the same numeric range as a first-rank RRF score (which sits around 0.03 when k = 60). The 0.9 / 0.1 split means recency contributes **10%** of the final score.

Recency is 10% so that a very recent memory ranks above an equally-relevant old one, without letting recency override genuine relevance. A note written last week should win the tie against a note from two years ago. It should not beat a note that actually answers the question.

## Putting it together

When your AI calls `memory_search("project context")`, Covalence prepends `search_query: `, embeds the result, truncates to 256 floats, runs vec0 KNN and FTS5 BM25 in parallel, merges them with RRF at k = 60, and applies the hyperbolic recency boost. The top results come back — usually in well under a second, all on-device, no network round-trips.

The full tool surface lives in [MCP Tools](/docs/mcp-tools/). If you want to start from zero, the install path is [Getting Started](/docs/getting-started/).
