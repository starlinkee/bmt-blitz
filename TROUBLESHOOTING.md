# Diagnostyka problemów z wdrożeniem BMT Blitz

## Problem: Aplikacja nie odpowiada po wdrożeniu

### Krok 1: Sprawdzenie logów

```bash
# Logi błędów Passenger
tail -f ~/domains/bmt.googlenfc.smallhost.pl/logs/error.log

# Logi aplikacji
tail -f ~/domains/bmt.googlenfc.smallhost.pl/logs/app.log
```

### Krok 2: Sprawdzenie konfiguracji

```bash
cd ~/domains/bmt.googlenfc.smallhost.pl/public_nodejs/backend
node scripts/checkServerConfig.js
```

### Krok 3: Testowanie endpointów

```bash
# Lokalnie na serwerze
curl https://bmt.googlenfc.smallhost.pl/health
curl https://bmt.googlenfc.smallhost.pl/test
curl https://bmt.googlenfc.smallhost.pl/debug
```

### Krok 4: Sprawdzenie zmiennych środowiskowych

Upewnij się, że plik `backend/.env` zawiera:

```env
NODE_ENV=production
DATABASE_URL=postgres://p1790_bmt_blitz:Loskefiros%210@pgsql2.small.pl:5432/p1790_bmt_blitz
DIALECT=postgres
SESSION_SECRET=bmtpolska2007
GMAIL_USER=twoj@email.com
GMAIL_APP_PASS=app-password
```

### Krok 5: Ręczny restart

```bash
cd ~/domains/bmt.googlenfc.smallhost.pl
touch tmp/restart.txt
```

## Najczęstsze problemy

### 1. Brak pliku .env
**Objawy**: Błąd "DATABASE_URL is not defined"
**Rozwiązanie**: Utwórz plik `backend/.env` z odpowiednimi zmiennymi

### 2. Problem z połączeniem do bazy danych
**Objawy**: Timeout lub błąd ECONNREFUSED
**Rozwiązanie**: 
- Sprawdź czy DATABASE_URL jest poprawny
- Sprawdź czy baza danych jest dostępna
- Sprawdź firewall

### 3. Problem z Passenger
**Objawy**: Aplikacja się nie uruchamia
**Rozwiązanie**:
- Sprawdź czy `app.js` istnieje w głównym katalogu
- Sprawdź czy eksportuje aplikację: `export default app;`
- Sprawdź logi Passenger

### 4. Problem z zależnościami
**Objawy**: Błędy "Cannot find module"
**Rozwiązanie**:
```bash
cd backend
rm -rf node_modules package-lock.json
npm install --omit=dev
```

### 5. Problem z uprawnieniami
**Objawy**: Błędy "Permission denied"
**Rozwiązanie**:
```bash
chmod 755 ~/domains/bmt.googlenfc.smallhost.pl/public_nodejs
chmod 644 ~/domains/bmt.googlenfc.smallhost.pl/public_nodejs/backend/.env
```

## Testowanie lokalne

Aby przetestować aplikację lokalnie przed wdrożeniem:

```bash
# Backend
cd backend
npm install
cp .env.example .env  # lub utwórz własny .env
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```

## Debugowanie w produkcji

### Dodanie tymczasowego logowania

W `backend/src/server.js` dodaj:

```javascript
// Na początku pliku
console.log('🚀 Server starting with environment:', {
  NODE_ENV: process.env.NODE_ENV,
  PASSENGER_APP_ENV: process.env.PASSENGER_APP_ENV,
  DATABASE_URL: process.env.DATABASE_URL ? 'exists' : 'missing'
});
```

### Sprawdzenie procesów

```bash
# Sprawdź czy Node.js procesy działają
ps aux | grep node

# Sprawdź porty
netstat -tlnp | grep :3000
```

## Kontakt

W przypadku problemów sprawdź:
1. Logi aplikacji
2. Logi Passenger
3. Konfigurację zmiennych środowiskowych
4. Połączenie z bazą danych 