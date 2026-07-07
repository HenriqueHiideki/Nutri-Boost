const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /pacientes/:id/composicao -> última medição de composição corporal do paciente
router.get('/:id/composicao', async (req, res) => {
  const { id } = req.params;

  try {
    const resultado = await pool.query(
      `SELECT peso, percentual_gordura, percentual_massa_magra, data_medicao
       FROM composicao_corporal
       WHERE paciente_id = $1
       ORDER BY data_medicao DESC
       LIMIT 1`,
      [id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ erro: 'Nenhuma medição encontrada para este paciente.' });
    }

    res.json(resultado.rows[0]);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao buscar composição corporal.' });
  }
});
// GET /pacientes/:id/composicao/historico -> todas as medições do paciente, em ordem cronológica
router.get('/:id/composicao/historico', async (req, res) => {
  const { id } = req.params;

  try {
    const resultado = await pool.query(
      `SELECT peso, percentual_gordura, percentual_massa_magra, data_medicao
       FROM composicao_corporal
       WHERE paciente_id = $1
       ORDER BY data_medicao ASC`,
      [id]
    );

    res.json(resultado.rows);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao buscar histórico de composição corporal.' });
  }
});

module.exports = router;