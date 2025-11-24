// cSpell:disable

# 📝 ToDo App - Vue.js + Express + MongoDB

Výukový projekt pre učenie sa Vue.js 3, Express.js, TypeScript a MongoDB. Jednoduchá ToDo aplikácia s autentifikáciou používateľov.

## 🎯 Cieľ projektu

Vytvoriť plne funkčnú ToDo aplikáciu s:
- ✅ Registráciou a prihlásením používateľov
- ✅ CRUD operáciami pre todo položky
- ✅ Ochranou routes (len prihlásení používatelia)
- ✅ Moderným Vue 3 frontendom
- ✅ REST API backendom s Express.js
- ✅ MongoDB databázou

---

## 🚀 Quick Start

### Požiadavky
- Node.js (v18 alebo vyššie)
- MongoDB (lokálne alebo MongoDB Atlas)
- npm alebo yarn

### Inštalácia

```bash
# Inštalácia dependencies pre root, backend a frontend
npm install

# Spustenie backend servera (port 5000)
npm run server

# Spustenie frontend dev servera (port 5173)
npm run dev

# Spustenie oboch naraz
npm run all
```

### Environment Variables

Vytvor `.env` súbor v `backend/` adresári:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/todoapp
JWT_SECRET=tvoj_super_tajny_secret_kluc
```

---

## 📋 Step-by-Step Plán

### 🔵 BACKEND (Express + TypeScript + MongoDB)

#### ✅ **Krok 1: Projekt Setup**
- [x] Inicializovať Node.js projekt
- [x] Nastaviť TypeScript
- [x] Inštalovať Express, Mongoose, dotenv
- [x] Nastaviť základnú štruktúru projektu
- [x] Vytvoriť `server.ts` s Express app
- [x] Nastaviť CORS a JSON middleware

#### ✅ **Krok 2: MongoDB Pripojenie**
- [x] Vytvoriť `config/db.ts`
- [x] Implementovať `connectDB()` funkciu
- [x] Pripojiť MongoDB v `server.ts`
- [x] Otestovať pripojenie

#### ✅ **Krok 3: User Model & Schema**
- [x] Vytvoriť `lib/types.ts` s TypeScript typmi
- [x] Vytvoriť `lib/schema.ts` s Mongoose schemou
- [x] Vytvoriť `models/User.ts`
- [x] Implementovať password hashing (bcrypt) v pre-save hook
- [x] Pridať `comparePassword()` metódu

#### ✅ **Krok 4: Autentifikácia - Backend**
- [x] Vytvoriť `routes/authRoutes.ts`
- [x] Vytvoriť `controllers/authController.ts`
- [x] Implementovať `register()` - registrácia používateľa
- [x] Implementovať `login()` - prihlásenie s JWT tokenom
- [x] Implementovať `me()` - získanie aktuálneho používateľa
- [x] Vytvoriť `middleware/auth.ts` pre JWT verifikáciu
- [x] Pridať auth routes do `server.ts`

#### ✅ **Krok 5: Todo Model & Schema**
- [x] Vytvoriť Todo interface v `lib/types.ts`
  ```typescript
  export interface Todo {
    _id?: string;
    title: string;
    description?: string;
    completed: boolean;
    userId: string;
    createdAt?: Date;
    updatedAt?: Date;
  }
  ```
- [x] Vytvoriť TodoSchema v `lib/schema.ts`
  - title (required, string)
  - description (optional, string)
  - completed (boolean, default: false)
  - userId (ObjectId, ref: User, required)
  - timestamps (createdAt, updatedAt)
- [x] Vytvoriť `models/Todo.ts` s Mongoose modelom

#### ✅ **Krok 6: Todo Routes & Controller**
- [x] Vytvoriť `routes/todos.ts` s routes:
  - `GET /api/todos` - získať všetky todos pre prihláseného používateľa
  - `POST /api/todos` - vytvoriť nový todo
  - `PUT /api/todos/:id` - aktualizovať todo
  - `DELETE /api/todos/:id` - vymazať todo
- [x] Vytvoriť `controllers/todoController.ts`:
  - `getTodos()` - získať todos len pre aktuálneho usera
  - `createTodo()` - vytvoriť nový todo s userId
  - `updateTodo()` - aktualizovať todo (len vlastník)
  - `deleteTodo()` - vymazať todo (len vlastník)
- [x] Pridať `authMiddleware` na všetky todo routes
- [x] Pridať todo routes do `server.ts`

#### ⬜ **Krok 7: Error Handling & Validácia**
- [ ] Pridať validáciu request body (napr. pomocou express-validator)
- [ ] Vytvoriť error handling middleware
- [ ] Pridať try-catch bloky do controllerov
- [ ] Vrátiť správne HTTP status kódy

---

### 🟢 FRONTEND (Vue 3 + TypeScript + Vite)

#### ✅ **Krok 1: Projekt Setup**
- [x] Inicializovať Vite + Vue 3 projekt
- [x] Nastaviť TypeScript
- [x] Inštalovať Vue Router, Pinia, Axios
- [x] Nastaviť path aliases (`@/` pre `src/`)
- [x] Vytvoriť základnú štruktúru projektu

#### ✅ **Krok 2: Routing Setup**
- [x] Vytvoriť `routes/index.ts` s Vue Router
- [x] Nastaviť `createWebHistory` pre routing
- [x] Pridať router do `main.ts`
- [x] Vytvoriť základné routes (Login, Register)

#### ✅ **Krok 3: API Setup**
- [x] Vytvoriť `lib/api.ts` s Axios instanciou
- [x] Nastaviť `baseURL` na backend API
- [x] Implementovať request interceptor pre JWT tokeny
- [x] Pridať Authorization header automaticky

#### ✅ **Krok 4: Pinia Store - Auth**
- [x] Vytvoriť `stores/auth.ts` s `useAuthStore`
- [x] Definovať `AuthState` interface
- [x] Implementovať `register()` action
- [x] Implementovať `login()` action
- [x] Implementovať `logout()` action
- [x] Implementovať `fetchMe()` action
- [x] Uložiť token do localStorage
- [x] Pridať Pinia do `main.ts`

#### ✅ **Krok 5: Komponenty - Base Components**
- [x] Vytvoriť `components/BaseInput.vue`
  - [x] Props: `modelValue`, `label`, `type`, `placeholder`
  - [x] Emit `update:modelValue` (v-model support)
- [x] Vytvoriť `components/BaseButton.vue`
- [x] Vytvoriť `components/Card.vue` alebo `AuthCard.vue`
- [x] Vytvoriť `layout/GuestLayout.vue`

#### ✅ **Krok 6: Auth Stránky**
- [x] Vytvoriť `pages/Login.vue`
  - [x] Použiť `BaseInput` pre email a password
  - [x] Použiť `useAuthStore` pre login
  - [x] Pridať form submit handling
  - [x] Pridať link na Register stránku
- [x] Vytvoriť `pages/Register.vue`
  - [x] Podobná štruktúra ako Login
  - [x] Použiť `register()` action
  - [x] Pridať link na Login stránku

#### ✅ **Krok 7: Route Guards (Ochrana Routes)**
- [x] Vytvoriť `router/index.ts` s navigation guards
- [x] Pridať `beforeEach` guard:
  - Ak používateľ nie je prihlásený a ide na chránenú stránku → redirect na `/`
  - Ak používateľ je prihlásený a ide na Login/Register → redirect na `/todos`
- [x] Vytvoriť helper funkciu `isAuthenticated()` v auth store

#### ⬜ **Krok 8: Pinia Store - Todos**
- [x] Vytvoriť `stores/todos.ts` s `useTodosStore`
- [x] Definovať `TodosState` interface:
  ```typescript
  interface TodosState {
    todos: Todo[];
    loading: boolean;
    error: string | null;
  }
  ```
- [x] Implementovať actions:
  - `fetchTodos()` - načítať todos z API
  - `createTodo(title, description?)` - vytvoriť nový todo
  - `updateTodo(id, updates)` - aktualizovať todo
  - `deleteTodo(id)` - vymazať todo
  - `toggleTodo(id)` - prepnúť completed status

#### ✅ **Krok 9: Todo Interface & Types**
- [x] Rozšíriť `lib/interfaces.ts`:
  ```typescript
  export interface Todo {
    _id: string;
    title: string;
    description?: string;
    completed: boolean;
    userId: string;
    createdAt?: string;
    updatedAt?: string;
  }
  ```

#### ⬜ **Krok 10: Todo Komponenty**
- [ ] Vytvoriť `components/TodoItem.vue`:
  - Props: `todo` (Todo object)
  - Zobraziť title, description
  - Checkbox pre completed status
  - Tlačidlá: Edit, Delete
  - Emit events: `toggle`, `edit`, `delete`
- [ ] Vytvoriť `components/TodoForm.vue`:
  - Form pre vytvorenie/úpravu todo
  - Input pre title (required)
  - Textarea pre description (optional)
  - Tlačidlá: Submit, Cancel
  - Emit: `submit` s todo dátami

#### ✅ **Krok 11: Todo Stránka**
- [x] Vytvoriť `pages/Todos.vue`:
  - Použiť `useTodosStore` a `useAuthStore`
  - Zobraziť zoznam todos pomocou `TodoItem`
  - Pridať tlačidlo "Pridať nový todo"
  - Zobraziť loading state
  - Zobraziť error messages
  - Pridať logout tlačidlo
- [x] Pridať route `/todos` do routeru
- [ ] Vytvoriť `layout/AuthenticatedLayout.vue` (voliteľné)

#### ⬜ **Krok 12: UI/UX Vylepšenia**
- [ ] Pridať loading spinners
- [ ] Pridať error handling a zobrazenie chýb
- [ ] Pridať success messages
- [ ] Vylepšiť styling (CSS)
- [ ] Pridať animácie pre todo items
- [ ] Pridať filtrovanie (všetky/aktívne/dokončené)

#### ⬜ **Krok 13: Finálne úpravy**
- [ ] Pridať validáciu formulárov
- [ ] Pridať error boundaries
- [ ] Optimalizovať API calls
- [ ] Pridať loading states všade kde treba
- [ ] Otestovať všetky funkcionality

---

## 📁 Štruktúra Projektu

```
todoapp-vuejs-express-mongo/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.ts              ✅ MongoDB pripojenie
│   │   ├── controllers/
│   │   │   ├── authController.ts  ✅ Auth logika
│   │   │   └── todoController.ts  ✅ Todo logika
│   │   ├── lib/
│   │   │   ├── schema.ts          ✅ Mongoose schemas
│   │   │   └── types.ts           ✅ TypeScript typy
│   │   ├── middleware/
│   │   │   └── auth.ts            ✅ JWT middleware
│   │   ├── models/
│   │   │   ├── User.ts            ✅ User model
│   │   │   └── Todo.ts            ✅ Todo model
│   │   ├── routes/
│   │   │   ├── authRoutes.ts      ✅ Auth routes
│   │   │   └── todos.ts           ✅ Todo routes
│   │   └── server.ts              ✅ Express server
│   ├── .env                       ⚠️ Vytvoriť manuálne
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── BaseInput.vue      ✅
│   │   │   ├── BaseButton.vue     ✅
│   │   │   ├── Card.vue           ✅
│   │   │   ├── TodoItem.vue       ⬜ TODO
│   │   │   └── TodoForm.vue       ⬜ TODO
│   │   ├── layout/
│   │   │   ├── GuestLayout.vue    ✅
│   │   │   └── AuthenticatedLayout.vue ⬜ TODO
│   │   ├── lib/
│   │   │   ├── api.ts             ✅ Axios setup
│   │   │   └── interfaces.ts     ✅ TypeScript typy
│   │   ├── pages/
│   │   │   ├── Login.vue          ✅
│   │   │   ├── Register.vue       ✅
│   │   │   └── Todos.vue          ✅
│   │   ├── routes/
│   │   │   └── index.ts           ✅ Vue Router
│   │   ├── stores/
│   │   │   ├── auth.ts            ✅ Auth store
│   │   │   └── todos.ts           ✅ Todo store
│   │   ├── App.vue                ✅
│   │   └── main.ts                ✅
│   └── package.json
│
└── package.json                   ✅ Root scripts
```

---

## 🎓 Kľúčové Koncepty na Učenie

### Vue.js 3
- **Composition API** - `setup`, `ref`, `reactive`, `computed`
- **Props & Emits** - komunikácia medzi komponentmi
- **v-model** - two-way data binding
- **Lifecycle Hooks** - `onMounted`, `onUnmounted`
- **Template Syntax** - `v-if`, `v-for`, `v-bind`, `@click`

### Pinia (State Management)
- **Stores** - centrálne úložisko dát
- **State** - reaktívne dáta
- **Actions** - asynchrónne operácie
- **Getters** - computed properties pre store

### Vue Router
- **Routes** - definovanie stránok
- **Navigation Guards** - ochrana routes
- **Programmatic Navigation** - `router.push()`

### Express.js
- **Routes** - definovanie API endpoints
- **Middleware** - `authMiddleware`, `express.json()`
- **Controllers** - business logika
- **Models** - Mongoose modely

### MongoDB + Mongoose
- **Schemas** - definovanie dátovej štruktúry
- **Models** - interakcia s databázou
- **Queries** - `find()`, `findOne()`, `save()`, `deleteOne()`
- **Relationships** - `ref` a `ObjectId`

---

## 📚 Užitočné Zdroje

- [Vue.js 3 Dokumentácia](https://vuejs.org/)
- [Pinia Dokumentácia](https://pinia.vuejs.org/)
- [Vue Router Dokumentácia](https://router.vuejs.org/)
- [Express.js Dokumentácia](https://expressjs.com/)
- [Mongoose Dokumentácia](https://mongoosejs.com/)

---

## ✅ Progress Tracker

**Backend:** 6/7 krokov dokončených (86%)  
**Frontend:** 11/13 krokov dokončených (85%)  
**Celkový Progress:** 17/20 krokov (85%)

---

## 🐛 Troubleshooting

### Backend neštartuje
- Skontroluj či je MongoDB spustený
- Skontroluj `.env` súbor s `MONGO_URI`
- Skontroluj či port 5000 nie je obsadený

### Frontend neštartuje
- Skontroluj či backend beží na `http://localhost:5000`
- Skontroluj CORS nastavenia v backendu
- Skontroluj console pre chyby

### Autentifikácia nefunguje
- Skontroluj či je `JWT_SECRET` nastavený v `.env`
- Skontroluj či sa token ukladá do localStorage
- Skontroluj Network tab v DevTools

---

**Posledná aktualizácia:** 2024  
**Status:** 🟡 V procese vývoja

