const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /pacientes/:id/observacoes -> lista observações do paciente, mais recente primeiro
router.get('/:id/observacoes', async (req, res) => {
  const { id } = req.params;

  try {
    const resultado = await pool.query(
      `SELECT id, texto, criado_em
       FROM observacoes
       WHERE paciente_id = $1
       ORDER BY criado_em DESC`,
      [id]
    );

    res.json(resultado.rows);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao buscar observações.' });
  }
});

// POST /pacientes/:id/observacoes -> cria uma nova observação para o paciente
router.post('/:id/observacoes', async (req, res) => {
  const { id } = req.params;
  const { texto } = req.body;

  if (!texto || texto.trim() === '') {
    return res.status(400).json({ erro: 'O texto da observação é obrigatório.' });
  }

  try {
    const resultado = await pool.query(
      `INSERT INTO observacoes (paciente_id, texto)
       VALUES ($1, $2)
       RETURNING id, texto, criado_em`,
      [id, texto]
    );

    res.status(201).json(resultado.rows[0]);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao criar observação.' });
  }
});

module.exports = router;