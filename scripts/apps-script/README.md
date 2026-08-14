# Google Apps Script — the two backends that aren't in this repo

Two Apps Script projects sit behind `/api/waiver` and `/api/students`. Their source lives
only inside Google's script editor: no version history, no backup, no review, and nothing
to restore from if a project is deleted, an account changes, or Google alters the
platform. For the waiver log — a legal record — that is the most consequential gap in the
system.

This directory is where those sources belong. Until the `.gs` files are here, everything
below is what we know about them, recorded 2026-08-14 by reading the editor directly.

---

## LJFC Waivers

| | |
|---|---|
| Script ID | `1sYGkf48Pl4s8rnYOuoJSsf4Xw7C3OwRjqL-fwcaQkbGPLYc-Mg8hiSMp` |
| Editor | https://script.google.com/home/projects/1sYGkf48Pl4s8rnYOuoJSsf4Xw7C3OwRjqL-fwcaQkbGPLYc-Mg8hiSMp/edit |
| Writes to Sheet | `1B9-yB-kUS4qDrUFlyP_JrTvRxhFFDCVVx01RsV5GRyo` |
| Called by | `src/app/api/waiver/route.ts` (`GOOGLE_SHEET_URL`) |
| File | `Code.gs` |

**`doPost(e)`** — accepts JSON and appends one row:

```
[ name, email, phone, dateSigned, emergencyContact, medicalFlags ]
```

If the payload includes `pdfBase64`, it also:

1. finds or creates a Drive folder named **"LJFC Waivers"** (via a `getOrCreateFolder` helper),
2. decodes the base64 into a PDF named `<sanitised name> — <date>.pdf`,
3. creates the file in that folder,
4. writes the file's URL back into **column 7** of the row it just appended.

> Worth knowing: CLAUDE.md has long carried "waiver PDF archiving to Google Drive not
> fully working — PDF upload fails on large payloads." This confirms the mechanism is
> fully built and wired; the failure is payload size, not a missing feature.

## LJFC Students

| | |
|---|---|
| Script ID | `12hr4iWFnpUWSk7ogx-W2i38e6HFIiifjSupHZpktPkH1i0gPFesYZYUq` |
| Editor | https://script.google.com/home/projects/12hr4iWFnpUWSk7ogx-W2i38e6HFIiifjSupHZpktPkH1i0gPFesYZYUq/edit |
| Reads/writes Sheet | `17-XZMotYOiVIcJde2_Ppgxan7TFGBU6df-DI43Ygf8E` |
| Called by | `src/app/api/students/route.ts` (`STUDENTS_SHEET_URL`) |
| File | `Code.gs`, 49 lines |

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

## Getting exact copies into this directory

Do **not** transcribe these by hand from the editor. A silent transcription error in a
restored waiver script is worse than having no backup, because it would look correct.
Use `clasp`, which pulls byte-exact source:

```bash
npm install -g @google/clasp
clasp login          # opens a browser, sign in as joshuabeneventi@gmail.com
```

Then, from this directory:

```bash
mkdir waivers && cd waivers
clasp clone 1sYGkf48Pl4s8rnYOuoJSsf4Xw7C3OwRjqL-fwcaQkbGPLYc-Mg8hiSMp
cd ..

mkdir students && cd students
clasp clone 12hr4iWFnpUWSk7ogx-W2i38e6HFIiifjSupHZpktPkH1i0gPFesYZYUq
cd ..
```

Each clone produces `Code.gs` and `appsscript.json`. Commit both.

Delete the generated `.clasp.json` files before committing, or add them to `.gitignore` —
they hold local project state, not source.

If Apps Script API access is disabled, `clasp` will say so; enable it once at
https://script.google.com/home/usersettings.

## Restoring after a loss

1. Create a new Apps Script project.
2. Paste in `Code.gs` from here.
3. Deploy → New deployment → Web app, execute as **Me**, access **Anyone**.
4. Copy the new `/exec` URL into the matching constant in `src/app/api/`.

Step 4 matters: the deployment URL changes, so the route constant must be updated and
redeployed. The URLs currently in use are in `waiver/route.ts` and `students/route.ts`.

## Keeping them in sync

Apps Script has no webhook for edits, so nothing detects drift between what's here and
what's running. If you change a script in the editor, re-run `clasp pull` and commit.
Re-verify these files whenever the waiver or coach-portal behaviour changes.
