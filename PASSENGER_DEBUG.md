# Debugowanie problemu Passenger

## 🔍 **Analiza problemu**

Z logów wdrożenia widzę, że:
- ✅ Aplikacja się uruchamia poprawnie
- ✅ Baza danych działa
- ✅ Wszystkie modele są załadowane
- ❌ Endpointy nie odpowiadają (curl zwraca błąd)

To wskazuje na problem z **konfiguracją Passenger** lub **routingiem**.

## 🚨 **Możliwe przyczyny:**

### 1. **Problem z wykrywaniem Passenger**
- Zmienne `PASSENGER_APP_ENV` i `PHUSION_PASSENGER_VERSION` są `undefined`
- Aplikacja może nie być poprawnie eksportowana

### 2. **Problem z routingiem**
- Passenger może nie przekazywać żądań do aplikacji
- Konfiguracja `.htaccess` może być niepoprawna

### 3. **Problem z uprawnieniami**
- Aplikacja może nie mieć uprawnień do uruchomienia
- Pliki mogą mieć niepoprawne uprawnienia

### 4. **Problem z konfiguracją serwera**
- Passenger może nie być poprawnie skonfigurowany
- Porty mogą być niepoprawnie ustawione

## 🔧 **Wprowadzone rozwiązania:**

### 1. **Lepsze logowanie Passenger**
- Dodano sprawdzanie zmiennych środowiskowych Passenger
- Dodano logowanie eksportu aplikacji
- Dodano sprawdzanie konfiguracji Passenger

### 2. **Skrypty diagnostyczne**
- `checkPassenger.js` - sprawdza konfigurację Passenger
- `testAppExport.js` - testuje eksport aplikacji
- `testRouting.js` - testuje routing aplikacji

### 3. **Konfiguracja .htaccess**
- Dodano plik `.htaccess` z konfiguracją Passenger
- Ustawiono ścieżki i zmienne środowiskowe

### 4. **Ulepszony workflow**
- Dodano sprawdzanie Passenger przed restartem
- Dodano test routingu
- Dodano sprawdzanie eksportu aplikacji

## 🧪 **Testowanie:**

### 1. **Sprawdź logi Passenger**
```bash
tail -f ~/domains/bmt.googlenfc.smallhost.pl/logs/error.log
```

### 2. **Sprawdź konfigurację Passenger**
```bash
cd ~/domains/bmt.googlenfc.smallhost.pl/public_nodejs/backend
node scripts/checkPassenger.js
```

### 3. **Sprawdź eksport aplikacji**
```bash
cd ~/domains/bmt.googlenfc.smallhost.pl/public_nodejs/backend
node scripts/testAppExport.js
```

### 4. **Sprawdź routing**
```bash
cd ~/domains/bmt.googlenfc.smallhost.pl/public_nodejs/backend
node scripts/testRouting.js
```

## 📋 **Oczekiwane wyniki:**

### Sprawdzenie Passenger
```
🚌 Passenger Configuration Check
================================
✅ Passenger is running
✅ Passenger root: /usr/local/lib/passenger
✅ App is properly configured Express application
```

### Test eksportu
```
🧪 Testing app export
=====================
✅ App imported successfully
✅ App.default is a function (likely Express app)
✅ App has .use method (Express middleware)
✅ App has .get method (Express routing)
```

### Test routingu
```
🧪 Testing app routing
======================
✅ App imported successfully
✅ Test server started on port 3001
✅ Status: 200
📄 Response: pong
```

## 🚨 **Jeśli testy nie przechodzą:**

### 1. **Problem z Passenger**
```bash
# Sprawdź czy Passenger działa
passenger-status

# Sprawdź konfigurację
passenger-config --root
```

### 2. **Problem z uprawnieniami**
```bash
# Sprawdź uprawnienia
ls -la ~/domains/bmt.googlenfc.smallhost.pl/public_nodejs

# Napraw uprawnienia
chmod 755 ~/domains/bmt.googlenfc.smallhost.pl/public_nodejs
chmod 644 ~/domains/bmt.googlenfc.smallhost.pl/public_nodejs/backend/.env
```

### 3. **Problem z routingiem**
```bash
# Sprawdź czy aplikacja odpowiada lokalnie
cd ~/domains/bmt.googlenfc.smallhost.pl/public_nodejs/backend
node scripts/testRouting.js
```

## 📝 **Następne kroki:**

1. **Wdróż zmiany** - push na master uruchomi nowe testy
2. **Sprawdź logi** - nowe logi pokażą dokładnie co się dzieje
3. **Przetestuj endpointy** - sprawdź czy odpowiadają po wdrożeniu
4. **Sprawdź konfigurację Passenger** - czy jest poprawna

## 🔧 **Dodatkowe rozwiązania:**

### 1. **Ręczna konfiguracja Passenger**
Jeśli automatyczne testy nie pomogą, możesz ręcznie skonfigurować Passenger:

```bash
# Sprawdź konfigurację Apache
apache2ctl -S

# Sprawdź moduły Passenger
apache2ctl -M | grep passenger
```

### 2. **Alternatywna konfiguracja**
Jeśli problemy będą się utrzymywać, możesz rozważyć:
- Uruchomienie aplikacji jako standalone z reverse proxy
- Użycie PM2 zamiast Passenger
- Konfigurację nginx z proxy_pass

## 📞 **Kontakt**

W przypadku problemów:
1. Sprawdź logi Passenger
2. Sprawdź logi aplikacji
3. Przetestuj skrypty diagnostyczne
4. Sprawdź konfigurację serwera 