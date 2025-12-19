## Thank you

I appreciate you taking the time to review my work!

---

## Problem

Customers are trying to find Mobile Food Facilities around SF

## Solution

An application that allows them to search for various food facilities using various filters such as: name, street name, and status (whether the mobile food facility is has an active permit).

---

## Technical Decisions

### Why NextJs?

NextJs provides scaffolding and boilerplate for the server and client implementation, which allowed me to hit the ground running across the stack.
Things like, the app routing system, a structure that allowed shared types all worked to reduce the development overhead.

---

### Routes vs Next JS Server Functions

Opted for routes so I could test endpoints using postman during api development.
Using routes also opened the door for documenting the API with the `open-api-spec.yaml`.
Moreover, with all the drama around React2Shell, I figured it wass probably better to stay away from server functions for the time being.

---

### `/api/closest` and `/api/search` implementation. Why filter the ReadStream?

I wanted to have the db file (which reads the csv) act like a database to simulate a "real" project and often times with data filters, you'd much rather offload that to the DB as opposed to the server.

Why filter in the ReadStream? This is a scalability choice. Obviously it's a bit overkill for a csv with only ~400 lines BUT IF we had to parse through a much larger csv, it would be extremely memory intensive to load all those lines into a variable and then filter through.
Checking for valid values as we iterate through the lines of the csv minimizes both the memory footprint (only loading in what you need to into memory) and the computational footprint (filtering at the stream level means linearly scaling computation with file size).

---

### Request Validation

To ensure the data contract between the client and server is as tight as possible. I added restrictive types and query construction on the front-end, along with a secondary server validation layer that checks that parameter keys are valid and enum values are exact.

---

### Error handling

Using CustomError might have also a bit overkill (noticing a trend yet?)
This is both a security and observability feature.
Only custom error codes are exposed to the front-end, obfuscating any details about server execution from the client in case some bad actor is trying to understand how our server operates.
While on the server, we get some automatic logs, stack traces that we can setup monitoring for.
The error structure and specific codes mean that tracking down issues in production will be much easier.

---

### Distance calculation

To calculate relative distances to specific coordinates, instead of using the Haversine distance formula to calculate exact distances, I opted for a simpler euclidian calculation as I had limited time to build this and the pythagorean theorem provided a similarly functioning heuristic I could leverage for the time being.

---

### FE Design and style choices

#### Using context vs state + prop drilling

Honesty for a small project like this that doesn't require much nesting, there's marginal differences between the two. But I prefer context for the following reasons:

1. semantic abstraction - you expose simplified abstractions of more complex changes i.e. the `searchName` function just takes a string but is actually manipulating a more complex state value in a defined way.
2. Easier to develop with - it starts to get pretty repetative to update the prop type and then update the prop for every single small modification. Context just makes the monotony go down a bit

I'd say the downsides of context is the tight coupling you get between the context and anything using it. I tried to mitigate this by limiting context usage to the page level and keeping most components decoupled.
The other downside is what kind of started to happen when I began implementing the `/nearby` page, which is the context started assuming 2 roles and becoming a catch-all context which is definitely a no-no but I think given the small scale of the application itself, it still felt reasonable.

#### On the design front...

I swear I tried to make things pretty, but alas, this is why I am not a designer.

My main target was ensuring the design was at least responsive.

I tried to keep styling relatively consistent via variables, extensions and mixins.

---

### Packages used

- csv-parser - converting csv to a json structure
- react-query - request caching
- jest - automation testing
- testing-library - I was planning on doing UI automation tests too but ran out of time
- classnames - cleaner conditional classes
- bignumber - Arithmetic using large decimals (i.e. coordinates to calc distance)
- sass - css is definitely almost fully caught up functionally, but I'm still more familiar with sass so this was a comfort choice

---

## Critiques

### If I had more time...

My original vision was having a map interface that pins displayed all the food facilities according to their coordinates.
Filtering would've filtered the pins down to the relevant list of facilities.
Hovering over pins would show a tooltip with the facility information (like facility type, etc.)

The map view would have provided spatial context to users without needing to show more fields.

Some other add ons and fixes I was thinking about adding:

- Fixing the the overlay with the facility popover as right now it still triggers hover states for elements under the popover
- adding better input and button styling - having custom button and input components
- More thorough FE input validation i.e restricting special characters, number preventing double '-' input in the coordinate input
- Additonal filter options i.e. facilityType, foodItems
- Adding a "my location" button in the `/nearby` page to autopopulate coordinates using user's current location
- accessibility fixes using lighthouse to run an audit
- internationalization
- UI unit tests

### Tradeoffs

- I made a point above about how I tried to balance the using context and over-coupling the UI with state.
- I made server responses a dedicated type and extremely restrictive in the information provided. This was a plus in terms of minimizing response payload and only sending what the UI needs, but as the UI starts to expand and require more info from the backend, making changes to the data contract will come with more developer overhead.
- Custom errors is more development overhead and depending on the application we might want to expose more error information to the client in order to provide user feedback i.e. if there was an add new facility option, the error code might want a more descriptive message to surface to the user in the form of a snack bar.

- Parsing CSV every time vs in-memory caching: going back to the point about treating the `db.ts` file like it was a DB, while in-memory caching would have sped up reponse times, I felt that the dataset was small enough that this kind of optimization would have a negligable impact, and so I opted to focus on data correctness instead.

### Left out

I feel like all the items I left out ARE things I would have tried to do had I had more time to work on this.
But in an effort to not have a full cop out answer, here are some reasons that I opted to prioritize other items over some of the bullets in my "more time" answer:

As a general note, my MVP goal was complete, data-hardened, functioning application that fulfilled the requirements, so I prioritized API data validation, requirements, and performance. By the time I had built out the rough scaffolding for the UI, I could already tell that I wouldn't be able to do everything I envisioned.

- the map - while this was great in theory, the implementation required more time than I had especially with inevitable time dedicated to troubleshooting
- input and button styling - I opted for function over form, with the intention of making things pretty if I got ahead of schedule.
- More restrictive FE input validation - I added some pieces to this like making the coordinates `type=number` and adding max and min, but since the API was built to handle incorrect inputs, I felt that while the FE validation was still important and would be a nice touch, ultimately, some of the more edge case validations weren't critical for my MVP.

### problems with scaling users

Problems:

- My app only supports english and has hard coded text.
- I don't have accessibility rules off the top of my head, but I'm almost sure that an accessibility audit would reveal a lot of things that need fixing.
-

So say the requirements for the app didn't change (and the data didnt change?) and we wanted to support more users/higher traffic, I feel like there are 2 ways to asnwer this:

First: application specific considerations - how I would change the application code to scale to more users.

- More users means that accessibility and internationalization start to become critical to address a wider user base.
- accessibilty -- lighthouse audit
- internationalization - using something like `react-i18next` to implement a system for localization. This would be collaborating with translation specialists etc.

Second, architecture considerations - how I would design the architecture around the application to scale

A lot of this depends on if we need to support changes in the underlying data and if the dataset will increase.

- Setting up multiple containerized, auto-scaled servers with load-balancing based on request rate
- Setting up a CDN to cache assets and pages and also serve the site closer to the users accessing it.
- Rolling the csv data into a database for faster querying and updates so all servers can have the same source of truth
- By indexing on the right keys we can have faster lookup times than scanning every line of a CSV.
- We might consider using something like PostGIS to add geospatial indexing on the coordinates for faster proximity lookups
- Scaling out the database to have read-replicas across the world to speed up response times

---

## Steps to run

### **Please add the absolute path to the csv in the `.env` file.**

Something was odd about setting up my path to the csv using \_\_dirname and I ended up needing to use an absolute path

### Running the project locally (PNPM)

1. run `pnpm i`
2. run `pnpm dev`
3. open your browser to `http://localhost:3000`

### Testing

1. run `pnpm i`
2. run `pnpm test`

### Running the project locally (NPM)

1. run `npm i`
2. run `npm run dev`
3. open your browser to `http://localhost:3000`

### Testing

1. run `npm i`
2. run `npm run test`
