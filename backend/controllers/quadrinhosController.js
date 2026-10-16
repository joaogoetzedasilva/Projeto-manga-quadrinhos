import pool from '../database/conexao.js';

export async function listarQuadrinhos(req, res) {
  try {
    const [linhas] = await pool.query('SELECT * FROM quadrinhos');
    res.status(200).json(linhas);
  } catch (erro) {
    console.error('Erro ao listar quadrinhos:', erro);
    res.status(500).json({ erro: 'Erro ao buscar quadrinhos no banco.' });
  }
}

export async function buscarQuadrinhoPorId(req, res) {
  try {
    const { id } = req.params;
    const [linhas] = await pool.query(
      'SELECT * FROM quadrinhos WHERE id = ?',
      [id]
    );
    if (linhas.length === 0) {
      return res.status(404).json({ erro: 'Quadrinho não encontrado.' });
    }
    res.status(200).json(linhas[0]);
  } catch (erro) {
    console.error('Erro ao buscar quadrinho:', erro);
    res.status(500).json({ erro: 'Erro ao buscar quadrinho no banco.' });
  }
}

export async function cadastrarQuadrinho(req, res) {
  try {
    const { titulo, volume, autor, categoria, editora, ano, sinopse, imagem, trailer } = req.body;

    if (!titulo || !volume || !autor || !categoria || !editora || !ano || !sinopse) {
      return res.status(400).json({ erro: 'Todos os campos são obrigatórios.' });
    }
    if (isNaN(ano) || ano < 1900 || ano > new Date().getFullYear() + 5) {
      return res.status(400).json({ erro: 'Ano inválido.' });
    }
    if (isNaN(volume) || volume < 1) {
      return res.status(400).json({ erro: 'Volume inválido.' });
    }

    const sql = `
      INSERT INTO quadrinhos (titulo, volume, autor, categoria, editora, ano, sinopse, imagem, trailer)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const valores = [titulo, volume, autor, categoria, editora, ano, sinopse, imagem || '', trailer || ''];

    const [resultado] = await pool.query(sql, valores);

    res.status(201).json({
      mensagem: 'Quadrinho cadastrado com sucesso!',
      id: resultado.insertId
    });
  } catch (erro) {
    console.error('Erro ao cadastrar quadrinho:', erro);
    res.status(500).json({ erro: 'Erro interno do servidor ao cadastrar o quadrinho.' });
  }
}

export async function atualizarQuadrinho(req, res) {
  try {
    const { id } = req.params;
    const { titulo, volume, autor, categoria, editora, ano, sinopse, imagem, trailer } = req.body;

    if (!titulo || !volume || !autor || !categoria || !editora || !ano || !sinopse) {
      return res.status(400).json({ erro: 'Todos os campos são obrigatórios.' });
    }
    if (isNaN(ano) || ano < 1900 || ano > new Date().getFullYear() + 5) {
      return res.status(400).json({ erro: 'Ano inválido.' });
    }

    const [existente] = await pool.query(
      'SELECT id FROM quadrinhos WHERE id = ?',
      [id]
    );
    if (existente.length === 0) {
      return res.status(404).json({ erro: 'Quadrinho não encontrado.' });
    }

    const sql = `
      UPDATE quadrinhos
      SET titulo = ?, volume = ?, autor = ?, categoria = ?, editora = ?, ano = ?, sinopse = ?, imagem = ?, trailer = ?
      WHERE id = ?
    `;
    const valores = [titulo, volume, autor, categoria, editora, ano, sinopse, imagem || '', trailer || '', id];

    await pool.query(sql, valores);

    res.status(200).json({ mensagem: 'Quadrinho atualizado com sucesso!' });
  } catch (erro) {
    console.error('Erro ao atualizar quadrinho:', erro);
    res.status(500).json({ erro: 'Erro interno do servidor ao atualizar o quadrinho.' });
  }
}

export async function deletarQuadrinho(req, res) {
  try {
    const { id } = req.params;
    const [existente] = await pool.query(
      'SELECT id FROM quadrinhos WHERE id = ?',
      [id]
    );
    if (existente.length === 0) {
      return res.status(404).json({ erro: 'Quadrinho não encontrado.' });
    }
    await pool.query('DELETE FROM quadrinhos WHERE id = ?', [id]);
    res.status(200).json({ mensagem: 'Quadrinho excluído com sucesso!' });
  } catch (erro) {
    console.error('Erro ao excluir quadrinho:', erro);
    res.status(500).json({ erro: 'Erro interno do servidor ao excluir o quadrinho.' });
  }
}