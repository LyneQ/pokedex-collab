import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {BrowserRouter, Route, Routes} from "react-router";

import App from './routes/App';
import Pokemon from './routes/Pokemon';

import './assets/scss/main.scss';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<App/>}/>
            <Route path={"/pokemon/:id"} element={<Pokemon/>}/>
        </Routes>
    </BrowserRouter>
  </StrictMode>,
)
