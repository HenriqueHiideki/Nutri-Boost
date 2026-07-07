const jwt = require('jsonwebtoken');

function verificarToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ erro: 'Token não fornecido.' });
  }

  // O header vem no formato "Bearer <token>", separamos as duas partes
  const [, token] = authHeader.split(' ');

  if (!token) {
    return res.status(401).json({ erro: 'Token mal formatado.' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.nutricionistaId = payload.id; // disponibiliza o id logado para as rotas seguintes
    next(); // token válido, segue para a rota de verdade
  } catch (erro) {
    return res.status(401).json({ erro: 'Token inválido ou expirado.' });
  }
}

module.exports = verificarToken;