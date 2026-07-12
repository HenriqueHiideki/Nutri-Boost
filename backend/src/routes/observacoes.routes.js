const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/:id/observacoes', async (req, res) => {
  const { id } = req.params;

  try {
    const resultado = await pool.query(
      `SELECT o.id, o.texto, o.criado_em
       FROM observacoes o
       JOIN pacientes p ON p.id = o.paciente_id
       WHERE o.paciente_id = $1 AND p.nutricionista_id = $2
       ORDER BY o.criado_em DESC`,
      [id, req.nutricionistaId]
    );

    res.json(resultado.rows);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao buscar observações.' });
  }
});

router.post('/:id/observacoes', async (req, res) => {
  const { id } = req.params;
  const { texto } = req.body;

  if (!texto || texto.trim() === '') {
    return res.status(400).json({ erro: 'O texto da observação é obrigatório.' });
  }

  try {
    const paciente = await pool.query(
      'SELECT id FROM pacientes WHERE id = $1 AND nutricionista_id = $2',
      [id, req.nutricionistaId]
    );

    if (paciente.rows.length === 0) {
      return res.status(404).json({ erro: 'Paciente não encontrado.' });
    }

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