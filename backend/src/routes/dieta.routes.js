const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/:id/dieta', async (req, res) => {
  const { id } = req.params;

  try {
    const resultado = await pool.query(
      `SELECT pa.id, pa.refeicao, pa.itens, pa.kcal
       FROM planos_alimentares pa
       JOIN pacientes p ON p.id = pa.paciente_id
       WHERE pa.paciente_id = $1 AND p.nutricionista_id = $2
       ORDER BY pa.id`,
      [id, req.nutricionistaId]
    );

    res.json(resultado.rows);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao buscar plano alimentar.' });
  }
});

module.exports = router;