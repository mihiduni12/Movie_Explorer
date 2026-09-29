# Movie Explorer

Search movies, browse trending films, view details and trailers, and save favorites. Built with React (Create React App), Material-UI, React Router, axios and the [TMDb API](https://developers.themoviedb.org/3).

## Features
- Login screen (demo auth, session kept in localStorage; any username of 3+ chars and password of 4+ chars)
- Debounced search bar with a poster grid showing title, release year and rating
- Trending movies section (`/trending/movie/week`)
- Movie details page: overview, genres, runtime, rating, cast, embedded YouTube trailer
- Infinite scrolling for results, plus a **Load more** button mode (toggle above the results)
- Filters by genre, year and minimum rating (bonus)
- Light/dark mode (defaults to the OS setting and is remembered)
- Favorites list stored in localStorage; last search restored on reload
- Friendly error messages (bad or missing key, offline, rate limit, not found) with retry
- Mobile-first responsive layout and protected routes

## State management
React Context API:

| Context | Responsibility |
|---|---|
| `ThemeContext` | light/dark mode and MUI theme |
| `AuthContext` | current user, login/logout |
| `MovieContext` | query, filters, results, paging, trending, genres, favorites |

## API usage
All calls live in `src/api/tmdb.js` (one axios instance):

| Purpose | Endpoint |
|---|---|
| Trending | `GET /trending/movie/week` |
| Search | `GET /search/movie` (genre/rating filtered client-side) |
| Filters only | `GET /discover/movie` |
| Genres | `GET /genre/movie/list` |
| Details, cast, trailer | `GET /movie/{id}?append_to_response=credits,videos` |

## Setup
```bash
npm install
cp .env.example .env      # paste your TMDb v3 API key
npm start                 # http://localhost:3000
npm run build             # production build
```
Get a free key at https://www.themoviedb.org/settings/api

## Project structure
```
src/
  api/tmdb.js             axios client and error messages
  context/                Theme, Auth, Movie providers
  hooks/useLocalStorage.js
  components/             Navbar, SearchBar, FilterBar, MovieCard, MovieGrid, ProtectedRoute
  pages/                  Login, Home, MovieDetails, Favorites
```

## Deploy (Vercel)
1. Push the repo to GitLab, then import it at vercel.com.
2. Add the environment variable `REACT_APP_TMDB_API_KEY`.
3. Deploy. `vercel.json` makes React Router deep links survive a refresh. (Netlify works the same way; `public/_redirects` is included.)

**Live demo:** [movie-explorer-ten-liard.vercel.app](https://movie-explorer-ten-liard.vercel.app)

## Notes
- Create React App bundles the API key into the client. Never commit `.env`.
- Login is a front-end demo only; swap `AuthContext.login` for a real backend if needed.
