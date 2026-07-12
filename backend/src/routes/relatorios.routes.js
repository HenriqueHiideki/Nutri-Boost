const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/:id/relatorios', async (req, res) => {
  const { id } = req.params;

  try {
    const resultado = await pool.query(
      `SELECT r.id, r.tipo, r.periodo, r.status, r.criado_em
       FROM relatorios r
       JOIN pacientes p ON p.id = r.paciente_id
       WHERE r.paciente_id = $1 AND p.nutricionista_id = $2
       ORDER BY r.criado_em DESC`,
      [id, req.nutricionistaId]
    );

    res.json(resultado.rows);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao buscar relatórios.' });
  }
});

router.post('/:id/relatorios', async (req, res) => {
  const { id } = req.params;
  const { tipo, periodo } = req.body;

  if (!tipo || !periodo) {
    return res.status(400).json({ erro: 'Tipo e período são obrigatórios.' });
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