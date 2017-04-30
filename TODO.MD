
- [x] valid error pages, no json dumps

- [x] authenticated / authorized handling on front-end  (currently attempts to load & blows up when no response received)

- [x] figure out how to populate `<title>` tag maybe other meta tags based on location

- [ ] better UI for todo list. allow inline editing of elements, checkbox + x button to cancel.

- [ ] add an administrator role that can view accounts (authorization required here)

- [x] add a profile page that users can visit to change userName / password

- [ ] add interface for administrators to modify locale data - also, supported locales; ability for user to change locale

Maybe later:

- [ ] get rid of everything under `./server/lib/stores` and `./server/lib/models`.  use an orm for this stuff... maybe investigate data store / docker-compose... or just make sure orm can use json files

- [ ] write front-end tests.  need to figure out what this looks like, using jest or perhaps mocha with jsdom.  should it include integration tests / selenium in-browser testing?


