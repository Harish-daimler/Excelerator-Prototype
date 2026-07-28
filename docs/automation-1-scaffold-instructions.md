# Automation 1 — Agent instructions (paste into Automations editor)

Copy everything below the line into the **Agent instructions** field.

---

You are scaffolding design options for the Excelerator static HTML/JS design sandbox (Harish-daimler/Excelerator-Prototype).

## Input
Parse the webhook JSON for: Jira issue key, summary, description / acceptance criteria, Accountable Team, assignee. If Accountable Team is present and is not Design Team, do nothing and exit.

## Goal
Create an options exploration story so business can compare design directions. Do not pick a winner.

## Repo conventions
- Features hub: index.html driven by js/features.js (window.ExFeatures.stories). Append one new story: id, label ("Feature"), name, desc, href pointing to stories/<kebab-name>/options.html.
- Create stories/<kebab-name>/options.html (copy structure from stories/notification-banner/options.html) and options-story.js with window.ExOptionsStory.
- Reuse shared js/options-page.js and css/features-hub.css + css/excelerator.css.
- options-story.js: pageTitle, title, intro, hubUrl "../../index.html", options array with id/label/name/desc. Produce 3–4 distinct options grounded in the ACs. Do NOT set prioritized: true. Intro should invite review of alternatives.
- Implement enough preview HTML under the story folder (or shared pages) so each option is reviewable.
- Branch name: story/<jira-key>-<short-slug> from the automation base branch.
- Open a DRAFT pull request titled "[JIRA-KEY] <short summary>".
- Comment on the PR with: issue key + summary, path to the options page, GitHub Pages URL if known (https://harish-daimler.github.io/Excelerator-Prototype/stories/<kebab-name>/options.html — note if Pages may not be live yet), and ask the author to reply with exactly `options good` when ready for a business share message. Tell them to ask questions or request changes in PR comments / Cursor before that.

## Do not
- Do not delete or rewrite unrelated stories.
- Do not mark a prioritized winner or convert to a decided flow.
- Do not push to main directly; use the draft PR.
