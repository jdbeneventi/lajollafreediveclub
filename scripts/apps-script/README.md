# Google Apps Script — the two backends behind `/api/waiver` and `/api/students`

Two Apps Script projects sit behind these routes. Until 2026-08-14 their source existed
only inside Google's script editor — no version history, no backup, nothing to restore
from if a project were deleted or an account changed. For the waiver log, a legal record,
that was the largest single gap in the system.

**Both are now in this directory**, pulled with `clasp` so they are byte-exact rather than
transcribed:

```
waivers/Code.js    44 lines   + appsscript.json
students/Code.js   48 lines   + appsscript.json
```

The `.clasp.json` in each folder is committed on purpose. It holds only the script ID and
file-extension settings — no local paths, no credentials — so `clasp pull` and `clasp push`
work for anyone who clones this repo and logs in.

---

## LJFC Waivers

| | |
|---|---|
| Script ID | `1sYGkf48Pl4s8rnYOuoJSsf4Xw7C3OwRjqL-fwcaQkbGPLYc-Mg8hiSMp` |
| Editor | https://script.google.com/home/projects/1sYGkf48Pl4s8rnYOuoJSsf4Xw7C3OwRjqL-fwcaQkbGPLYc-Mg8hiSMp/edit |
| Writes to Sheet | `1B9-yB-kUS4qDrUFlyP_JrTvRxhFFDCVVx01RsV5GRyo` |
| Called by | `src/app/api/waiver/route.ts` (`GOOGLE_SHEET_URL`) |
| File | `waivers/Code.js` (44 lines) |

**`doPost(e)`** — accepts JSON and appends one row:

```
[ name, email, phone, dateSigned, emergencyContact, medicalFlags ]
```

If the payload includes `pdfBase64`, it also:

1. finds or creates a Drive folder named **"LJFC Waivers"** (via a `getOrCreateFolder` helper),
2. decodes the base64 into a PDF named `<sanitised name> — <date>.pdf`,
3. creates the file in that folder,
4. writes the file's URL back into **column 7** of the row it just appended.

**On failure it writes the error into the waiver sheet itself** — a row of
`["ERROR", message, stack, timestamp, "", "", ""]`.

Two things follow from that. First, CLAUDE.md has long carried "waiver PDF archiving to
Google Drive not fully working — PDF upload fails on large payloads": the mechanism is
fully built and wired, so this is a payload-size problem, not a missing feature. Second,
**failed waiver submissions are visible as ERROR rows in the sheet** — that is where to
look when a waiver doesn't arrive, and it is worth scanning periodically, because nothing
else surfaces them.

## LJFC Students

| | |
|---|---|
| Script ID | `12hr4iWFnpUWSk7ogx-W2i38e6HFIiifjSupHZpktPkH1i0gPFesYZYUq` |
| Editor | https://script.google.com/home/projects/12hr4iWFnpUWSk7ogx-W2i38e6HFIiifjSupHZpktPkH1i0gPFesYZYUq/edit |
| Reads/writes Sheet | `17-XZMotYOiVIcJde2_Ppgxan7TFGBU6df-DI43Ygf8E` |
| Called by | `src/app/api/students/route.ts` (`STUDENTS_SHEET_URL`) |
| File | `students/Code.js` (48 lines) |

**`doPost(e)`** — appends one dive-log row:

```
[ student, date, author, type, note, depth, time, bolt ]
```

Returns `{status:"ok"}`, or `{error:<message>}` on failure.

**`doGet(e)`** — reads the whole sheet, uses row 1 as headers, and returns the rows as
JSON. Honours `?student=<name>` as a filter; with no parameter it returns every student's
logs.

> That "no parameter returns everything" behaviour is why `/api/students` needed
> authorising — see the access-control notes in CLAUDE.md.

---

## Refreshing these copies

Never transcribe from the editor by hand. A silent transcription error in a restored
waiver script is worse than no backup, because it would look correct. Use `clasp`, which
pulls byte-exact source over Google's API. No global install and no `sudo` needed:

```bash
npx @google/clasp login     # opens a browser; --no-localhost if that fails
```

Then, from inside `waivers/` or `students/` — the `.clasp.json` already there tells clasp
which project to talk to:

```bash
npx @google/clasp pull
```

`git diff` afterwards shows whether the running script has drifted from what's committed.

If Apps Script API access is disabled, clasp will say so; enable it once at
https://script.google.com/home/usersettings.

## Restoring after a loss

1. Create a new Apps Script project.
2. Paste in the matching `Code.js` from here.
3. Deploy → New deployment → Web app, execute as **Me**, access **Anyone**.
4. Copy the new `/exec` URL into the matching constant in `src/app/api/`.

Step 4 matters: the deployment URL changes, so the route constant must be updated and
redeployed. The URLs currently in use are in `waiver/route.ts` and `students/route.ts`.

## Keeping them in sync

Apps Script has no webhook for edits, so nothing detects drift between what's here and
what's running. If you change a script in the editor, re-run `clasp pull` and commit.
Re-verify these files whenever the waiver or coach-portal behaviour changes.
