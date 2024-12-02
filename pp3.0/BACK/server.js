require('dotenv').config();
const express = require('express');
const sql = require('mssql');
const cors = require('cors');

const app = express();

// Configuração do CORS para permitir acesso do frontend
app.use(cors({
  origin: 'http://localhost:3000',  // Permite acesso do frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Permite os métodos GET, POST, PUT, DELETE
  allowedHeaders: ['Content-Type', 'Authorization'],  // Cabeçalhos permitidos
  preflightContinue: false,  // Se false, o Express gerencia a resposta ao preflight
  optionsSuccessStatus: 200  // Para evitar problemas com navegadores antigos
}));

// Middleware para todas as requisições de "OPTIONS" (preflight)
app.options('*', cors());  // Responde às requisições OPTIONS com os cabeçalhos de CORS

app.use(express.json());

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
  instanceName: 'SQLEXPRESS',
};

sql.connect(config)
  .then(() => console.log('Conectado ao banco de dados'))
  .catch((err) => {
    console.error('Erro de conexão com o banco de dados:', err.message || err);
    process.exit(1);
  });

app.get('/', (req, res) => {
  res.json("Servidor funcionando corretamente");
});

app.get('/register', (req, res) => {
  res.send('A rota /register está funcionando');
});

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
    console.log('Username gerado:', username);

    const pool = await sql.connect(config);
    const result = await pool.request()
      .input('username', sql.VarChar, username)
      .input('email', sql.VarChar, email)
      .input('password', sql.VarChar, password)
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

app.get('/users', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query('SELECT * FROM Users');
    
    console.log('Usuários retornados:', result.recordset);
    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Nenhum usuário encontrado' });
    }
    res.status(200).json(result.recordset);
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
      .query('UPDATE Users SET Username = @username, Email = @email, Phone = @phone WHERE UserID = @id');
    res.status(200).json({ message: 'Usuário atualizado com sucesso' });
  } catch (err) {
    console.error('Erro ao atualizar usuário:', err.message || err);
    res.status(500).json({ message: 'Erro ao atualizar usuário' });
  }
});

app.delete('/users/:id', async (req, res) => {
  const { id } = req.params;
  
  console.log('ID recebido para deletar:', id); // Adicione o log para ver o valor de "id"

  if (isNaN(id)) {
    return res.status(400).json({ message: 'ID inválido' });
  }

  try {
    const pool = await sql.connect(config);
    console.log('Conectado ao banco de dados');
    await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM Users WHERE UserID = @id');
    res.status(200).json({ message: 'Usuário deletado com sucesso' });
  } catch (err) {
    console.error('Erro ao deletar usuário:', err.message || err);
    res.status(500).json({ message: 'Erro ao deletar usuário' });
  }
});



// Rota para listar todos os itens de estoque
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
  const { Nome, Preco, QuantidadeEstoque } = req.body;

  // Validação de campos obrigatórios
  if (!Nome || !Preco || !QuantidadeEstoque) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios para atualização' });
  }

  try {
    const pool = await sql.connect(config);
    await pool.request()
      .input('id', sql.Int, id)
      .input('Nome', sql.VarChar, Nome)
      .input('Preco', sql.Float, Preco)
      .input('QuantidadeEstoque', sql.Int, QuantidadeEstoque)
      .query('UPDATE Estoque SET Nome = @Nome, Preco = @Preco, QuantidadeEstoque = @QuantidadeEstoque WHERE Id = @id');
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
      .query('DELETE FROM Estoque WHERE Id = @id');
    res.status(200).json({ message: 'Item de estoque deletado com sucesso' });
  } catch (err) {
    console.error('Erro ao deletar item de estoque:', err.message || err);
    res.status(500).json({ message: 'Erro ao deletar item de estoque' });
  }
});

app.post('/update-stock', async (req, res) => {
  const { itemsToUpdate } = req.body;

  if (!itemsToUpdate || itemsToUpdate.length === 0) {
      return res.status(400).json({ message: 'Nenhum item recebido para atualização de estoque.' });
  }

  try {
      const pool = await sql.connect(config);

      // Atualiza o estoque de cada item com base na quantidade comprada
      for (let item of itemsToUpdate) {
          const { id, quantity } = item;

          // Verifica a quantidade atual em estoque
          const result = await pool.request()
              .input('id', sql.Int, id)
              .query('SELECT QuantidadeEstoque FROM Estoque WHERE Id = @id');

          if (result.recordset.length > 0) {
              const currentStock = result.recordset[0].QuantidadeEstoque;
              const newQuantity = currentStock - quantity;

              if (newQuantity < 0) {
                  return res.status(400).json({ message: `Estoque insuficiente para o item ID ${id}.` });
              }

              // Atualiza a quantidade do item no estoque
              await pool.request()
                  .input('id', sql.Int, id)
                  .input('newQuantity', sql.Int, newQuantity)
                  .query('UPDATE Estoque SET QuantidadeEstoque = @newQuantity WHERE Id = @id');
          } else {
              return res.status(404).json({ message: `Item ID ${id} não encontrado no estoque.` });
          }
      }

      res.status(200).json({ message: 'Estoque atualizado com sucesso.' });
  } catch (err) {
      console.error('Erro ao atualizar estoque:', err.message || err);
      res.status(500).json({ message: 'Erro ao atualizar estoque.' });
  }
});









const port = 8000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
