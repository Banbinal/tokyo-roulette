# Draw a random metro station in Tokyo

Picks a random Tokyo subway stop: one of the 13 lines (Tokyo Metro + Toei), then one stop on that line.

**Live:** https://banbinal.github.io/tokyo-roulette/

https://github.com/Banbinal/tokyo-roulette/raw/main/media/demo.mp4

## Distribution

Each line has a 1/13 chance, then each stop on it 1/n (n = 14 to 38 stops). Randomness comes from `crypto.getRandomValues` with rejection sampling, so no modulo bias.

```
node test/distribution.mjs
```

```
13 lines, 291 stops — 100 runs × 100000 draws
lines  mean p = 0.458 (expected ≈ 0.5)   p < 0.05 in 7 % of runs (expected ≈ 5 %)
stops  mean p = 0.511 (expected ≈ 0.5)   p < 0.05 in 5 % of runs (expected ≈ 5 %)
```
