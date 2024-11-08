require('dotenv').config();
const express = require('express');
const sql = require('mssql');
const cors = require('cors');

// Criando o servidor Express
const app = express();

// Habilitando CORS
app.use(cors());

// Parse de JSON no corpo da requisição
app.use(express.json());

// Verifique se as variáveis de ambiente estão sendo carregadas corretamente
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_SERVER:', process.env.DB_SERVER);
console.log('DB_DATABASE:', process.env.DB_DATABASE);

// Configuração do banco de dados
const config = {
  user: process.env.DB_USER, // Vai pegar a variável do .env
  password: process.env.DB_PASSWORD, // Vai pegar a variável do .env
  server: process.env.DB_SERVER, // Vai pegar a variável do .env
  database: process.env.DB_DATABASE, // Vai pegar a variável do .env
  options: {
    encrypt: true, // Necessário se você estiver usando SSL (para produção, normalmente)
    trustServerCertificate: true, // Para desenvolvimento local sem SSL
  }
};

// Conexão com o banco de dados
sql.connect(config)
  .then(() => console.log('Conectado ao banco de dados'))
  .catch(err => {
    console.error('Erro de conexão:', err);
    process.exit(1);  // Se a conexão falhar, o servidor é encerrado
  });

// Rota de teste para verificar se o servidor está funcionando
app.get('/', (req, res) => {
  res.send('Servidor funcionando corretamente');
});

// Endpoint de registro
app.post('/register', async (req, res) => {
  const { username, password, email, phone } = req.body;

  // Logando os dados recebidos
  console.log('Dados recebidos para registro:', req.body);  // Log de requisição

  if (!username || !password || !email || !phone) {
    return res.status(400).send('Todos os campos são obrigatórios');
  }

  try {
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input('username', sql.VarChar, username)
      .input('password', sql.VarChar, password)
      .input('email', sql.VarChar, email)
      .input('phone', sql.VarChar, phone)
      .query('INSERT INTO Users (username, password, email, phone) VALUES (@username, @password, @email, @phone)');

    res.status(201).send('Usuário registrado com sucesso');
  } catch (err) {
    console.error('Erro ao registrar usuário:', err);
    res.status(500).send('Erro ao registrar usuário. Verifique os dados e tente novamente.');
  }
});

// Endpoint de login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send('Por favor, insira nome de usuário e senha');
  }

  try {
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input('username', sql.VarChar, username)
      .input('password', sql.VarChar, password)
      .query('SELECT * FROM Users WHERE username = @username AND password = @password');

    if (result.recordset.length > 0) {
      res.status(200).send('Login bem-sucedido');
    } else {
      res.status(401).send('Credenciais inválidas');
    }
  } catch (err) {
    console.error('Erro ao realizar login:', err);
    res.status(500).send('Erro ao realizar login. Tente novamente mais tarde.');
  }
});

// Iniciando o servidor na porta 5000
const port = 8000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
