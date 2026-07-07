const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  try {
    const resultado = await pool.query(`
      SELECT 
        p.id,
        p.nome,
        p.idade,
        p.status,
        p.objetivo,
        p.ultima_visita,
        cc.peso,
        cc.percentual_gordura,
        cc.percentual_massa_magra
      FROM pacientes p
      LEFT JOIN LATERAL (
        SELECT peso, percentual_gordura, percentual_massa_magra
        FROM composicao_corporal
        WHERE paciente_id = p.id
        ORDER BY data_medicao DESC
        LIMIT 1
      ) cc ON true
      ORDER BY p.nome
    `);
    res.json(resultado.rows);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao buscar pacientes.' });
  }
});

router.post('/', async (req, res) => {
  const { nome, idade, status, objetivo, ultima_visita } = req.body;

  if (!nome || !status || !objetivo) {
    return res.status(400).json({ erro: 'Nome, status e objetivo são obrigatórios.' });
  }

  try {
    const resultado = await pool.query(
      `INSERT INTO pacientes (nutricionista_id, nome, idade, status, objetivo, ultima_visita)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, nome, idade, status, objetivo, ultima_visita`,
      [req.nutricionistaId, nome, idade || null, status, objetivo, ultima_visita || null]
    );

    res.status(201).json(resultado.rows[0]);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao cadastrar paciente.' });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, idade, status, objetivo, ultima_visita } = req.body;

  if (!nome || !status || !objetivo) {
    return res.status(400).json({ erro: 'Nome, status e objetivo são obrigatórios.' });
  }

  try {
    const resultado = await pool.query(
      `UPDATE pacientes
       SET nome = $1, idade = $2, status = $3, objetivo = $4, ultima_visita = $5
       WHERE id = $6
       RETURNING id, nome, idade, status, objetivo, ultima_visita`,
      [nome, idade || null, status, objetivo, ultima_visita || null, id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ erro: 'Paciente não encontrado.' });
    }

    res.json(resultado.rows[0]);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao atualizar paciente.' });
  }
});


router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const resultado = await pool.query(
      'DELETE FROM pacientes WHERE id = $1 RETURNING id',
      [id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ erro: 'Paciente não encontrado.' });
    }

    res.json({ mensagem: 'Paciente excluído com sucesso.', id: resultado.rows[0].id });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao excluir paciente.' });
  }
});

module.exports = router;