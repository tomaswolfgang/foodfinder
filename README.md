## IMPORTANT NOTE

**Please add the absolute path to the csv in the `.env` file.**

Something was odd about setting up my path to the csv using \_\_dirname and I ended up needing to use an absolute path

## Second important note:

I appreciate you taking the time to review my work!

## Choices

### Why NextJs?

NextJs provides scaffolding and boilerplate for the server and client implementation, which allowed me to hit the ground running across the stack.

I wish I could say that SSR is enhancing the site in some way but the app is a bit too simple to have it make a significant impact. It's beneficial in case this Food finder site ever needs better SEO I suppose...

### Routes vs Next JS Server Functions

Opted for routes so I could test endpoints using postman during api development.
Using routes also opened the door for documenting the API with the `open-api-spec.yaml`.

### `/api/closest` and `/api/search` implementation. Why filter the ReadStream?

I wanted to have the db file (which reads the csv) act like a database to simulate a "real" project and often times with data filters, you'd much rather offload that to the DB as opposed to the server.

Why filter in the ReadStream? This is a scalability choice. Obviously it's a bit overkill for a csv with only ~400 lines BUT IF we had to parse through a much larger csv, it would be extremely memory intensive to load all those lines into a variable and then filter through.
Checking for valid values as we iterate through the lines of the csv minimizes both the memory footprint (only loading in what you need to into memory) and the computational footprint (filtering as you take in each csv line).

### Error handling

Using a customError was also a bit overkill (noticing a trend yet?) but what better time to be fancy than now?
This is mostly a security feature.
Only custom error codes are exposed to the front-end, obfuscating any details about server execution from the client in case some bad actor is trying to understand how our server operates.
While on the server, we get some automatic logs and stack traces that we can setup monitoring for.

### FE Design and style choices

#### Using context vs state + prop drilling

Honesty for a small project like this that doesn't require much nesting, there's marginal differences between the two. But I prefer context for the following reasons:

1. semantic abstraction - you expose simplified abstractions of more complex changes i.e. the `searchName` function just takes a string but is actually manipulating a more complex state value in a defined way.
2. Easier to develop with - it starts to get pretty repetative to update the prop type and then update the prop for every single small modification. Context just makes the monotony go down a bit

I'd say the downsides of context is the tight coupling you get between the context and anything using it. I tried to mitigate this by limiting context usage to the page level and keeping most components decoupled.
The other downside is what kind of started to happen when I began implementing the `/nearby` page, which is the context started assuming 2 roles and becoming a catch-all context which is definitely a no-no but I think given the small scale of the application itself, it still felt reasonable.

#### on the design front...

I swear I tried to make things pretty, but alas, this is why I am not a designer.

My main target was ensuring the design was at least responsive.

I tried to keep styling relatively consistent via variables, extensions and mixins.

## packages used

- csv-parser - converting csv to a json structure
- react-query - request caching
- jest - automation testing
- testing-library - I was planning on doing UI automation tests too but ran out of time
- classnames - cleaner conditional classes
- bignumber - Arithmetic using large decimals (i.e. coordinates to calc distance)
- sass - css is definitely almost fully caught up functionally, but I'm still more familiar with sass so this was a comfort choice
