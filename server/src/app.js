import express from 'express';
import cors from 'cors';
import authRoutes from "./routes/auth.routes.js";
import userRoutes from './routes/user.routes.js';
import deckRoutes from './routes/deck.routes.js';
    
const app =express();

app.use(cors());

app.use(express.json());

app.use('/api/auth', authRoutes);

app.use('/api/users', userRoutes);

app.use('/api/decks', deckRoutes);

app.get('/', (req, res) => {
    res.json({ 
        message: 'Corner API running'
     });
});

export default app;