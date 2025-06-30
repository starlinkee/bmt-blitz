# Instrukcje wdrożenia BMT Blitz

## Struktura projektu na serwerze

Domena: https://bmt.googlenfc.smallhost.pl

Katalog główny aplikacji:

`~/domains/bmt.googlenfc.smallhost.pl/public_nodejs`

- **Frontend**: React, zbudowany do `frontend/dist/`, kopiowany do `public/`
- **Backend**: Express.js, uruchamiany przez Passenger
- **Statyczne pliki**: obsługiwane z `public_nodejs/public/`

## Proces wdrożenia

Wdrożenie następuje automatycznie przez GitHub Actions po każdym pushu na `master`.

### Co robi workflow:

1. Buduje frontend (`npm run build`)
2. Kopiuje `frontend/dist/` do `public/`
3. Instaluje zależności backendu
4. Restartuje Passenger (`touch tmp/restart.txt`)

Plik: `.github/workflows/deploy.yml`

## Zmienne środowiskowe

### Frontend

Ustawiane w pliku `frontend/env.production`:

```env
VITE_API_URL=https://bmt.googlenfc.smallhost.pl
```

Podczas deploya kopiowane automatycznie do `frontend/.env`, ponieważ Vite używa `.env` przy budowaniu.

### Backend

Plik: `backend/.env` — musi istnieć na serwerze.

```env
DATABASE_URL=postgres://p1790_bmt_blitz:Loskefiros%210@pgsql2.small.pl:5432/p1790_bmt_blitz
DIALECT=postgres
SESSION_SECRET=bmtpolska2007
GMAIL_USER=twoj@email.com
GMAIL_APP_PASS=app-password
```

## Ręczne wdrożenie (awaryjne)

### Frontend

```bash
cd frontend
npm install
cp env.production .env
npm run build
cp -r dist/* ../public/
```

### Backend

```bash
cd backend
npm install --omit=dev
touch ../tmp/restart.txt
```

## Logi

```
~/domains/bmt.googlenfc.smallhost.pl/logs/error.log
```

**Nie usuwaj katalogu `logs` — wymagany przez Passenger.**

## Restart aplikacji

```bash
touch ~/domains/bmt.googlenfc.smallhost.pl/tmp/restart.txt
```

## Gotowe

Po wdrożeniu aplikacja działa pod:

```
https://bmt.googlenfc.smallhost.pl
```

Zarówno frontend jak i backend są zintegrowane pod jedną domeną, bez portów.