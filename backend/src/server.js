const express = require('express');
const cors = require('cors');
const pool = require('./db');
require('dotenv').config();

const pacientesRoutes = require('./routes/pacientes.routes');
const composicaoRoutes = require('./routes/composicao.routes');
const observacoesRoutes = require('./routes/observacoes.routes');
const dietaRoutes = require('./routes/dieta.routes');
const relatoriosRoutes = require('./routes/relatorios.routes');
const authRoutes = require('./routes/auth.routes');
const verificarToken = require('./middlewares/auth.middleware');
const nutricionistasRoutes = require('./routes/nutricionistas.routes');
const relatoriosGeralRoutes = require('./routes/relatorios-geral.routes');

const app = express();

app.use(cors({
  origin: [
    'http://localhost:5500',
    'http://127.0.0.1:5500',
    /\.netlify\.app$/
  ]
}));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ mensagem: 'API do Nutri Boost está no ar.' });
});

app.get('/teste-banco', async (req, res) => {
  try {
    const resultado = await pool.query('SELECT NOW()');
    res.json({ conectado: true, horario_banco: resultado.rows[0].now });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ conectado: false, erro: erro.message });
  }
});

app.use('/pacientes', verificarToken, pacientesRoutes);
app.use('/pacientes', verificarToken, composicaoRoutes);
app.use('/pacientes', verificarToken, dietaRoutes);
app.use('/pacientes', verificarToken, observacoesRoutes);
app.use('/pacientes', verificarToken, relatoriosRoutes);
app.use('/nutricionistas', nutricionistasRoutes);
app.use('/auth', authRoutes);
app.use('/relatorios', verificarToken, relatoriosGeralRoutes);

const PORTA = process.env.PORT || 3000;
app.listen(PORTA, () => {
  console.log(`Servidor rodando em http://localhost:${PORTA}`);
});
