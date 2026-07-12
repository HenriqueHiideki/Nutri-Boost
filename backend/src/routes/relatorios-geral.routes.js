const express = require('express');
const router = express.Router();
const pool = require('../db');

//-------------------------------------------------------------
router.get('/', async (req, res) => {
  try {
    const resultado = await pool.query(
      `SELECT 
         r.id, r.tipo, r.periodo, r.status, r.criado_em,
         p.id AS paciente_id, p.nome AS paciente_nome
       FROM relatorios r
       JOIN pacientes p ON p.id = r.paciente_id
       WHERE p.nutricionista_id = $1
       ORDER BY r.criado_em DESC`,
      [req.nutricionistaId]
    );

    res.json(resultado.rows);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao buscar relatórios.' });
  }
});

module.exports = router;