PYTHON ?= python3
VENV   := .venv
BIN    := $(VENV)/bin

.PHONY: run run-lan install test clean

## run: create venv + install deps (first time only), then start the API
run: $(VENV)/.installed .env
	$(BIN)/python -m app

## run-lan: same as run, but reachable from an iPhone on the same Wi-Fi
run-lan: $(VENV)/.installed .env
	HOST=0.0.0.0 $(BIN)/python -m app

## install: create .venv and install pinned dependencies
install: $(VENV)/.installed

## test: run the test suite
test: $(VENV)/.installed
	$(BIN)/pytest -q

## clean: remove venv and caches
clean:
	rm -rf $(VENV) .pytest_cache
	find . -name __pycache__ -type d -prune -exec rm -rf {} +

$(VENV)/.installed: requirements.txt requirements-dev.txt
	$(PYTHON) -m venv $(VENV)
	$(BIN)/pip install --upgrade pip
	$(BIN)/pip install -r requirements-dev.txt
	touch $@

# Copy .env.example and put a random SECRET_KEY in it
.env:
	sed "s/^SECRET_KEY=.*/SECRET_KEY=$$($(PYTHON) -c 'import secrets; print(secrets.token_urlsafe(32))')/" .env.example > .env
