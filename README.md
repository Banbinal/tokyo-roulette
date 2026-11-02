# Draw a random metro station in Tokyo

Picks a random line, then a random stop on that line. Two modes:

- **Metro**: the 13 Tokyo Metro and Toei subway lines, 291 stops.
- **All rail**: 75 lines (JR East, subway, private railways, monorails, tram), 914 stops, limited to stations inside Tokyo Metropolis.

Rail data for the All rail mode comes from [Mini Tokyo 3D](https://github.com/nagix/mini-tokyo-3d), filtered with [dataofjapan/land](https://github.com/dataofjapan/land) boundaries.

**Live:** https://banbinal.github.io/tokyo-roulette/

https://github.com/Banbinal/tokyo-roulette/raw/main/media/demo.mp4

## Distribution

Each line has an equal chance, then each stop on it 1/n. Randomness comes from `crypto.getRandomValues` with rejection sampling, so no modulo bias.

```
node test/distribution.mjs
```

```
Metro: 13 lines, 291 stops — 100 runs × 100000 draws
  lines  mean p = 0.506 (expected ≈ 0.5)   p < 0.05 in 8 % of runs (expected ≈ 5 %)
  stops  mean p = 0.540 (expected ≈ 0.5)   p < 0.05 in 4 % of runs (expected ≈ 5 %)
All rail: 75 lines, 914 stops — 100 runs × 100000 draws
  lines  mean p = 0.475 (expected ≈ 0.5)   p < 0.05 in 7 % of runs (expected ≈ 5 %)
  stops  mean p = 0.483 (expected ≈ 0.5)   p < 0.05 in 5 % of runs (expected ≈ 5 %)
```
