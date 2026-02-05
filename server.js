import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const app = express();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const DOMAIN = process.env.DOMAIN || 'social-planet.space';

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Datos en memoria (en producción usar base de datos)
const users = [
  {
    id: 1,
    username: 'demo',
    email: 'demo@cyberzid.com',
    password_hash: '$2a$10$demohashedpassword',
    full_name: 'Demo User',
    avatar: 'D',
    bio: 'Bienvenido a CyberZid - La red social del futuro',
    created_at: new Date()
  }
];

const posts = [
  {
    id: 1,
    user_id: 1,
    content: '🚀 ¡Bienvenido a CyberZid! La red social del futuro está aquí. Conecta, comparte y crea comunidad.',
    likes_count: 42,
    comments_count: 5,
    created_at: new Date('2024-02-01'),
    username: 'demo',
    full_name: 'Demo User',
    avatar: 'D'
  },
  {
    id: 2,
    user_id: 1,
    content: '💡 Conecta con amigos, comparte ideas y crea comunidad. Todo en tiempo real.',
    likes_count: 28,
    comments_count: 3,
    created_at: new Date('2024-02-02'),
    username: 'demo',
    full_name: 'Demo User',
    avatar: 'D'
  }
];

const messages = [];

// ==================== HEALTH CHECK ====================

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    domain: DOMAIN,
    platform: 'netlify'
  });
});

// ==================== AUTENTICACIÓN ====================

app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña requeridos' });
    }

    const user = users.find(u => u.email === email);

    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    if (password !== 'demo123') {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        avatar: user.avatar,
        bio: user.bio
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Error en servidor' });
  }
});

app.post('/auth/register', async (req, res) => {
  try {
    const { email, password, username, full_name } = req.body;

    if (!email || !password || !username || !full_name) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    if (users.find(u => u.email === email || u.username === username)) {
      return res.status(400).json({ error: 'Usuario o email ya existe' });
    }

    const newUser = {
      id: users.length + 1,
      username,
      email,
      password_hash: await bcrypt.hash(password, 10),
      full_name,
      avatar: username.charAt(0).toUpperCase(),
      bio: '',
      created_at: new Date()
    };

    users.push(newUser);

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        full_name: newUser.full_name,
        avatar: newUser.avatar
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Error en servidor' });
  }
});

// ==================== POSTS ====================

app.get('/posts', (req, res) => {
  try {
    const sortedPosts = [...posts].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    res.json(sortedPosts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Error en servidor' });
  }
});

app.post('/posts', authenticateToken, (req, res) => {
  try {
    const { content } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: 'El contenido no puede estar vacío' });
    }

    const user = users.find(u => u.id === req.user.id);

    const newPost = {
      id: posts.length + 1,
      user_id: req.user.id,
      content: content.trim(),
      likes_count: 0,
      comments_count: 0,
      created_at: new Date(),
      username: user.username,
      full_name: user.full_name,
      avatar: user.avatar
    };

    posts.unshift(newPost);

    res.json({ success: true, post: newPost });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Error en servidor' });
  }
});

app.post('/posts/:id/like', authenticateToken, (req, res) => {
  try {
    const post = posts.find(p => p.id == req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Post no encontrado' });
    }

    post.likes_count++;

    res.json({ success: true, likes_count: post.likes_count });
  } catch (error) {
    console.error('Error liking post:', error);
    res.status(500).json({ error: 'Error en servidor' });
  }
});

app.delete('/posts/:id', authenticateToken, (req, res) => {
  try {
    const postIndex = posts.findIndex(p => p.id == req.params.id);

    if (postIndex === -1) {
      return res.status(404).json({ error: 'Post no encontrado' });
    }

    if (posts[postIndex].user_id !== req.user.id) {
      return res.status(403).json({ error: 'No tienes permiso para eliminar este post' });
    }

    posts.splice(postIndex, 1);

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Error en servidor' });
  }
});

// ==================== USUARIOS ====================

app.get('/users/:username', (req, res) => {
  try {
    const user = users.find(u => u.username === req.params.username);

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const userPosts = posts.filter(p => p.user_id === user.id);

    res.json({
      id: user.id,
      username: user.username,
      full_name: user.full_name,
      avatar: user.avatar,
      bio: user.bio,
      created_at: user.created_at,
      posts_count: userPosts.length
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Error en servidor' });
  }
});

app.get('/users', (req, res) => {
  try {
    const allUsers = users.map(u => ({
      id: u.id,
      username: u.username,
      full_name: u.full_name,
      avatar: u.avatar,
      bio: u.bio
    }));

    res.json(allUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Error en servidor' });
  }
});

// ==================== MENSAJES ====================

app.get('/messages', authenticateToken, (req, res) => {
  try {
    const userMessages = messages.filter(
      m => m.sender_id === req.user.id || m.receiver_id === req.user.id
    );

    res.json(userMessages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Error en servidor' });
  }
});

// ==================== FUNCIONES AUXILIARES ====================

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token requerido' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido' });
    }

    req.user = user;
    next();
  });
}

// ==================== 404 ====================

app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint no encontrado' });
});

// Exportar para Netlify Functions
export default app;
