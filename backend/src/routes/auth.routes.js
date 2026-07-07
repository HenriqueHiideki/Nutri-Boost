const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');

// POST /auth/login -> confere e-mail + senha, devolve um token se estiver certo
router.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: 'E-mail e senha são obrigatórios.' });
  }

  try {
    const resultado = await pool.query(
      'SELECT id, nome, email, senha_hash FROM nutricionistas WHERE email = $1',
      [email]
    );

    if (resultado.rows.length === 0) {
      return res.status(401).json({ erro: 'E-mail ou senha inválidos.' });
    }

    const nutricionista = resultado.rows[0];

    const senhaConfere = await bcrypt.compare(senha, nutricionista.senha_hash);

    if (!senhaConfere) {
      return res.status(401).json({ erro: 'E-mail ou senha inválidos.' });
    }

    const token = jwt.sign(
      { id: nutricionista.id, email: nutricionista.email },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      token,
      nutricionista: { id: nutricionista.id, nome: nutricionista.nome, email: nutricionista.email },
    });

  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao processar login.' });
  }
});

module.exports = router;