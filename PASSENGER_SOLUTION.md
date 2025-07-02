# Rozwiązanie problemu Passenger

## 🔍 **Analiza problemu**

Z logów wdrożenia widzę, że:

✅ **Co działa:**
- Aplikacja się uruchamia poprawnie
- Baza danych działa
- Eksport aplikacji jest poprawny
- Aplikacja uruchamia się na porcie 3000

❌ **Problem:**
- Aplikacja uruchamia się w trybie standalone zamiast Passenger
- Zmienne `PASSENGER_APP_ENV` i `PHUSION_PASSENGER_VERSION` są `undefined`
- Passenger nie wykrywa aplikacji

## 🚨 **Główna przyczyna:**

**Passenger nie wykrywa aplikacji** - aplikacja uruchamia się jako standalone serwer zamiast być obsługiwana przez Passenger.

## 🔧 **Konkretne rozwiązania:**

### 1. **Naprawiony plik .htaccess**
Literówka w pliku `.htaccess` została naprawiona:
```apache
# Handle all requests through Passenger  # (było: Passengerlff)
```

### 2. **Sprawdzenie struktury katalogów**
Dodano skrypt `checkStructure.js` do sprawdzania:
- Czy wszystkie pliki są w odpowiednich miejscach
- Czy uprawnienia są poprawne
- Czy konfiguracja jest poprawna

### 3. **Sprawdzenie katalogu public**
Dodano skrypt `checkPublicDir.js` do sprawdzania:
- Czy katalog `public` istnieje
- Czy plik `.htaccess` jest poprawny
- Czy Passenger może obsługiwać żądania

### 4. **Lepsze logowanie**
Dodano szczegółowe logowanie:
- Sprawdzanie zmiennych Passenger
- Logowanie eksportu aplikacji
- Sprawdzanie konfiguracji Express

## 🧪 **Testowanie po wdrożeniu:**

### 1. **Sprawdź logi**
```bash
tail -f ~/domains/bmt.googlenfc.smallhost.pl/logs/error.log
```

### 2. **Sprawdź konfigurację**
```bash
cd ~/domains/bmt.googlenfc.smallhost.pl/public_nodejs/backend
node scripts/checkStructure.js
node scripts/checkPublicDir.js
```

### 3. **Sprawdź endpointy**
```bash
curl https://bmt.googlenfc.smallhost.pl/ping
curl https://bmt.googlenfc.smallhost.pl/health
curl https://bmt.googlenfc.smallhost.pl/test
```

## 📋 **Oczekiwane wyniki:**

### Po naprawie powinieneś zobaczyć:
```
🚌 Passenger detection:
  PASSENGER_APP_ENV: production
  PHUSION_PASSENGER_VERSION: 6.0.x
  Is Passenger detected: true
✅ Running under Passenger – Express handler ready
```

### Endpointy powinny odpowiadać:
```
$ curl https://bmt.googlenfc.smallhost.pl/ping
pong

$ curl https://bmt.googlenfc.smallhost.pl/health
OK

$ curl https://bmt.googlenfc.smallhost.pl/test
{"status":"OK","message":"Aplikacja działa!","timestamp":"...","environment":"production","passenger":true}
```

## 🚨 **Jeśli problem będzie się utrzymywał:**

### 1. **Sprawdź konfigurację Apache**
```bash
# Sprawdź czy moduł Passenger jest załadowany
apache2ctl -M | grep passenger

# Sprawdź konfigurację wirtualnego hosta
apache2ctl -S
```

### 2. **Sprawdź uprawnienia**
```bash
# Sprawdź uprawnienia katalogu
ls -la ~/domains/bmt.googlenfc.smallhost.pl/public_nodejs

# Napraw uprawnienia jeśli potrzeba
chmod 755 ~/domains/bmt.googlenfc.smallhost.pl/public_nodejs
chmod 644 ~/domains/bmt.googlenfc.smallhost.pl/public_nodejs/public/.htaccess
```

### 3. **Ręczny restart Passenger**
```bash
# Restart aplikacji
touch ~/domains/bmt.googlenfc.smallhost.pl/tmp/restart.txt

# Sprawdź status Passenger
passenger-status
```

## 📝 **Następne kroki:**

1. **Wdróż zmiany** - push na master uruchomi nowe testy
2. **Sprawdź logi** - nowe skrypty pokażą dokładnie co się dzieje
3. **Przetestuj endpointy** - sprawdź czy odpowiadają
4. **Sprawdź frontend** - czy łączy się z backendem

## 🔧 **Dodatkowe rozwiązania:**

### Jeśli Passenger nadal nie działa:
1. **Uruchom aplikację jako standalone** z reverse proxy
2. **Użyj PM2** zamiast Passenger
3. **Skonfiguruj nginx** z proxy_pass

### Konfiguracja standalone z PM2:
```bash
# Instaluj PM2
npm install -g pm2

# Uruchom aplikację
cd ~/domains/bmt.googlenfc.smallhost.pl/public_nodejs
pm2 start app.js --name bmt-blitz

# Sprawdź status
pm2 status
```

## 📞 **Kontakt**

W przypadku problemów:
1. Sprawdź logi aplikacji
2. Sprawdź logi Passenger
3. Przetestuj skrypty diagnostyczne
4. Sprawdź konfigurację serwera 