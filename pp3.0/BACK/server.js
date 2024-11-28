require('dotenv').config();
const express = require('express');
const sql = require('mssql');
const cors = require('cors');

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
  instanceName: 'SQLEXPRESS'
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
  res.json("Servidor funcionando corretamente");
});

app.get('/register', (req, res) => {
  res.send('A rota /register está funcionando');
});



// Rota de registro de usuário
app.post('/register', async (req, res) => {
  console.log("A rota /register foi chamada!");

  const { firstName, lastName, email, password, phone } = req.body;

  console.log('Dados recebidos para registro:', req.body);

  // Validação de campos obrigatórios
  if (!firstName || !lastName || !email || !password || !phone) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
  }

  try {
    // Concatenar firstName e lastName para o username
    const username = firstName + lastName;
    console.log('Username gerado:', username); // Adicionando log para verificar o valor de username

    const pool = await sql.connect(config);
    const result = await pool.request()
      .input('username', sql.VarChar, username)
      .input('email', sql.VarChar, email)
      .input('password', sql.VarChar, password)  // Sem hash da senha
      .input('phone', sql.VarChar, phone)
      .query('USE dbSMP \n INSERT INTO Users (username, email, password, phone) VALUES (@username, @email, @password, @phone)');

    console.log('Usuário registrado com sucesso:', result);
    res.status(201).json({ message: 'Usuário registrado com sucesso' });
  } catch (err) {
    console.error('Erro ao registrar usuário:', err.message || err);
    res.status(500).json({ message: 'Erro ao registrar usuário. Verifique os dados e tente novamente.' });
  }
});

// Endpoint de login (sem verificação de senha criptografada)
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  console.log('Dados recebidos para login:', req.body);

  if (!email || !password) {
    return res.status(400).json({ message: 'Por favor, insira email e senha' });
  }

  try {
    const pool = await sql.connect(config);
    console.log('Conexão ao banco de dados bem-sucedida');

    const result = await pool.request()
      .input('email', sql.NVarChar, email)
      .query('SELECT * FROM Users WHERE email = @email');

    console.log('Resultado da consulta:', result);

    if (result.recordset.length > 0) {
      const user = result.recordset[0];
      console.log('Usuário encontrado:', user);

      if (user.Password === password) { // Verificação simples da senha sem bcrypt
        console.log('Login bem-sucedido');
        return res.status(200).json({ message: 'Login bem-sucedido', user: user });
      } else {
        return res.status(401).json({ message: 'Credenciais inválidas' });
      }
    } else {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }
  } catch (err) {
    console.error('Erro ao realizar login:', err);
    console.error('Detalhes do erro:', err.stack);
    return res.status(500).json({ message: 'Erro ao realizar login. Tente novamente mais tarde.' });
  }
});

// Rota para listar todos os usuários
app.get('/users', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query('SELECT * FROM Users');
    res.status(200).json(result.recordset); // Retorna os usuários como JSON
  } catch (err) {
    console.error('Erro ao listar usuários:', err.message || err);
    res.status(500).json({ message: 'Erro ao listar usuários' });
  }
});

// Rota para atualizar um usuário
app.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { username, email, phone } = req.body;

  if (!username || !email || !phone) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios para atualização' });
  }

  try {
    const pool = await sql.connect(config);
    await pool.request()
      .input('id', sql.Int, id)
      .input('username', sql.VarChar, username)
      .input('email', sql.VarChar, email)
      .input('phone', sql.VarChar, phone)
      .query('UPDATE Users SET username = @username, email = @email, phone = @phone WHERE id = @id');
    res.status(200).json({ message: 'Usuário atualizado com sucesso' });
  } catch (err) {
    console.error('Erro ao atualizar usuário:', err.message || err);
    res.status(500).json({ message: 'Erro ao atualizar usuário' });
  }
});

// Rota para deletar um usuário
app.delete('/users/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const pool = await sql.connect(config);
    await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM Users WHERE id = @id');
    res.status(200).json({ message: 'Usuário deletado com sucesso' });
  } catch (err) {
    console.error('Erro ao deletar usuário:', err.message || err);
    res.status(500).json({ message: 'Erro ao deletar usuário' });
  }
});

app.get('/items', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query('SELECT * FROM Estoque');
    res.status(200).json(result.recordset); // Retorna os itens do estoque como JSON
  } catch (err) {
    console.error('Erro ao listar itens de estoque:', err.message || err);
    res.status(500).json({ message: 'Erro ao listar itens de estoque' });
  }
});


// Rota para atualizar um item do estoque
app.put('/items/:id', async (req, res) => {
  const { id } = req.params;
  const { name, price, quantity } = req.body;

  // Validação de campos obrigatórios
  if (!name || !price || !quantity) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios para atualização' });
  }

  try {
    const pool = await sql.connect(config);
    await pool.request()
      .input('id', sql.Int, id)
      .input('name', sql.VarChar, name)
      .input('price', sql.Float, price)
      .input('quantity', sql.Int, quantity)
      .query('UPDATE Estoque SET name = @name, price = @price, quantity = @quantity WHERE id = @id');
    res.status(200).json({ message: 'Item do estoque atualizado com sucesso' });
  } catch (err) {
    console.error('Erro ao atualizar item de estoque:', err.message || err);
    res.status(500).json({ message: 'Erro ao atualizar item de estoque' });
  }
});

// Rota para deletar um item do estoque
app.delete('/items/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const pool = await sql.connect(config);
    await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM Estoque WHERE id = @id');
    res.status(200).json({ message: 'Item de estoque deletado com sucesso' });
  } catch (err) {
    console.error('Erro ao deletar item de estoque:', err.message || err);
    res.status(500).json({ message: 'Erro ao deletar item de estoque' });
  }
});


const port = 8000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
