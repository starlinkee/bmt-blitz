# Instrukcje wdrożenia

## Struktura na serwerze

Na serwerze `bmt.googlenfc.smallhost.pl`:

- **Frontend**: `http://bmt.googlenfc.smallhost.pl:5173` (lub inny port)
- **Backend**: `http://bmt.googlenfc.smallhost.pl:3000` (lub inny port)

## Wdrożenie

### 1. Frontend (na serwerze)
```bash
cd frontend
npm run build:prod
# Skopiuj zawartość dist/ na serwer
```

### 2. Backend (na serwerze)
```bash
cd backend
npm install
npm start
```

### 3. Konfiguracja serwera

Upewnij się, że:
- Port 3000 jest otwarty dla backendu
- Port 5173 (lub inny) jest otwarty dla frontendu
- Baza danych PostgreSQL jest skonfigurowana
- Zmienne środowiskowe są ustawione w `.env`

## Zmienne środowiskowe

### Backend (.env)
```
DATABASE_URL=postgresql://user:password@localhost:5432/database
SESSION_SECRET=your-secret-key
PORT=3000
```

### Frontend (env.production)
```
VITE_API_URL=http://bmt.googlenfc.smallhost.pl:3000
```

## Testowanie

1. Sprawdź backend: `http://bmt.googlenfc.smallhost.pl:3000/health`
2. Sprawdź frontend: `http://bmt.googlenfc.smallhost.pl:5173`
3. Sprawdź logowanie i panel administratora 