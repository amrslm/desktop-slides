# Weekly score

This run is unattended, once a week. Don't ask questions.

## 1. Set up

Attach and clone `amrslm/desktop-slides`, the same way as in `runner/daily.md` step 1. No npm install needed.

## 2. Pull results

1. Call `getAnalyticsAvailableMetrics` for TikTok to see which post-level metrics exist.
2. Call `getAnalyticsDataByMetrics` for brand "7809446", timezone `America/Los_Angeles`, covering the last 7 days. Get per-post views, likes, comments, shares and saves (whatever is available).
3. Match each post to `log/posts.json` by publish time and title.

## 3. Write the report

Write `log/weekly/<date>.md` with:
- A table of posts: date, series, hook, views, saves, shares.
- Each series' average views and saves per post.
- Top 3 and bottom 3 hooks.
- 2–4 plain observations, such as "gift guides get 3x the saves of dinners" or "hooks with a price cap do better".

## 4. Adjust the plan

Change these in small steps only:
- In `plan/series.json`, move each series' weight at most ±1 per week, toward saves + shares per post. Keep every weight ≥ 1.
- Add up to 2 new angles that resemble the best hooks. Remove angles that flopped twice.
- If a writing pattern clearly wins or loses, add one line about it under a "## Learned" heading in `writer/rulebook.md`.

## 5. Finish

1. Commit and push.
2. End with a 3–5 line summary for the owner: what worked, what changed, and one thing to consider.
