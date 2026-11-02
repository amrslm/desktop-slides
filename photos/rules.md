# Photo rules

One photo per slide, from Unsplash (the Unsplash connector).

## Finding

- Use `search_photos` with `orientation: "portrait"` and `per_page` 8–10. Search for what the slide shows, in plain words: "garlic noodles bowl", "pottery wheel hands", "cast iron skillet steak".
- Pick a photo that clearly shows **that** item. If nothing fits, rewrite the item rather than use a vague photo.
- The cover needs a strong, simple image with calm space in the middle for the hook.
- The end slide can be a mood shot (a kitchen, a cozy room, wrapped gifts).

## Avoid

- Unsplash+ / premium photos (they are watermarked).
- Photos with readable brand logos, big text, or a recognizable real venue.
- Close-up faces as the main subject.
- Photographers whose bio or description asks to be contacted for commercial use.
- Any photo id already listed in `photos/used.json` within the last 30 days.

## Using

- Call `download_asset` for every photo you use (Unsplash requires it). Put the URL it returns in the slide's `photo` field and the id in `unsplash_id`.
- After posting, add each id with the date to `photos/used.json`.
