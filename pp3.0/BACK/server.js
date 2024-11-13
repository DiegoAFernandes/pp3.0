require('dotenv').config();
const express = require('express');
const sql = require('mssql');
const cors = require('cors');
const bcrypt = require('bcryptjs');

// Criando o servidor Express
const app = express();

// Habilitando CORS
app.use(cors({
  origin: 'http://localhost:3000',  // URL do seu frontend (ajuste conforme necessário)
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

// Parse de JSON no corpo da requisição
app.use(express.json());

// Verifique se as variáveis de ambiente estão sendo carregadas corretamente
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_SERVER:', process.env.DB_SERVER);
console.log('DB_DATABASE:', process.env.DB_DATABASE);

// Configuração do banco de dados
const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  }
};

// Conexão com o banco de dados
sql.connect(config)
  .then(() => console.log('Conectado ao banco de dados'))
  .catch(err => {
    console.error('Erro de conexão com o banco de dados:', err.message || err);
    process.exit(1);  // Se a conexão falhar, o servidor é encerrado
  });

// Rota de teste para verificar se o servidor está funcionando
app.get('/', (req, res) => {
  res.json({ message: 'Servidor funcionando corretamente' });
});

// Rota de acesso ao endpoint de login (GET)
app.get('/login', (req, res) => {
  res.json({ message: 'Este é o endpoint de login. Use POST para enviar dados.' });
});

// Endpoint de registro (com hash da senha)
app.post('/register', async (req, res) => {
  const { email, password, phone } = req.body;

  console.log('Dados recebidos para registro:', req.body);

  if (!email || !password || !phone) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const pool = await sql.connect(config);
    const result = await pool.request()
      .input('email', sql.VarChar, email)
      .input('password', sql.VarChar, hashedPassword)
      .input('phone', sql.VarChar, phone)
      .query('INSERT INTO Users (email, password, phone) VALUES (@email, @password, @phone)');

    console.log('Usuário registrado com sucesso:', result);
    res.status(201).json({ message: 'Usuário registrado com sucesso' });
  } catch (err) {
    console.error('Erro ao registrar usuário:', err.message || err);
    res.status(500).json({ message: 'Erro ao registrar usuário. Verifique os dados e tente novamente.' });
  }
});

// Endpoint de login (com verificação de senha criptografada)
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  console.log('Dados recebidos para login:', req.body);

  if (!email || !password) {
    return res.status(400).json({ message: 'Por favor, insira email e senha' });
  }

  try {
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input('email', sql.VarChar, email)
      .query('SELECT * FROM Users WHERE email = @email');

    if (result.recordset.length > 0) {
      const user = result.recordset[0];

      // Verificando a senha com bcrypt
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        console.log('Login bem-sucedido para:', email);
        res.status(200).json({ message: 'Login bem-sucedido' });
      } else {
        console.log('Senha inválida para o email:', email);
        res.status(401).json({ message: 'Credenciais inválidas' });
      }
    } else {
      console.log('Email não encontrado:', email);
      res.status(401).json({ message: 'Credenciais inválidas' });
    }
  } catch (err) {
    console.error('Erro ao realizar login:', err.message || err);
    res.status(500).json({ message: 'Erro ao realizar login. Tente novamente mais tarde.' });
  }
});

// Iniciando o servidor na porta 8000
const port = 8000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
