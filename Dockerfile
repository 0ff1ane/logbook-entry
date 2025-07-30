FROM python:3.11.4-slim-bookworm

# Python
ENV PYTHONFAULTHANDLER=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONHASHSEED=random \
    PIP_NO_CACHE_DIR=off \
    PIP_DISABLE_PIP_VERSION_CHECK=on \
    PIP_DEFAULT_TIMEOUT=100

ENV PYTHONUNBUFFERED=1
ENV MODE=prod

RUN apt-get update && apt-get install -y curl libpq-dev gcc && rm -rf /var/lib/apt/lists/*

# -- uv --
# Download the latest installer
ADD https://astral.sh/uv/install.sh /uv-installer.sh

# Run the installer then remove it
RUN sh /uv-installer.sh && rm /uv-installer.sh

# Ensure the installed binary is on the `PATH`
ENV PATH="/root/.local/bin/:$PATH"

WORKDIR /app
COPY pyproject.toml /app/

COPY . /app
RUN uv sync

# install nodejs 22.12.0
ARG NODE_VERSION=22.12.0
# for x64 machines
RUN curl https://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION-linux-x64.tar.gz | tar -xz -C /usr/local --strip-components 1
# for arm64 machines(mac etc)
# RUN curl https://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION-linux-arm64.tar.gz | tar -xz -C /usr/local --strip-components 1


# install frontend nodejs dependencies
RUN npm --prefix frontend install
# build frontend javascript/css bundles
RUN npm --prefix frontend run buildnotypecheck
# copy build assets to /static
RUN uv run python manage.py collectstatic --noinput

# export gunicorn port so deployment can detect it
EXPOSE 8000

# CMD ["gunicorn", "django_inertia_react.asgi:application", "-k", "uvicorn_worker.UvicornWorker"]
CMD ["uv", "run", "gunicorn", "-k", "uvicorn.workers.UvicornWorker", "django_inertia_react.asgi:application"]
