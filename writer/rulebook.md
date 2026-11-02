# Writer rulebook

The goal of every post: a list people want to **save** and **send to someone**. The app is the place you keep it, and it only shows up on the last slide.

## Shape (7 slides)

1. **Cover**: a short kicker pill plus the hook.
2. **Items 1–5**: number, title, one line of detail.
3. **End**: a "save this" line plus one line naming the app.

## Cover

- Hook: at most 45 characters. It must be specific and promise something useful, e.g. "5 dinners that taste like takeout" or "gifts for him that aren't socks (under $50)".
- Good hook patterns:
  - "X that aren't Y"
  - "X that taste/feel like Y"
  - "X for when Y"
  - a number plus a specific result
  - a price cap in brackets
- Kicker: 2–4 words of context, e.g. "30 minutes or less", "for this weekend", "gift guide".
- Never reuse a hook that already appears in `log/posts.json`.

## Items

- Title: at most 32 characters (about 2 lines on the slide). Name the thing plainly.
- Detail: at most 75 characters. Give something concrete: what's in it, how long it takes, what it costs, or why it's good. No filler like "a must-have", "game changer" or "you'll love it".
- Generic ideas only: "a pottery class", not "Clay Studio on 5th St". Brands only when the item *is* the brand-free category ("cast iron skillet", not a specific product).
- Prices must be realistic and conservative. When unsure, leave the price out.
- Recipes need to work. Use real ingredients and a believable time.
- Five items unless the angle clearly needs 4 or 6.

## End slide

- `text`: "save this …" tied to the topic, e.g. "save this for your next grocery run", "send this to them, then save it", "save this before the holidays sneak up".
- `sub`: the series' `save_line` from `plan/series.json`, lightly varied is fine. Always write the app name in full: **Desktop: Save for Later**.

## Voice

- Lowercase, casual, like a friend's notes app. No emojis or exclamation marks on slides.
- Short sentences, specific nouns.

## App rules (never break)

- Name the app in full as "Desktop: Save for Later".
- Never claim features the app doesn't have. It saves posts, videos, links and photos in one place, and that's all you may imply.
- Never mention price, plans, limits or "free" for the app, on slides or in the caption.

## Caption and title

- `title` (TikTok post title): the hook, at most 90 characters.
- `caption`: one line that adds something (e.g. "the gnocchi one is the best"), then "save this for later", then 3–5 relevant lowercase hashtags (e.g. #dinnerideas #easyrecipes #giftideas #datenight #apartmentdecor). No app pitch in the caption beyond optionally "(i keep mine in Desktop: Save for Later)".

## spec.json shape

```json
{
  "series": "dinners",
  "angle": "dinners that taste like takeout",
  "title": "5 dinners that taste like takeout",
  "caption": "the gnocchi one is dangerous. save this for later #dinnerideas #easyrecipes #weeknightdinner",
  "slides": [
    { "kind": "cover", "kicker": "30 minutes or less", "text": "5 dinners that taste like takeout", "photo": "<download_asset url>", "unsplash_id": "jhAhm-mGiRg" },
    { "kind": "item", "n": 1, "title": "spicy garlic noodles", "detail": "instant noodles, chili crisp, lots of garlic, a splash of soy. 10 minutes.", "photo": "<download_asset url>", "unsplash_id": "pbc2wXbQYpI" },
    { "kind": "end", "text": "save this for your next grocery run", "sub": "i keep every recipe i save in Desktop: Save for Later", "photo": "<download_asset url>", "unsplash_id": "PyL-lApI1F8" }
  ]
}
```
