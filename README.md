# Lantern Tide

A small original side-view pinball adventure inspired by *Yoku's Island Express*. Roll a tethered ball through one connected island, collect fruit, light three lanterns and deliver a seed to the lighthouse. Original code and canvas artwork; this fan project is not affiliated with Villa Gorilla or Team17.

## Play locally

Run `python3 -m http.server 8000 --bind 127.0.0.1` in this directory and visit http://127.0.0.1:8000. No build or dependencies are required. Move with arrows or A/D; Z activates orange left flippers and X activates gold right flippers. Touch controls appear on narrow screens. There is no jump: flippers and bumpers launch the ball and its courier. A fall returns you to the latest region at the cost of one fruit. Light all three lanterns to finish at the lighthouse; Restart begins a new journey.

## Scope and research

The game draws on the source's tethered courier, horizontal walking, flipper propulsion, bumpers, collectibles, interconnected exploration and gated progression. See [Team17's overview](https://www.team17.com/games/yokus-island-express), [Nintendo's gameplay description](https://www.nintendo.com/jp/topics/article/d660e1ba-9eea-11e9-b641-063b7ac45a6d), and [Team17's abilities overview](https://www.team17.com/news/yokus-island-express-new-abilities-revealed). This is a short handcrafted interpretation, not a recreation of the full game: it does not include quests, NPC dialogue, ability upgrades, fast travel, saving, audio, or the original's large map and intricate pinball tables. A 2D canvas fits the planar gameplay and keeps the game self-contained.

## Tests

Run `node tests/game.test.js` for movement, both flippers, collectible uniqueness, gate completion, and fall recovery.

## License

MIT; see [LICENSE](LICENSE). The `.gitignore` combines GitHub's Global Linux, macOS and Windows templates.

## Arcade metadata

See [docs/arcade-metadata.md](docs/arcade-metadata.md) for the game-owned manifest and screenshot provenance.
