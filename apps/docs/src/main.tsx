import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@radish-ui/tokens/tokens.css';
import '@radish-ui/react/styles.css';
import { App } from './App';
import './styles.css';

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);
