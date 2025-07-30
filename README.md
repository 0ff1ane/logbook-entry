## Django, Django-Ninja with InertiaJS, Vite, React, React-Query
  Simple LogBook app


## Notes
 * Template to init Django and Django-Ninja serving ReactJS via InertiaJS
 * Includes simple register/signup with session-based django_auth
 * Uses `@hey-api/openapi-ts` to generate client for frontend based on OpenAPI schema
 * Uses React-Query on the frontend which uses the generated clients
 * Uses Mantine for UI


## Setup
  * Clone this repo
  * Backend setup
    * Dependencies are in pyproject.toml. Install using `uv`
    * Edit the settings.py file with your DB credentials
    * Run `uv run python manage.py migrate` to run migrations
    * Run the server with `uv run python manage.py runserver` depending on what you use
    * Visit http://localhost:8000/api/docs for the Django-Ninja OpenAPI playground
  * Frontend setup
    * Go to `./frontend` directory
    * Run `npm install`
    * Run `npm run typegen` to generate the client calls from the OpenAPI schema(make sure django server is running)
    * Run `npm run dev`
  * Visit http://localhost:8000 to see a simple Login/Register page with LogBook app tied to the backend and DB

## Usage
  * After registering, you can create Logbook entries
  * After creating a Logbook, you can hover on time-slots on the time chart to add status/time/remarks
  * __NOTE__: The first entry __has__ to be `ON_DUTY`
  * Entries added will show up as a red dot on the time chart
  * The chart will show lines between subsequent changes in driver status
  * __NOTE__: You cannot add the same status consecutively, i.e the next status has to be different from the latest one
  * Hovering on the added entries will show cards with the status/time/remark of that entry(red dot)
  * The right side will automatically show total hours spent on each status


## References
  * Django: [https://www.djangoproject.com/](https://www.djangoproject.com/)
  * Django Ninja: [https://django-ninja.dev/](https://django-ninja.dev/)
  * inertia-django: [https://github.com/inertiajs/inertia-django](https://github.com/inertiajs/inertia-django)
  * InertiaJS: [https://inertiajs.com/](https://inertiajs.com/)
  * ReactJS: [https://react.dev/](https://react.dev/)


## TODO
  * Add common logging module
  * Fix frontend tests
  * Add SSR for backend
  * Cleanup setting csrf token in headers
  * Set OpenAPI labels to different routes
