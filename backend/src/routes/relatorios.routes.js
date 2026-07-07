const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /pacientes/:id/relatorios -> lista relatórios do paciente, mais recente primeiro
router.get('/:id/relatorios', async (req, res) => {
  const { id } = req.params;

  try {
    const resultado = await pool.query(
      `SELECT id, tipo, periodo, status, criado_em
       FROM relatorios
       WHERE paciente_id = $1
       ORDER BY criado_em DESC`,
      [id]
    );

    res.json(resultado.rows);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao buscar relatórios.' });
  }
});

// POST /pacientes/:id/relatorios -> gera um novo relatório para o paciente
router.post('/:id/relatorios', async (req, res) => {
  const { id } = req.params;
  const { tipo, periodo } = req.body;

  if (!tipo || !periodo) {
    return res.status(400).json({ erro: 'Tipo e período são obrigatórios.' });
  }

  try {
    const resultado = await pool.query(
      `INSERT INTO relatorios (paciente_id, tipo, periodo, status)
       VALUES ($1, $2, $3, 'concluido')
       RETURNING id, tipo, periodo, status, criado_em`,
      [id, tipo, periodo]
    );

    res.status(201).json(resultado.rows[0]);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao gerar relatório.' });
  }
});

module.exports = router;