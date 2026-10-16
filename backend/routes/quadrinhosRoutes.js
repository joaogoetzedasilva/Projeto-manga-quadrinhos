import { Router } from 'express';
import {
  listarQuadrinhos,
  buscarQuadrinhoPorId,
  cadastrarQuadrinho,
  atualizarQuadrinho,
  deletarQuadrinho
} from '../controllers/quadrinhosController.js';

const router = Router();

router.get('/', listarQuadrinhos);          // GET /quadrinhos
router.get('/:id', buscarQuadrinhoPorId);   // GET /quadrinhos/:id
router.post('/', cadastrarQuadrinho);       // POST /quadrinhos
router.put('/:id', atualizarQuadrinho);     // PUT /quadrinhos/:id
router.delete('/:id', deletarQuadrinho);    // DELETE /quadrinhos/:id

export default router;