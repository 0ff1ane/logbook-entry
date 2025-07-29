## Django, Django-Ninja with InertiaJS, Vite, React, React-Query
  Simple Todo app with login/register


## Notes
 * Template to init Django and Django-Ninja serving ReactJS via InertiaJS
 * Includes simple register/signup with session-based django_auth
 * Uses `@hey-api/openapi-ts` to generate client for frontend based on OpenAPI schema
 * Uses React-Query on the frontend which uses the generated clients


## Setup
  * Clone this repo
  * Backend setup
    * Dependencies are in pyproject.toml. Install using `poetry` or `uv`
    * Edit the settings.py file with your DB credentials
    * Run `poetry run python manage.py migrate` or `uv run python manage.py migrate` to run migrations
    * Run the server with `poetry run python manage.py runserver` or `uv run python manage.py runserver` depending on what you use
    * Visit http://localhost:8000/api/docs for the Django-Ninja OpenAPI playground
  * Frontend setup
    * Go to `./frontend` directory
    * Run `npm install`
    * Run `npm run typegen` to generate the client calls from the OpenAPI schema(make sure django server is running)
    * Run `npm run dev`
  * Visit http://localhost:8000 to see a simple Login/Register page with Todo app tied to the backend and DB


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
  * Add DockerFile
  * Cleanup setting csrf token in headers
  * Set OpenAPI labels to different routes
