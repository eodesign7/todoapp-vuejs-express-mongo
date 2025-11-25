cat <<'EOF' > README.md
# 📝 Todo App (Vue 3 + Express + MongoDB)

Minimalistický task manager postavený na modernom Vue 3 fronte a Express/MongoDB backende. Appka obsahuje kompletný autentifikačný flow, nový dashboard so zoznamami a rýchle pridávanie úloh priamo inline.

## ✨ Features
- Registrácia, prihlásenie a logout s JWT
- Route guard → `/dashboard` je len pre prihlásených
- Collapsible zoznamy s emoji ikonou, badge-mi a delete akciou v headri
- Inline pridávanie úloh, kruhové checkboxy, rýchle mazanie
- Quick add zoznamu z headera (emoji picker + názov)

## ⚙️ Stack
- **Frontend:** Vue 3, TypeScript, Vite, Pinia, Vue Router
- **Backend:** Express.js, TypeScript, MongoDB (Mongoose)
- **Styling:** čisté CSS, žiadne extra UI knižnice

## 🚀 Ako spustiť

### 1. Požiadavky
- Node.js 18+
- MongoDB (lokálne alebo Atlas)

### 2. Inštalácia
```bash
# root script nainštaluje závislosti pre backend aj frontend
npm install
```

### 3. Backend `.env`
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/todoapp
JWT_SECRET=super_secret_key
```

### 4. Spustenie
```bash
# backend API (http://localhost:5000)
npm run server

# frontend (http://localhost:5173)
npm run dev

# alebo oba naraz (server + client)
npm run all
```

## 🧭 Workflow
1. Na landing page sa zaregistruj/prihlás.
2. Po prihlásení ťa presmeruje na `/dashboard`.
3. V hlavičke klikni `+`, vyber emoji, pomenuj zoznam.
4. Po otvorení zoznamu pridávaj úlohy cez input "Nová úloha…".
5. Checkbox = toggle, ikona koša = delete.
6. Logout tlačidlo v headeri ťa vráti naspäť domov.

## 🗂 Štruktúra
```
backend/   -> Express API (auth, projects, tasks)
frontend/  -> Vue klient (layouty, routes, stores, components)
```

## ✅ Stav
- kompletný auth flow (register/login/me/logout)
- minimalistický dashboard s emoji zoznamami
- CRUD nad projektmi a úlohami
- responzívny dizajn bez bloatu

Hotovo, stačí nakickovať podľa krokov vyššie a appka je ready na demo. 😉
EOF