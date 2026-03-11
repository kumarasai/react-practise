import { useState, useRef } from "react";

const topics = [
  {
    id: "html", label: "HTML", icon: "⟨/⟩", color: "#f97316",
    questions: [
      {
        q: "What is the difference between semantic and non-semantic HTML?",
        a: "Semantic HTML uses meaningful tags that describe the content's role — like <header>, <nav>, <article>, <section>, <aside>, and <footer>. Non-semantic tags like <div> and <span> carry no meaning. Semantic HTML improves SEO, accessibility, and code readability.",
        code: `<!-- ❌ Non-semantic -->
<div class="header">
  <div class="nav"><div class="nav-item">Home</div></div>
</div>

<!-- ✅ Semantic -->
<header>
  <nav>
    <ul><li><a href="/">Home</a></li></ul>
  </nav>
</header>
<main>
  <article>
    <section>
      <h2>Title</h2>
      <p>Content...</p>
    </section>
  </article>
  <aside>Related</aside>
</main>
<footer>© 2025</footer>`
      },
      {
        q: "Difference between <script>, <script async>, and <script defer>?",
        a: "Regular <script> blocks HTML parsing. async downloads in parallel and executes immediately when ready — order NOT guaranteed. defer downloads in parallel but executes after the DOM is fully parsed — order IS preserved. Use defer for app scripts, async for independent scripts like analytics.",
        code: `<!-- Blocks parsing ❌ -->
<script src="app.js"></script>

<!-- Parallel download, runs immediately (no order) ✅ -->
<script async src="analytics.js"></script>

<!-- Parallel download, runs after DOM ready (ordered) ✅ -->
<script defer src="vendor.js"></script>
<script defer src="app.js"></script>

<!-- Timeline:
Normal: |--HTML--|--JS--|--HTML--|
Async:  |-----HTML-----|
              |JS| (whenever ready)
Defer:  |------HTML parsed-------|
                                 |--JS--|
-->`
      },
      {
        q: "What are data attributes and how do you use them?",
        a: "data-* attributes store custom data on HTML elements without non-standard attributes. They're accessible via JavaScript's dataset property and can also be targeted in CSS.",
        code: `<!-- HTML -->
<button
  data-user-id="42"
  data-role="admin"
  data-active="true">
  Settings
</button>

<!-- JavaScript -->
const btn = document.querySelector('button');
console.log(btn.dataset.userId);  // "42"
console.log(btn.dataset.role);    // "admin"

btn.dataset.count = 0;            // set
delete btn.dataset.active;        // remove

<!-- CSS -->
[data-active="true"] { background: green; }
[data-role="admin"]::after { content: " 👑"; }`
      },
      {
        q: "Difference between localStorage, sessionStorage, and cookies?",
        a: "localStorage persists forever until manually cleared. sessionStorage clears when the tab closes. Cookies have expiry dates and are sent to the server with every HTTP request. Storage limits: localStorage/sessionStorage ~5MB, cookies ~4KB.",
        code: `// localStorage — survives tab & browser close
localStorage.setItem('theme', 'dark');
const theme = localStorage.getItem('theme');
localStorage.removeItem('theme');

// sessionStorage — clears on tab close
sessionStorage.setItem('step', JSON.stringify({ step: 2 }));

// Cookies — sent to server, have expiry
document.cookie =
  "token=abc; expires=Fri, 31 Dec 2025 23:59:59 GMT; path=/";

const getCookie = (name) =>
  document.cookie.split('; ')
    .find(r => r.startsWith(name + '='))
    ?.split('=')[1];`
      },
      {
        q: "Explain accessibility (a11y) best practices in HTML",
        a: "Accessibility ensures your app works for everyone — keyboard users, screen readers, and people with disabilities. Use semantic HTML, alt text, associated labels, ARIA attributes for dynamic content, and manage focus for SPAs and modals.",
        code: `<!-- Alt text -->
<img src="profile.jpg" alt="Alice's profile photo" />
<img src="bg.svg" alt="" role="presentation" /> <!-- decorative -->

<!-- Label association -->
<label for="email">Email</label>
<input id="email" type="email"
  aria-required="true"
  aria-describedby="hint" />
<span id="hint">We never share your email.</span>

<!-- Live region for dynamic content -->
<div role="alert" aria-live="polite">
  Saved successfully!
</div>

<!-- Skip link -->
<a href="#main" class="skip-link">Skip to main content</a>

<!-- Button not div! -->
<button onClick={fn}>Click</button>  ✅
<div onClick={fn}>Click</div>        ❌`
      }
    ]
  },
  {
    id: "css", label: "CSS", icon: "✦", color: "#3b82f6",
    questions: [
      {
        q: "Explain the CSS Box Model",
        a: "Every element is a box with 4 layers: content → padding → border → margin. By default, width applies to content only, so padding and border ADD to the total size. box-sizing: border-box makes width include padding and border — almost always what you want.",
        code: `/* Default (content-box) — confusing! */
.box {
  width: 200px;
  padding: 20px;     /* +40px total */
  border: 2px solid; /* +4px total */
  /* Renders at 244px wide 😱 */
}

/* ✅ border-box — predictable */
*, *::before, *::after {
  box-sizing: border-box;
}
.box {
  width: 200px;
  padding: 20px;
  border: 2px solid;
  /* Renders at exactly 200px ✅ */
}`
      },
      {
        q: "What is CSS Specificity and how is it calculated?",
        a: "Specificity decides which CSS rule wins when multiple rules target the same element. It's a 4-part score: (inline, ID, class/attr/pseudo-class, element). Higher score wins. Same score = last rule wins. !important overrides everything but should be avoided.",
        code: `/* (0,0,0,1) element */
p { color: black; }

/* (0,0,1,0) class */
.text { color: blue; }

/* (0,0,1,1) class + element */
p.text { color: green; }

/* (0,1,0,0) ID */
#title { color: red; }

/* (0,1,1,1) ID + class + element */
#hero p.lead { color: purple; }

/* (1,0,0,0) inline — beats everything */
<p style="color: pink">...</p>

/* !important — nuclear option, avoid */
p { color: yellow !important; }

/* ✅ BEM keeps specificity flat */
.card__title { }          /* 0,0,1,0 */
.card__title--large { }   /* 0,0,1,0 */`
      },
      {
        q: "Explain Flexbox with common use cases",
        a: "Flexbox is a 1D layout system arranging items along a single axis (row or column). The parent container controls direction, alignment, wrapping, and gaps. Items can grow, shrink, and have individual alignment. Perfect for navbars, centering, and horizontal/vertical layouts.",
        code: `/* Container */
.container {
  display: flex;
  flex-direction: row;            /* row | column */
  justify-content: space-between; /* main axis */
  align-items: center;            /* cross axis */
  flex-wrap: wrap;
  gap: 16px;
}

/* ✅ Center ANYTHING */
.center {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* ✅ Navbar */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px; padding: 0 24px;
}

/* Item properties */
.item { flex: 1; }           /* grow equally */
.item { flex: 0 0 200px; }   /* fixed 200px */
.item { align-self: flex-end; }`
      },
      {
        q: "Explain CSS Grid with examples",
        a: "CSS Grid is a 2D layout system controlling both rows and columns. Define the grid on the container; items auto-place or are placed explicitly. Great for full-page layouts, card grids, and asymmetric designs.",
        code: `/* Basic 3-column grid */
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

/* Named template areas */
.page {
  display: grid;
  grid-template-areas:
    "header  header"
    "sidebar main"
    "footer  footer";
  grid-template-columns: 240px 1fr;
  grid-template-rows: 60px 1fr 60px;
}
.header  { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main    { grid-area: main; }
.footer  { grid-area: footer; }

/* ✅ Responsive without media queries! */
.cards {
  display: grid;
  grid-template-columns:
    repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}`
      },
      {
        q: "What are CSS Custom Properties (variables)?",
        a: "CSS custom properties (--name) store reusable values you reference with var(). They cascade, can be scoped to components, overridden locally, and changed dynamically via JavaScript. They're the foundation of theming and design systems.",
        code: `/* Define on :root (global) */
:root {
  --color-primary: #6366f1;
  --color-bg: #ffffff;
  --spacing-md: 16px;
  --radius: 8px;
}

/* Use with var() */
.button {
  background: var(--color-primary);
  padding: var(--spacing-md);
  border-radius: var(--radius);
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: #0f172a;
    --color-text: #f1f5f9;
  }
}

/* Component override */
.card { --spacing-md: 24px; }

/* JS theming */
document.documentElement.style
  .setProperty('--color-primary', '#ec4899');`
      }
    ]
  },
  {
    id: "js", label: "JavaScript", icon: "JS", color: "#eab308",
    questions: [
      {
        q: "Explain the Event Loop, Call Stack, and Microtask Queue",
        a: "JS is single-threaded. The call stack runs sync code. Web APIs handle async work off-thread. When done, callbacks go to queues. The event loop rule: drain ALL microtasks (Promises) before each macrotask (setTimeout). That's why Promises always run before setTimeout(0).",
        code: `console.log('1 — sync');

setTimeout(() => console.log('2 — macro'), 0);

Promise.resolve().then(() => console.log('3 — micro'));

queueMicrotask(() => console.log('4 — micro'));

console.log('5 — sync');

// OUTPUT:
// 1 — sync        ← sync runs first
// 5 — sync
// 3 — micro       ← ALL microtasks drain before macrotask
// 4 — micro
// 2 — macro       ← macrotask runs last`
      },
      {
        q: "What is Closure? Give a real-world example.",
        a: "A closure is a function that retains access to variables from its outer (lexical) scope even when called outside that scope. Every JS function is a closure. Used for private state, factory functions, and memoization.",
        code: `// Private counter
function createCounter(start = 0) {
  let count = start; // private
  return {
    increment: () => ++count,
    decrement: () => --count,
    value:     () => count,
  };
}
const c = createCounter(10);
c.increment(); // 11
c.value();     // 11
// c.count     // ❌ undefined — truly private

// Factory function
const multiply = (factor) => (n) => n * factor;
const double = multiply(2);
double(5); // 10

// Memoization
function memoize(fn) {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}`
      },
      {
        q: "Explain Promises and async/await with error handling",
        a: "A Promise represents a future value — pending, fulfilled, or rejected. async/await is syntactic sugar over Promises making async code read like sync. Always handle errors with try/catch. Use Promise.all() for parallel requests.",
        code: `// async/await with full error handling
async function loadDashboard(userId) {
  try {
    const user = await fetchUser(userId);

    // ✅ Parallel — not sequential!
    const [posts, followers] = await Promise.all([
      fetch(\`/api/posts?uid=\${userId}\`).then(r => r.json()),
      fetch(\`/api/followers/\${userId}\`).then(r => r.json()),
    ]);

    return { user, posts, followers };

  } catch (error) {
    if (error.status === 404) return null; // known error
    throw error;                           // unknown — rethrow
  } finally {
    setLoading(false); // always runs
  }
}

// Combinators
Promise.allSettled([p1,p2]); // waits all, never rejects
Promise.race([p1,p2]);       // first to settle wins
Promise.any([p1,p2]);        // first to SUCCEED wins`
      },
      {
        q: "What is 'this'? Explain the 5 binding rules.",
        a: "'this' is determined at call time, not definition time (except arrow functions). 5 rules: default (global/undefined), implicit (obj before the dot), explicit (call/apply/bind), new (new object), arrow (lexical — inherits from outer scope).",
        code: `// 1. Default — global / undefined in strict
function show() { console.log(this); }

// 2. Implicit — object before the dot
const obj = { name: 'Alice', greet() { return this.name; } };
obj.greet(); // 'Alice'
const fn = obj.greet;
fn();        // ❌ undefined (lost binding)

// 3. Explicit — call / apply / bind
function hi(greeting) { return \`\${greeting} \${this.name}\`; }
hi.call({ name: 'Bob' }, 'Hello');   // Hello Bob
hi.apply({ name: 'Bob' }, ['Hi']);   // Hi Bob
const hiBob = hi.bind({ name: 'Bob' });
hiBob('Hey');                         // Hey Bob

// 4. new — creates new object
function Person(name) { this.name = name; }
const p = new Person('Carol');

// 5. Arrow — lexical this (can't be changed)
const timer = {
  id: 42,
  start() {
    setTimeout(() => console.log(this.id), 100); // ✅ 42
    setTimeout(function() { console.log(this.id) }, 100); // ❌ undefined
  }
};`
      },
      {
        q: "map, filter, reduce, flat, flatMap — explain with examples",
        a: "Core array methods for functional, immutable data transformation. map transforms each item (same length), filter keeps matches (shorter), reduce accumulates to one value, flat merges nested arrays, flatMap maps + flattens in one pass.",
        code: `const users = [
  { id:1, name:'Alice', age:28, active:true,  score:90 },
  { id:2, name:'Bob',   age:34, active:false, score:75 },
  { id:3, name:'Carol', age:22, active:true,  score:88 },
];

// map — transform (same length)
users.map(u => u.name); // ['Alice','Bob','Carol']

// filter — keep matches (shorter)
users.filter(u => u.active); // [Alice, Carol]

// reduce — accumulate to one value
users.reduce((sum, u) => sum + u.score, 0); // 253
users.reduce((acc, u) => ({ ...acc, [u.id]: u }), {}); // keyed obj

// Chaining ✅
users
  .filter(u => u.active)
  .sort((a,b) => b.score - a.score)
  .map(u => u.name); // ['Alice','Carol']

// flat — flatten nested arrays
[[1,2],[3,[4]]].flat();        // [1,2,3,[4]]
[[1,2],[3,[4]]].flat(Infinity); // [1,2,3,4]

// flatMap — map + flat(1)
[1,2,3].flatMap(x => [x, x*2]); // [1,2, 2,4, 3,6]`
      }
    ]
  },
  {
    id: "react", label: "React", icon: "⚛", color: "#22d3ee",
    questions: [
      {
        q: "Explain useState, useEffect, useCallback, useMemo, useRef",
        a: "The 5 core hooks. useState: local state that triggers re-renders. useEffect: side effects after render (fetch, subscriptions). useCallback: memoize function reference so it stays stable. useMemo: memoize expensive computation result. useRef: mutable value that does NOT trigger re-renders (DOM nodes, timers, previous values).",
        code: `function SearchBox() {
  const [query, setQuery]     = useState('');
  const [results, setResults] = useState([]);
  const inputRef = useRef(null);    // DOM ref
  const abortRef = useRef(null);    // mutable, non-UI

  // Side effect: fetch on query change
  useEffect(() => {
    if (!query) { setResults([]); return; }
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    fetch(\`/api/search?q=\${query}\`,
      { signal: abortRef.current.signal })
      .then(r => r.json()).then(setResults)
      .catch(() => {});

    return () => abortRef.current?.abort(); // cleanup!
  }, [query]);

  // Stable function ref (for memoized children)
  const handleClear = useCallback(() => {
    setQuery('');
    setResults([]);
    inputRef.current?.focus();
  }, []);

  // Only re-sort when results change
  const sorted = useMemo(
    () => [...results].sort((a,b) => b.score - a.score),
    [results]
  );

  return <input ref={inputRef} value={query}
    onChange={e => setQuery(e.target.value)} />;
}`
      },
      {
        q: "What are Custom Hooks? Build useFetch and useDebounce.",
        a: "Custom hooks are functions starting with 'use' that call other hooks to extract and share reusable stateful logic. If two components share the same stateful pattern, extract it into a custom hook. They compose perfectly and keep components clean.",
        code: `// useFetch
function useFetch(url) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(url)
      .then(r => { if(!r.ok) throw new Error(r.status); return r.json(); })
      .then(d  => { if(!cancelled) { setData(d); setLoading(false); } })
      .catch(e => { if(!cancelled) { setError(e); setLoading(false); } });
    return () => { cancelled = true; };
  }, [url]);

  return { data, loading, error };
}

// Usage
function Profile({ id }) {
  const { data: user, loading, error } =
    useFetch(\`/api/users/\${id}\`);
  if (loading) return <Spinner />;
  if (error)   return <p>{error.message}</p>;
  return <h1>{user.name}</h1>;
}

// useDebounce
function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}`
      },
      {
        q: "Performance: React.memo, useCallback, useMemo, lazy loading",
        a: "React re-renders components when state/props change and re-renders all children by default. Optimize with React.memo (skip re-render if props unchanged), useCallback (stable fn refs), useMemo (skip expensive recalculations), and React.lazy + Suspense (code splitting — only load when needed).",
        code: `// React.memo — skip re-render if props unchanged
const Avatar = memo(({ name, src }) => (
  <img src={src} alt={name} />
));

function Feed() {
  const [count, setCount] = useState(0);

  // ❌ Without: new fn every render → Avatar re-renders
  // ✅ With: same ref → Avatar skips render
  const handleClick = useCallback(() => {
    console.log('clicked');
  }, []);

  // ❌ Without: recalculates on every render
  // ✅ With: only when posts changes
  const topPosts = useMemo(
    () => posts.filter(p => p.likes > 100),
    [posts]
  );

  return <Avatar src="/img.jpg" name="Alice"
    onClick={handleClick} />;
}

// Code splitting — load page only when visited
const Settings = lazy(() => import('./Settings'));
const Admin    = lazy(() => import('./Admin'));

function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        <Route path="/settings" element={<Settings />} />
        <Route path="/admin"    element={<Admin />} />
      </Routes>
    </Suspense>
  );
}`
      },
      {
        q: "Context API — usage and when to use vs Redux",
        a: "Context passes data through the tree without prop drilling. Best for low-frequency updates: auth, theme, locale. Avoid for frequently changing state — it re-renders ALL consumers. Use Redux/Zustand for complex state, frequent updates, or when you need dev tools and time-travel debugging.",
        code: `const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = useCallback(async (creds) => {
    const user = await api.login(creds);
    setUser(user);
  }, []);

  const logout = useCallback(() => {
    api.logout(); setUser(null);
  }, []);

  // ✅ Memoize value to prevent unnecessary renders
  const value = useMemo(
    () => ({ user, login, logout }),
    [user, login, logout]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook — hides implementation
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('Must be inside AuthProvider');
  return ctx;
}

// Usage — clean!
function Header() {
  const { user, logout } = useAuth();
  return user
    ? <button onClick={logout}>Logout</button>
    : <a href="/login">Login</a>;
}`
      },
      {
        q: "Portals and Error Boundaries",
        a: "Portals render children into a different DOM node — perfect for modals/tooltips that need to escape overflow:hidden or z-index stacking contexts. Error Boundaries (class components) catch JS errors in their subtree and show fallback UI instead of crashing the whole app.",
        code: `// Portal
import { createPortal } from 'react-dom';

function Modal({ isOpen, onClose, children }) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;
  return createPortal(
    <div className="overlay" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true"
           onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    document.getElementById('portal-root') // outside #root!
  );
}

// Error Boundary (must be class component)
class ErrorBoundary extends React.Component {
  state = { crashed: false };

  static getDerivedStateFromError() {
    return { crashed: true };
  }
  componentDidCatch(error, { componentStack }) {
    logToSentry(error, componentStack);
  }
  render() {
    if (this.state.crashed)
      return this.props.fallback ?? <h2>Something went wrong.</h2>;
    return this.props.children;
  }
}

// Wrap feature sections, not the whole app
<ErrorBoundary fallback={<p>Dashboard failed</p>}>
  <Dashboard />
</ErrorBoundary>`
      }
    ]
  },
  {
    id: "redux", label: "Redux", icon: "⟳", color: "#a78bfa",
    questions: [
      {
        q: "Redux Toolkit: createSlice and createAsyncThunk",
        a: "Redux Toolkit (RTK) is the official way to write Redux. createSlice auto-generates action creators + reducers and uses Immer so you can write 'mutating' code that compiles to immutable updates. createAsyncThunk handles async lifecycle: pending → fulfilled → rejected.",
        code: `import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk
export const fetchUsers = createAsyncThunk(
  'users/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch('/api/users');
      if (!res.ok) throw new Error(res.status);
      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState: { list: [], loading: false, error: null },

  reducers: {
    // Immer: looks like mutation, compiles to immutable ✅
    addUser:    (state, { payload }) => { state.list.push(payload); },
    removeUser: (state, { payload }) => {
      state.list = state.list.filter(u => u.id !== payload);
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending,   s => { s.loading = true; s.error = null; })
      .addCase(fetchUsers.fulfilled, (s, { payload }) => {
        s.loading = false; s.list = payload;
      })
      .addCase(fetchUsers.rejected,  (s, { payload }) => {
        s.loading = false; s.error = payload;
      });
  }
});

export const { addUser, removeUser } = usersSlice.actions;
export default usersSlice.reducer;`
      },
      {
        q: "useSelector, useDispatch, and createSelector",
        a: "useSelector reads from the store and re-renders only when the selected value changes. useDispatch sends actions. createSelector creates memoized selectors that only recompute when their inputs change — critical for performance.",
        code: `import { useSelector, useDispatch } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit';

// ✅ Memoized selectors — outside components
const selectUsers = (state) => state.users.list;

const selectActiveUsers = createSelector(
  selectUsers,
  (users) => users.filter(u => u.active)   // only reruns when users changes
);

const selectStats = createSelector(
  selectUsers,
  (users) => ({
    total:  users.length,
    active: users.filter(u => u.active).length,
  })
);

// Component
function UsersList() {
  const dispatch    = useDispatch();
  const loading     = useSelector(s => s.users.loading);
  const activeUsers = useSelector(selectActiveUsers);
  const stats       = useSelector(selectStats);

  useEffect(() => { dispatch(fetchUsers()); }, [dispatch]);

  const remove = useCallback(
    (id) => dispatch(removeUser(id)), [dispatch]
  );

  if (loading) return <Spinner />;
  return (
    <>
      <p>Active: {stats.active}/{stats.total}</p>
      {activeUsers.map(u =>
        <UserCard key={u.id} user={u}
          onRemove={() => remove(u.id)} />
      )}
    </>
  );
}`
      },
      {
        q: "How to configure the Redux store with middleware?",
        a: "configureStore from RTK wires up the reducer map, DevTools, and default middleware (redux-thunk, serializability check). Add custom middleware for logging, analytics, or API handling by extending getDefaultMiddleware().",
        code: `import { configureStore } from '@reduxjs/toolkit';
import usersReducer from './usersSlice';
import authReducer  from './authSlice';
import cartReducer  from './cartSlice';

// Custom logger middleware
const logger = (store) => (next) => (action) => {
  console.group(action.type);
  console.log('prev:', store.getState());
  const result = next(action);
  console.log('next:', store.getState());
  console.groupEnd();
  return result;
};

const store = configureStore({
  reducer: {
    users: usersReducer,
    auth:  authReducer,
    cart:  cartReducer,
  },
  middleware: (getDefault) =>
    getDefault().concat(logger),
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;

// Wrap your app
import { Provider } from 'react-redux';
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);`
      }
    ]
  },
  {
    id: "testing", label: "Testing", icon: "✓", color: "#4ade80",
    questions: [
      {
        q: "Testing React components with React Testing Library",
        a: "RTL tests UI the way users interact with it — by visible elements, not implementation details. Query priority: getByRole > getByLabelText > getByText > getByTestId. Use userEvent over fireEvent for realistic interactions. Test behavior, not state.",
        code: `import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('LoginForm', () => {
  it('renders form elements', () => {
    render(<LoginForm />);
    expect(screen.getByRole('heading', { name: /sign in/i }))
      .toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('calls onLogin with credentials', async () => {
    const user = userEvent.setup();
    const mockLogin = jest.fn().mockResolvedValue({});
    render(<LoginForm onLogin={mockLogin} />);

    await user.type(screen.getByLabelText(/email/i), 'a@test.com');
    await user.type(screen.getByLabelText(/password/i), 'pass123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(mockLogin).toHaveBeenCalledWith({
      email: 'a@test.com', password: 'pass123'
    });
  });

  it('shows validation error on empty submit', async () => {
    const user = userEvent.setup();
    render(<LoginForm onLogin={jest.fn()} />);

    await user.click(screen.getByRole('button', { name: /sign in/i }));

    // findBy* = async — waits for element
    expect(await screen.findByText(/email is required/i))
      .toBeInTheDocument();
  });
});`
      },
      {
        q: "Async testing and mocking APIs with MSW",
        a: "Use findBy* (async) queries for content that appears after data loads. Mock Service Worker (MSW) intercepts real HTTP requests at the network level — no mocking fetch/axios directly. Tests are realistic and the same mocks work in browser too.",
        code: `import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  http.get('/api/users/:id', ({ params }) =>
    HttpResponse.json({ id: params.id, name: 'Alice' })
  )
);

beforeAll(()  => server.listen({ onUnhandledRequest: 'error' }));
afterEach(()  => server.resetHandlers());
afterAll(()   => server.close());

it('loads and shows user data', async () => {
  render(<UserCard userId="1" />);

  // Shows spinner initially
  expect(screen.getByRole('status')).toBeInTheDocument();

  // findBy* waits for element to appear
  expect(await screen.findByText('Alice')).toBeInTheDocument();
  expect(screen.queryByRole('status')).not.toBeInTheDocument();
});

it('shows error on API failure', async () => {
  server.use(                        // override for this test only
    http.get('/api/users/:id', () =>
      HttpResponse.json({ message: 'Not found' }, { status: 404 })
    )
  );
  render(<UserCard userId="999" />);
  expect(await screen.findByRole('alert')).toBeInTheDocument();
});`
      },
      {
        q: "Testing Redux-connected components",
        a: "Wrap components in a real (not mocked) store using a custom render helper. Provide preloadedState to set up the scenario. Test that components render correctly from state and that dispatched actions update the store as expected.",
        code: `import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import usersReducer from './usersSlice';

// ✅ Custom render with real store
function renderWithStore(ui, preloadedState = {}) {
  const store = configureStore({
    reducer: { users: usersReducer },
    preloadedState
  });
  return { ...render(<Provider store={store}>{ui}</Provider>), store };
}

const INITIAL = {
  users: {
    list: [
      { id: 1, name: 'Alice', active: true },
      { id: 2, name: 'Bob',   active: false },
    ],
    loading: false, error: null
  }
};

it('renders users from store', () => {
  const { getByText } = renderWithStore(<UsersList />, INITIAL);
  expect(getByText('Alice')).toBeInTheDocument();
  expect(getByText('Bob')).toBeInTheDocument();
});

it('removes user from store on delete click', async () => {
  const user = userEvent.setup();
  const { store, getByRole } =
    renderWithStore(<UsersList />, INITIAL);

  await user.click(getByRole('button', { name: /remove alice/i }));

  expect(store.getState().users.list).toHaveLength(1);
  expect(store.getState().users.list[0].name).toBe('Bob');
});`
      }
    ]
  },
];

const TIPS = [
  { icon: "💬", title: "Think out loud", desc: "Narrate your reasoning — interviewers want to see how you think, not just the final answer." },
  { icon: "🤔", title: "Ask clarifying questions", desc: "Before coding anything, confirm what the interviewer is looking for. Shows maturity." },
  { icon: "⚖️", title: "Always mention trade-offs", desc: "'Context is simpler but Redux gives better devtools and time-travel debugging.'" },
  { icon: "♿", title: "Bring up accessibility", desc: "Mention a11y unprompted in any UI question — very few candidates do. It impresses." },
  { icon: "✅", title: "Mention tests", desc: "After writing code, say 'I'd test edge cases: null input, empty array, async failure...'" },
  { icon: "🔷", title: "Use TypeScript terms", desc: "Even in a JS interview, saying 'I'd type this as...' signals production-quality thinking." },
  { icon: "⚡", title: "Talk about performance", desc: "Mention bundle size, code splitting, memoization for any component discussion." },
  { icon: "🎯", title: "Simple first, optimize after", desc: "Get a working solution first. Then say 'I'd optimize this by...' — don't over-engineer." },
];

export default function App() {
  const [topicIdx, setTopicIdx] = useState(0);
  const [qIdx, setQIdx] = useState(0);
  const [revealed, setRevealed] = useState({ answer: false, code: false });
  const [reviewed, setReviewed] = useState({});
  const [screen, setScreen] = useState("study"); // study | map | tips
  const scrollRef = useRef(null);

  const topic = topics[topicIdx];
  const q = topic.questions[qIdx];
  const reviewKey = `${topic.id}-${qIdx}`;
  const isReviewed = !!reviewed[reviewKey];

  const totalQ = topics.reduce((s, t) => s + t.questions.length, 0);
  const doneCount = Object.values(reviewed).filter(Boolean).length;
  const pct = Math.round((doneCount / totalQ) * 100);

  function goTo(ti, qi) {
    setTopicIdx(ti); setQIdx(qi);
    setRevealed({ answer: false, code: false });
    setScreen("study");
    scrollRef.current?.scrollTo(0, 0);
  }

  function next() {
    if (qIdx < topic.questions.length - 1) goTo(topicIdx, qIdx + 1);
    else if (topicIdx < topics.length - 1) goTo(topicIdx + 1, 0);
  }

  function prev() {
    if (qIdx > 0) goTo(topicIdx, qIdx - 1);
    else if (topicIdx > 0) goTo(topicIdx - 1, topics[topicIdx - 1].questions.length - 1);
  }

  function markAndNext() {
    setReviewed(r => ({ ...r, [reviewKey]: true }));
    next();
  }

  const isFirst = topicIdx === 0 && qIdx === 0;
  const isLast  = topicIdx === topics.length - 1 && qIdx === topic.questions.length - 1;

  const flatIdx = topics.slice(0, topicIdx).reduce((s,t) => s + t.questions.length, 0) + qIdx;

  return (
    <div style={{
      height: "100vh", display: "flex", flexDirection: "column",
      background: "#07080f", color: "#dde3f0",
      fontFamily: "'DM Sans', system-ui, sans-serif",
      overflow: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 99px; }
        button { font-family: inherit; }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pop {
          0%   { transform: scale(0.95); opacity: 0; }
          60%  { transform: scale(1.02); }
          100% { transform: scale(1);    opacity: 1; }
        }
        .reveal { animation: slideUp 0.25s ease forwards; }
        .pop    { animation: pop 0.3s ease forwards; }
        .nav-btn:hover { background: #0f172a !important; color: #e2e8f0 !important; }
        .topic-pill:hover { opacity: 0.85; }
        .card-btn:hover { filter: brightness(1.15); }
      `}</style>

      {/* ── HEADER ── */}
      <header style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "0 16px", height: 50, flexShrink: 0,
        background: "#090a12", borderBottom: "1px solid #12172a",
        zIndex: 10,
      }}>
        <div style={{ fontWeight: 800, fontSize: 14, color: "#fff", letterSpacing: "-0.02em", whiteSpace: "nowrap" }}>
          FE Prep <span style={{ color: topic.color }}>Kit</span>
        </div>

        {/* Topic tabs */}
        <div style={{ display: "flex", gap: 4, overflow: "auto", flex: 1, padding: "0 4px" }}>
          {topics.map((t, ti) => {
            const done = t.questions.filter((_, qi) => reviewed[`${t.id}-${qi}`]).length;
            const active = ti === topicIdx && screen === "study";
            return (
              <button key={t.id} className="topic-pill" onClick={() => goTo(ti, 0)}
                style={{
                  padding: "4px 10px", borderRadius: 99, fontSize: 12, fontWeight: 600,
                  cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0, border: "none",
                  background: active ? `${t.color}25` : "transparent",
                  color: active ? t.color : "#4a5568",
                  outline: active ? `1px solid ${t.color}50` : "1px solid transparent",
                  transition: "all 0.15s",
                }}>
                {t.icon} {t.label}
                {done > 0 && <span style={{ marginLeft: 4, opacity: 0.7 }}>
                  {done === t.questions.length ? "✓" : `${done}/${t.questions.length}`}
                </span>}
              </button>
            );
          })}
        </div>

        {/* Right controls */}
        <div style={{ display: "flex", gap: 4, flexShrink: 0, alignItems: "center" }}>
          <button className="nav-btn" onClick={() => setScreen(s => s === "map" ? "study" : "map")}
            style={{
              padding: "4px 10px", borderRadius: 6, fontSize: 12, cursor: "pointer",
              background: screen === "map" ? "#1e293b" : "transparent",
              border: "1px solid #1a2035", color: "#64748b", transition: "all 0.15s",
            }}>🗺 Map</button>
          <button className="nav-btn" onClick={() => setScreen(s => s === "tips" ? "study" : "tips")}
            style={{
              padding: "4px 10px", borderRadius: 6, fontSize: 12, cursor: "pointer",
              background: screen === "tips" ? "#1e293b" : "transparent",
              border: "1px solid #1a2035", color: "#64748b", transition: "all 0.15s",
            }}>⚡ Tips</button>

          <div style={{ width: 1, height: 20, background: "#1a2035", margin: "0 4px" }} />

          {/* Progress ring */}
          <div style={{ position: "relative", width: 32, height: 32 }}>
            <svg width="32" height="32" style={{ transform: "rotate(-90deg)" }}>
              <circle cx="16" cy="16" r="13" fill="none" stroke="#1a2035" strokeWidth="3" />
              <circle cx="16" cy="16" r="13" fill="none" stroke="#22c55e" strokeWidth="3"
                strokeDasharray={`${2 * Math.PI * 13}`}
                strokeDashoffset={`${2 * Math.PI * 13 * (1 - pct / 100)}`}
                strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.5s ease" }} />
            </svg>
            <span style={{
              position: "absolute", inset: 0, display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: 9, fontWeight: 700, color: "#94a3b8",
            }}>{pct}%</span>
          </div>
        </div>
      </header>

      {/* ── BODY ── */}
      <div ref={scrollRef} style={{ flex: 1, overflow: "auto", padding: "20px 16px" }}>

        {/* ── STUDY ── */}
        {screen === "study" && (
          <div style={{ maxWidth: 700, margin: "0 auto" }}>

            {/* Topic + progress header */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
              <span style={{
                padding: "3px 12px", borderRadius: 99, fontSize: 12, fontWeight: 700,
                background: `${topic.color}18`, color: topic.color,
                border: `1px solid ${topic.color}30`,
              }}>{topic.icon} {topic.label}</span>

              <div style={{ display: "flex", gap: 4 }}>
                {topic.questions.map((_, qi) => (
                  <button key={qi} onClick={() => goTo(topicIdx, qi)}
                    style={{
                      width: qi === qIdx ? 20 : 7, height: 7, borderRadius: 99, padding: 0,
                      border: "none", cursor: "pointer", transition: "all 0.2s",
                      background: reviewed[`${topic.id}-${qi}`] ? "#22c55e"
                        : qi === qIdx ? topic.color : "#1a2035",
                    }} />
                ))}
              </div>

              <span style={{ marginLeft: "auto", fontSize: 12, color: "#334155" }}>
                Q{qIdx + 1} / {topic.questions.length}
              </span>

              {isReviewed && (
                <span style={{ fontSize: 11, color: "#22c55e", fontWeight: 600 }}>✓ Reviewed</span>
              )}
            </div>

            {/* Question */}
            <div style={{
              background: "#0c1220", borderRadius: 14,
              border: `1px solid ${topic.color}28`,
              padding: "24px 28px", marginBottom: 16,
              boxShadow: `0 0 32px ${topic.color}08`,
            }}>
              <div style={{ display: "flex", gap: 12 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                  background: `${topic.color}18`, border: `1px solid ${topic.color}35`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: 800, color: topic.color,
                }}>Q{qIdx + 1}</div>
                <p style={{ margin: 0, fontSize: 17, fontWeight: 700, lineHeight: 1.55, paddingTop: 5 }}>
                  {q.q}
                </p>
              </div>
            </div>

            {/* ── ANSWER REVEAL ── */}
            {!revealed.answer ? (
              <button className="card-btn pop"
                onClick={() => setRevealed({ answer: true, code: false })}
                style={{
                  width: "100%", padding: "15px 20px", borderRadius: 12,
                  cursor: "pointer", border: `2px dashed ${topic.color}45`,
                  background: `${topic.color}0e`, color: topic.color,
                  fontSize: 14, fontWeight: 700, letterSpacing: "0.01em",
                  transition: "all 0.2s",
                }}>
                💡 Tap to reveal answer
              </button>
            ) : (
              <div className="reveal">
                {/* Answer box */}
                <div style={{
                  background: "#080e1c", border: "1px solid #1e3050",
                  borderRadius: 12, padding: "18px 22px", marginBottom: 12,
                }}>
                  <div style={{ display: "flex", gap: 10 }}>
                    <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>💡</span>
                    <p style={{ margin: 0, fontSize: 14, lineHeight: 1.85, color: "#94a3b8" }}>
                      {q.a}
                    </p>
                  </div>
                </div>

                {/* Code reveal */}
                {!revealed.code ? (
                  <button className="card-btn"
                    onClick={() => setRevealed(r => ({ ...r, code: true }))}
                    style={{
                      width: "100%", padding: "12px 18px", borderRadius: 10,
                      cursor: "pointer", border: "1px dashed #1e293b",
                      background: "transparent", color: "#475569",
                      fontSize: 13, fontWeight: 600, transition: "all 0.2s",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    }}>
                    <span>{"</>"}</span> Tap to see code example
                  </button>
                ) : (
                  <div className="reveal" style={{ borderRadius: 12, overflow: "hidden", border: "1px solid #161e30" }}>
                    <div style={{
                      background: "#0a0f1c", padding: "8px 16px",
                      borderBottom: "1px solid #161e30",
                      display: "flex", alignItems: "center", gap: 8,
                    }}>
                      <div style={{ display: "flex", gap: 5 }}>
                        {["#ff5f57","#febc2e","#28c840"].map(c => (
                          <div key={c} style={{ width: 9, height: 9, borderRadius: "50%", background: c }} />
                        ))}
                      </div>
                      <span style={{ fontSize: 11, color: "#334155", marginLeft: 4 }}>example.jsx</span>
                      <button onClick={() => setRevealed(r => ({ ...r, code: false }))}
                        style={{
                          marginLeft: "auto", background: "transparent", border: "none",
                          color: "#334155", cursor: "pointer", fontSize: 12,
                        }}>✕ hide</button>
                    </div>
                    <pre style={{
                      margin: 0, padding: "18px 20px", background: "#040810",
                      overflowX: "auto", fontSize: 12.5, lineHeight: 1.85,
                      color: "#7dd3fc",
                      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                    }}><code>{q.code}</code></pre>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── MAP ── */}
        {screen === "map" && (
          <div style={{ maxWidth: 860, margin: "0 auto" }}>
            <h2 style={{ margin: "0 0 6px", fontSize: 20, fontWeight: 800 }}>All Questions</h2>
            <p style={{ margin: "0 0 24px", fontSize: 13, color: "#475569" }}>
              {doneCount} of {totalQ} reviewed
            </p>
            {topics.map((t, ti) => {
              const done = t.questions.filter((_, qi) => reviewed[`${t.id}-${qi}`]).length;
              return (
                <div key={t.id} style={{ marginBottom: 24 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    <span style={{ color: t.color, fontSize: 16 }}>{t.icon}</span>
                    <span style={{ fontWeight: 800, fontSize: 15, color: t.color }}>{t.label}</span>
                    <span style={{ fontSize: 12, color: "#334155" }}>— {done}/{t.questions.length}</span>
                  </div>
                  <div style={{ display: "grid", gap: 6 }}>
                    {t.questions.map((q, qi) => {
                      const key = `${t.id}-${qi}`;
                      const done = !!reviewed[key];
                      const active = topicIdx === ti && qIdx === qi;
                      return (
                        <button key={qi} onClick={() => goTo(ti, qi)}
                          style={{
                            display: "flex", alignItems: "center", gap: 10,
                            padding: "11px 14px", borderRadius: 9,
                            background: active ? `${t.color}15` : "#0c1220",
                            border: `1px solid ${active ? t.color + "40" : "#12172a"}`,
                            cursor: "pointer", color: "#e2e8f0", textAlign: "left",
                            transition: "all 0.12s",
                          }}>
                          <span style={{
                            fontSize: 11, fontWeight: 700, color: t.color,
                            background: `${t.color}15`, padding: "1px 7px",
                            borderRadius: 4, flexShrink: 0,
                          }}>Q{qi + 1}</span>
                          <span style={{ flex: 1, fontSize: 13, lineHeight: 1.4 }}>{q.q}</span>
                          <span style={{ color: done ? "#22c55e" : "#1e293b", flexShrink: 0, fontSize: 14 }}>
                            {done ? "✓" : "○"}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── TIPS ── */}
        {screen === "tips" && (
          <div style={{ maxWidth: 620, margin: "0 auto" }}>
            <h2 style={{ margin: "0 0 6px", fontSize: 20, fontWeight: 800 }}>Interview Strategy</h2>
            <p style={{ margin: "0 0 24px", fontSize: 13, color: "#475569" }}>
              Technical skills get the interview. These get the offer.
            </p>
            <div style={{ display: "grid", gap: 10 }}>
              {TIPS.map(({ icon, title, desc }) => (
                <div key={title} style={{
                  display: "flex", gap: 14, padding: "16px 18px",
                  background: "#0c1220", border: "1px solid #12172a", borderRadius: 12,
                }}>
                  <span style={{ fontSize: 24, flexShrink: 0 }}>{icon}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{title}</div>
                    <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.65 }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── FOOTER NAV ── */}
      {screen === "study" && (
        <footer style={{
          flexShrink: 0, display: "flex", alignItems: "center", gap: 10,
          padding: "10px 16px", borderTop: "1px solid #12172a",
          background: "#090a12",
        }}>
          <button onClick={prev} disabled={isFirst}
            style={{
              padding: "8px 16px", borderRadius: 8, cursor: isFirst ? "not-allowed" : "pointer",
              background: "transparent", border: "1px solid #1a2035",
              color: isFirst ? "#1e293b" : "#64748b", fontSize: 13, fontWeight: 600,
              transition: "all 0.15s",
            }}>← Prev</button>

          {/* Overall progress bar */}
          <div style={{ flex: 1, height: 4, background: "#12172a", borderRadius: 99, overflow: "hidden" }}>
            <div style={{
              height: "100%", borderRadius: 99, transition: "width 0.4s ease",
              background: `linear-gradient(90deg, ${topic.color}, #22c55e)`,
              width: `${((flatIdx + 1) / totalQ) * 100}%`,
            }} />
          </div>

          <span style={{ fontSize: 11, color: "#334155", flexShrink: 0 }}>
            {flatIdx + 1}/{totalQ}
          </span>

          <button onClick={markAndNext} disabled={isLast && isReviewed}
            style={{
              padding: "8px 16px", borderRadius: 8, cursor: "pointer",
              background: "#052e16", border: "1px solid #14532d",
              color: "#4ade80", fontSize: 13, fontWeight: 700,
              transition: "all 0.15s",
            }}>✓ Got it</button>

          <button onClick={next} disabled={isLast}
            style={{
              padding: "8px 18px", borderRadius: 8,
              cursor: isLast ? "not-allowed" : "pointer",
              background: isLast ? "#12172a" : topic.color,
              border: "none", color: isLast ? "#334155" : "#000",
              fontSize: 13, fontWeight: 700, transition: "all 0.15s",
            }}>Next →</button>
        </footer>
      )}
    </div>
  );
}