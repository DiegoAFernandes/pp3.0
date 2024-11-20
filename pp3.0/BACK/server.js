require('dotenv').config();
const express = require('express');
const sql = require('mssql');
const cors = require('cors');
const bcrypt = require('bcryptjs');

// Criando o servidor Express
const app = express();

// Habilitando CORS
app.use(
  cors({
    origin: 'http://localhost:3000', // URL do seu frontend
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
  })
);

// Parse de JSON no corpo da requisição
app.use(express.json());

// Configuração do banco de dados
const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

// Conexão com o banco de dados
sql.connect(config)
  .then(() => console.log('Conectado ao banco de dados'))
  .catch((err) => {
    console.error('Erro de conexão com o banco de dados:', err.message || err);
    process.exit(1); // Se a conexão falhar, o servidor é encerrado
  });

// Rota de teste para verificar se o servidor está funcionando
app.get('/', (req, res) => {
  res.json('Servidor funcionando corretamente');
});

// Endpoint de login (com verificação de senha criptografada)
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  console.log('Dados recebidos para login:', req.body);

  // Validação de campos obrigatórios
  if (!email || !password) {
    return res.status(400).json({ message: 'Por favor, insira email e senha' });
  }

  try {
    // Consultar o banco de dados para verificar o usuário
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .input('email', sql.VarChar, email)
      .query('SELECT * FROM Users WHERE email = @email');

    if (result.recordset.length > 0) {
      const user = result.recordset[0];

      // Verificar a senha com bcrypt
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        console.log('Login bem-sucedido para:', email);

        // Retornar os dados do usuário junto com a mensagem
        const userResponse = {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
        };

        return res.status(200).json({ message: 'Login bem-sucedido', user: userResponse });
      } else {
        console.log('Senha inválida para o email:', email);
        return res.status(401).json({ message: 'Credenciais inválidas' });
      }
    } else {
      console.log('Email não encontrado:', email);
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }
  } catch (err) {
    console.error('Erro ao realizar login:', err.message || err);
    return res.status(500).json({ message: 'Erro ao realizar login. Tente novamente mais tarde.' });
  }
});

// Iniciando o servidor na porta 8000
const port = 8000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
