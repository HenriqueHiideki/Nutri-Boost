const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /pacientes/:id/dieta -> todas as refeições do plano alimentar do paciente
router.get('/:id/dieta', async (req, res) => {
  const { id } = req.params;

  try {
    const resultado = await pool.query(
      `SELECT id, refeicao, itens, kcal
       FROM planos_alimentares
       WHERE paciente_id = $1
       ORDER BY id`,
      [id]
    );

    res.json(resultado.rows);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao buscar plano alimentar.' });
  }
});

module.exports = router;