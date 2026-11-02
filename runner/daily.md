# Daily run

You are running unattended for the TikTok account **desktop.saveforlater**. The owner set this up and explicitly asked for fully automated public posting. Work through these steps in order. Don't ask questions: if something is unclear, make the reasonable choice and note it in the final summary.

Constants:
- Metricool brand `blogId` "7809446", timezone `America/Los_Angeles`.
- Repo `amrslm/desktop-slides`, branch `main`.

## 1. Set up

1. Attach the repo with `add_repo` (owner `amrslm`, repo `desktop-slides`, access `push`).
2. Clone it with the command `add_repo` gives, into `~/desktop-slides`.
3. Run `cd design && npm install --no-audit --no-fund`. Playwright is already installed globally; never install it.
4. Set today: `TODAY=$(TZ=America/Los_Angeles date +%F)`. Get the UTC offset for any time with `TZ=America/Los_Angeles date -d "$TODAY 12:00" +%:z`.

## 2. Plan

1. Read `plan/schedule.json`. The last `ramp` entry whose `from` ≤ today gives N, the number of posts. The times are `times_by_count[N]`. Drop any time less than 45 minutes from now.
2. Call `getScheduledPosts` for today. If posts are already scheduled for today (a re-run), only make the missing ones.
3. Read `plan/series.json` and `log/posts.json`, then pick N posts:
   - Choose the series by weight. No series twice in a day unless N > number of series.
   - Don't let the same series take the same time slot two days running.
   - For each post, choose an angle from that series not used in the last 14 days, per the log.
   - Variations on an angle are fine, e.g. "gifts for her under $30" or "one-pan dinners with chicken".

## 3. Write and find photos

For each post:
1. Make a folder `media/$TODAY/NN-<series>` (NN = 01, 02…).
2. Write `spec.json` there, following `writer/rulebook.md` exactly, including `series`, `angle`, `title` and `caption`.
3. Find photos following `photos/rules.md`. Call `download_asset` for every photo you use, and put the returned URL in `photo`.

## 4. Build and check

1. Build each post: `node runner/build.mjs media/$TODAY/NN-<series>`. It prints the public links.
2. Make a contact sheet: `python3 runner/sheet.py /tmp/sheet.jpg media/$TODAY/*/`. Then look at it with Read.
3. Fix and rebuild any post where:
   - text is cut off or overlaps;
   - a title runs past 3 lines;
   - a photo doesn't show its item;
   - text is hard to read.
   You get at most 2 rebuilds per post.

## 5. Publish the files

1. Run `git add media && git commit -m "posts for $TODAY" && git push`.
2. Check every link returns 200: `curl -s -o /dev/null -w "%{http_code}" <url>`. If you get 404s, wait 30 seconds and retry. Stop after 3 tries.

## 6. Schedule

For each post, call `createScheduledPost`:
- `blogId` "7809446".
- `date` set to `"$TODAY"T<time>:00<offset>`.
- `info` set to this JSON string:

```json
{
  "providers": [{"network": "tiktok"}],
  "text": "<caption>",
  "media": ["<url 01>", "<url 02>", "..."],
  "publicationDate": {"dateTime": "<TODAY>T<time>:00", "timezone": "America/Los_Angeles"},
  "autoPublish": true,
  "draft": false,
  "tiktokData": {
    "privacyOption": "<schedule.json privacy>",
    "autoAddMusic": true,
    "title": "<title>",
    "photoCoverIndex": 0,
    "disableComment": false,
    "disableDuet": true,
    "disableStitch": true,
    "commercialContentOwnBrand": true,
    "commercialContentThirdParty": false
  }
}
```

`commercialContentOwnBrand` is true because the last slide promotes the owner's own app, and TikTok requires that to be disclosed.

If a call fails, read the error, fix the input and retry once. If it still fails, skip that post and note it.

## 7. Record

1. Append one entry per post to `log/posts.json`: `{date, time, folder, series, angle, title, slides, privacy, plannerUrl, status}`.
2. Append each photo used to `photos/used.json`: `{id, date}`.
3. Delete `media/` folders older than 21 days (`git rm -r`). By then the posts are long published.
4. Run `git add -A && git commit -m "log $TODAY" && git push`.

## 8. Summary

End with 3–6 lines: what was scheduled (time, series, hook) and anything that went wrong. Nothing else.
