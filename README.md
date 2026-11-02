# desktop-slides

This repo runs the automated TikTok slideshows for **desktop.saveforlater**, which promotes the iOS app Desktop: Save for Later.

Every morning a scheduled run plans the day's posts, writes them, finds photos, renders the slides, puts them here, and schedules them on TikTok through Metricool. Once a week a second run scores the posts and adjusts the plan.

## The parts

Each part is one file or folder, so you can upgrade one without touching the others.

| Part | File | Job |
|---|---|---|
| Plan | `plan/series.json` | Which series and angles to post, and how often (weights) |
| Writer | `writer/rulebook.md` | How a slideshow is written: hook, items, end slide, caption |
| Photos | `photos/rules.md`, `photos/used.json` | How photos are found on Unsplash, and which were already used |
| Design | `design/render.mjs` | The slide template (1080×1920, TikTok-style text boxes) |
| Host | `media/` | Rendered slides. Public links let Metricool fetch them |
| Post | `plan/schedule.json` | Posts per day, times, privacy, music |
| Score | `runner/weekly.md`, `log/weekly/` | Weekly results, and adjustments to the plan |
| Runner | `runner/daily.md`, `runner/build.mjs` | The steps the daily run follows |

`log/posts.json` records every post that was scheduled.

## Changing something

Say which part and what to change, e.g. "Writer: hooks are too long" or "Post: go to 3 a day". Only that file changes, and the next run uses it.
