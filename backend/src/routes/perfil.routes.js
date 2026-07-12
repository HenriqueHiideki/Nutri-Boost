const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const pool = require('../db');

router.get('/', async (req, res) => {
  try {
    const resultado = await pool.query(
      'SELECT id, nome, email, crn, telefone, especialidade FROM nutricionistas WHERE id = $1',
      [req.nutricionistaId]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ erro: 'Nutricionista não encontrada.' });
    }

    res.json(resultado.rows[0]);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao buscar perfil.' });
  }
});

router.put('/', async (req, res) => {
  const { nome, email, crn, telefone, especialidade } = req.body;

  if (!nome || !email) {
    return res.status(400).json({ erro: 'Nome e e-mail são obrigatórios.' });
  }

  try {
    const emailEmUso = await pool.query(
      'SELECT id FROM nutricionistas WHERE email = $1 AND id != $2',
      [email, req.nutricionistaId]
    );

    if (emailEmUso.rows.length > 0) {
      return res.status(409).json({ erro: 'Este e-mail já está em uso por outra conta.' });
    }

    const resultado = await pool.query(
      `UPDATE nutricionistas
       SET nome = $1, email = $2, crn = $3, telefone = $4, especialidade = $5
       WHERE id = $6
       RETURNING id, nome, email, crn, telefone, especialidade`,
      [nome, email, crn || null, telefone || null, especialidade || null, req.nutricionistaId]
    );

    res.json(resultado.rows[0]);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao atualizar perfil.' });
  }
});

router.put('/senha', async (req, res) => {
  const { senhaAtual, novaSenha } = req.body;

  if (!senhaAtual || !novaSenha) {
    return res.status(400).json({ erro: 'Senha atual e nova senha são obrigatórias.' });
  }

  if (novaSenha.length < 6) {
    return res.status(400).json({ erro: 'A nova senha precisa ter no mínimo 6 caracteres.' });
  }

  try {
    const resultado = await pool.query(
      'SELECT senha_hash FROM nutricionistas WHERE id = $1',
      [req.nutricionistaId]
    );

    const senhaConfere = await bcrypt.compare(senhaAtual, resultado.rows[0].senha_hash);

    if (!senhaConfere) {
      return res.status(401).json({ erro: 'Senha atual incorreta.' });
    }

    const novoHash = await bcrypt.hash(novaSenha, 10);

    await pool.query(
      'UPDATE nutricionistas SET senha_hash = $1 WHERE id = $2',
      [novoHash, req.nutricionistaId]
    );

    res.json({ mensagem: 'Senha atualizada com sucesso.' });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao atualizar senha.' });
  }
});

module.exports = router;