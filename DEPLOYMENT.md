# Instrukcje wdrożenia BMT Blitz

## Struktura projektu na serwerze

Domena: https://bmt.googlenfc.smallhost.pl

Na serwerze (Smallhost) aplikacja działa w katalogu:

`~/domains/bmt.googlenfc.smallhost.pl/public_nodejs`

- Frontend (React): budowany lokalnie i kopiowany do `public/`
- Backend (Node.js + Express): działa pod Passengerem
- Statyczne pliki: serwowane z `public_nodejs/public/`

## Proces wdrożenia (automatyczny)

### GitHub Actions

Każdy push na `master` automatycznie:

1. Buduje frontend (`npm run build`)
2. Kopiuje `frontend/dist/` do `public/`
3. Instaluje zależności backendu
4. Restartuje Passenger (`touch tmp/restart.txt`)

Plik workflow: `.github/workflows/deploy.yml`

## Ręczne wdrożenie (awaryjnie)

### 1. Frontend

```bash
cd frontend
npm install
cp env.production .env
npm run build
cp -r dist/* ../public/
```

### 2. Backend

```bash
cd backend
npm install --omit=dev
touch ../tmp/restart.txt
```

## Wymagania środowiskowe

### Baza danych

- PostgreSQL
- Wymagane zmienne: `DATABASE_URL`, `DIALECT`

### Zmienne środowiskowe (`.env` w backendzie)

```env
DATABASE_URL=postgres://USER:PASSWORD@HOST:PORT/DBNAME
DIALECT=postgres
SESSION_SECRET=your_super_secret_key
GMAIL_USER=twoj@email.com
GMAIL_APP_PASS=hasło_aplikacji
```

## API

Domena backendu i frontendu to ta sama:

`https://bmt.googlenfc.smallhost.pl`

Frontend odczytuje `VITE_API_URL` z pliku `env.production`, np.:

```env
VITE_API_URL=https://bmt.googlenfc.smallhost.pl
```

## Restart aplikacji

Wymuszenie restartu Passenger:

```bash
touch ~/domains/bmt.googlenfc.smallhost.pl/tmp/restart.txt
```

## Logi

Logi backendu:

```
~/domains/bmt.googlenfc.smallhost.pl/logs/error.log
```

Nie usuwaj katalogu `logs` — jest potrzebny do działania Passengera.

## Gotowe

Po zakończeniu wdrożenia aplikacja będzie dostępna pod:

`https://bmt.googlenfc.smallhost.pl`

Frontend, API i logowanie będą działać bez potrzeby portów.