const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const pool = require('../db');

router.post('/', async (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: 'Nome, e-mail e senha são obrigatórios.' });
  }

  if (senha.length < 6) {
    return res.status(400).json({ erro: 'A senha precisa ter no mínimo 6 caracteres.' });
  }

  try {
    const jaExiste = await pool.query(
      'SELECT id FROM nutricionistas WHERE email = $1',
      [email]
    );

    if (jaExiste.rows.length > 0) {
      return res.status(409).json({ erro: 'Já existe uma conta cadastrada com este e-mail.' });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const resultado = await pool.query(
      `INSERT INTO nutricionistas (nome, email, senha_hash)
       VALUES ($1, $2, $3)
       RETURNING id, nome, email`,
      [nome, email, senhaHash]
    );

    res.status(201).json(resultado.rows[0]);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao cadastrar conta.' });
  }
});

module.exports = router;