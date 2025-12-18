## Choices

### Why NextJs?

NextJs provides scaffolding and boilerplate for the server and client implementation, which allowed me to hit the ground running across the stack.

I wish I could say that SSR is enhancing the site in some way but the app is a bit too simple to have it make a significant impact. It's beneficial in case this Food finder site ever needs better SEO I suppose...

### Routes vs Next JS Server Functions

Opted for routes so I could test endpoints using postman during api development. Routes also opened the door for documenting the API with the `open-api-spec.yaml`.

### Why are `/api/closest` and `/api/search` implemented ?

`api/search` follows a simpler logic path. Retieve everything, then filter sequentially by search parameter until all

`api/closest` follows a more complicated db implementation however this solution is much more scalable as we only pick the relevant options as we progress through the ReadStream, saving us the memory cost of loading everything into a variable then iterating through find the closest facilities.

## packages used

- csv-parser - converting csv to a json structure
- react-query - request caching
- jest - automation testing
- testing-library - I was planning on doing UI automation tests too but ran out of time
- classnames - cleaner conditional classes
- bignumber - Arithmetic using large decimals (i.e. coordinates to calc distance)

## Notes

- Something was odd about setting up my path to the csv using \_\_dirname. I ended up needing to use an absolute path
