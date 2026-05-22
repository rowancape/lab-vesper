# lab-vesper

The name means absolutely nothing. I just figured that if I'm going to start uploading all my half-baked stuff into GitHub I should come up with some common naming scheme for them all, so I'm going to start prefixing them all with lab and giving them a random fancy word.

This is a SvelteKit recipe site project where I am currently experimenting with complex form handling, server validation, and UI patterns.

Currently using:
- SvelteKit (hey, this one I might be pretty decent at by now 😎)
- TypeScript (still a lot to learn)
- shadcn-svelte (completely new to me)
- Valibot (completely new to me)
- SQLite (completely new to me)
- Drizzle ORM (completely new to me)

Previously used Zod instead of Valibot, which you may be able to find from the commit history, but I am unsure. Switched to Valibot mainly to experiment and because Zod became annoying to use with really large forms (so far Valibot has been pretty annoying too)

The root +page.svelte file also contains some experimentation about fully NO-JS forms that are progressively enhanced, which I periodically tried to move over to the massive recipe form page, but it turns out making a massive interactive form with NO-JS is also kind of a nightmare, requiring a gazillion server form actions and sending previously input form data back and forth just so that it persists across the full page reloads. You might be able to find this stuff as well in the commit history (src/routes/recipes/add/+page.svelte — if it exists in the commit history), but I am not sure if I committed it.

This repo is currently mainly for trying things out, comparing approaches, and figuring out what feels maintainable in real projects. A lot of the focus is on:
- nested/conditional forms
- server-side validation
- syncing validation errors back to the client
- typed form data flows
- generally making complex forms less painful

Some parts of the codebase are fairly clean, some are absolute travesties. 
