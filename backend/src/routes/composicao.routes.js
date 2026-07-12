const express = require('express');
const router = express.Router();
const pool = require('../db');

//-----------------------------------------------------------------------------------------
router.get('/:id/composicao', async (req, res) => {
  const { id } = req.params;

  try {
    const resultado = await pool.query(
      `SELECT cc.peso, cc.percentual_gordura, cc.percentual_massa_magra, cc.data_medicao
       FROM composicao_corporal cc
       JOIN pacientes p ON p.id = cc.paciente_id
       WHERE cc.paciente_id = $1 AND p.nutricionista_id = $2
       ORDER BY cc.data_medicao DESC
       LIMIT 1`,
      [id, req.nutricionistaId]
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

//-----------------------------------------------------------------------------------------
router.get('/:id/composicao/historico', async (req, res) => {
  const { id } = req.params;

  try {
    const resultado = await pool.query(
      `SELECT cc.peso, cc.percentual_gordura, cc.percentual_massa_magra, cc.data_medicao
       FROM composicao_corporal cc
       JOIN pacientes p ON p.id = cc.paciente_id
       WHERE cc.paciente_id = $1 AND p.nutricionista_id = $2
       ORDER BY cc.data_medicao ASC`,
      [id, req.nutricionistaId]
    );

    res.json(resultado.rows);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao buscar histórico de composição corporal.' });
  }
});

module.exports = router;