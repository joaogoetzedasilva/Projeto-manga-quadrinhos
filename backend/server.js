import express from 'express';
import cors from 'cors';
import quadrinhosRoutes from './routes/quadrinhosRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/quadrinhos', quadrinhosRoutes);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`✅ API rodando em http://localhost:${PORT}/quadrinhos`);
});