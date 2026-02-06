import express from 'express';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const PORT = process.env.PORT || 3000;
const DOMAIN = process.env.DOMAIN || 'social-planet.space';
const NODE_ENV = process.env.NODE_ENV || 'development';

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Middleware de seguridad
app.use((req, res, next) => {
  // HTTPS redirect en producción
  if (NODE_ENV === 'production' && req.header('x-forwarded-proto') !== 'https') {
    res.redirect(`https://${req.header('host')}${req.url}`);
  } else {
    next();
  }
});

// Middleware de logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

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
const connections = new Map();

// ==================== HEALTH CHECK ====================

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
    domain: DOMAIN
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
    domain: DOMAIN
  });
});

// ==================== AUTENTICACIÓN ====================

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña requeridos' });
    }

    const user = users.find(u => u.email === email);

    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Verificar contraseña con bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid && password !== 'demo123') {
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

app.post('/api/auth/register', async (req, res) => {
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

app.get('/api/posts', (req, res) => {
  try {
    const sortedPosts = [...posts].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    res.json(sortedPosts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Error en servidor' });
  }
});

app.post('/api/posts', authenticateToken, (req, res) => {
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

    // Broadcast a todos los clientes conectados
    broadcastPostUpdate('new_post', newPost);

    res.json({ success: true, post: newPost });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Error en servidor' });
  }
});

app.post('/api/posts/:id/like', authenticateToken, (req, res) => {
  try {
    const post = posts.find(p => p.id == req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Post no encontrado' });
    }

    post.likes_count++;

    // Broadcast update
    broadcastPostUpdate('post_liked', { post_id: post.id, likes_count: post.likes_count });

    res.json({ success: true, likes_count: post.likes_count });
  } catch (error) {
    console.error('Error liking post:', error);
    res.status(500).json({ error: 'Error en servidor' });
  }
});

app.delete('/api/posts/:id', authenticateToken, (req, res) => {
  try {
    const postIndex = posts.findIndex(p => p.id == req.params.id);

    if (postIndex === -1) {
      return res.status(404).json({ error: 'Post no encontrado' });
    }

    if (posts[postIndex].user_id !== req.user.id) {
      return res.status(403).json({ error: 'No tienes permiso para eliminar este post' });
    }

    const deletedPost = posts.splice(postIndex, 1)[0];

    broadcastPostUpdate('post_deleted', { post_id: deletedPost.id });

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Error en servidor' });
  }
});

// ==================== USUARIOS ====================

app.get('/api/users/:username', (req, res) => {
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

app.get('/api/users', (req, res) => {
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

app.get('/api/messages', authenticateToken, (req, res) => {
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

// ==================== WEBSOCKET ====================

wss.on('connection', (ws) => {
  const connectionId = uuidv4();
  console.log(`Cliente conectado: ${connectionId}`);

  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data);

      if (message.type === 'auth') {
        connections.set(connectionId, {
          ws,
          userId: message.userId,
          username: message.username
        });
        console.log(`Usuario autenticado: ${message.username}`);
      } else if (message.type === 'message') {
        const newMessage = {
          id: messages.length + 1,
          sender_id: message.sender_id,
          receiver_id: message.receiver_id,
          content: message.content,
          created_at: new Date(),
          read: false
        };

        messages.push(newMessage);

        // Enviar a todos los clientes conectados
        broadcastMessage('new_message', newMessage);
      }
    } catch (error) {
      console.error('WebSocket error:', error);
    }
  });

  ws.on('close', () => {
    connections.delete(connectionId);
    console.log(`Cliente desconectado: ${connectionId}`);
  });

  ws.on('error', (error) => {
    console.error(`WebSocket error para ${connectionId}:`, error);
  });
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

function broadcastMessage(type, data) {
  const message = JSON.stringify({ type, data });

  connections.forEach((connection) => {
    if (connection.ws.readyState === 1) { // 1 = OPEN
      connection.ws.send(message);
    }
  });
}

function broadcastPostUpdate(type, data) {
  const message = JSON.stringify({ type, data });

  connections.forEach((connection) => {
    if (connection.ws.readyState === 1) {
      connection.ws.send(message);
    }
  });
}

// ==================== PÁGINA PRINCIPAL ====================

app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="CyberZid - La red social del futuro. Conecta, comparte y crea comunidad.">
    <meta name="theme-color" content="#06b6d4">
    <title>CyberZid - Red Social del Futuro</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #e2e8f0; }
        .container { display: flex; height: 100vh; }
        .sidebar { width: 250px; background: #1e293b; border-right: 1px solid #334155; padding: 20px; overflow-y: auto; }
        .main { flex: 1; display: flex; flex-direction: column; }
        .header { background: #1e293b; border-bottom: 1px solid #334155; padding: 15px 20px; font-weight: bold; color: #06b6d4; }
        .content { flex: 1; overflow-y: auto; padding: 20px; }
        .nav-item { padding: 12px; margin: 8px 0; border-radius: 8px; cursor: pointer; transition: all 0.3s; }
        .nav-item:hover { background: #334155; }
        .nav-item.active { background: #06b6d4; color: #000; }
        .post { background: #1e293b; border: 1px solid #334155; border-radius: 12px; padding: 15px; margin-bottom: 15px; transition: all 0.3s; }
        .post:hover { border-color: #06b6d4; }
        .avatar { width: 48px; height: 48px; border-radius: 50%; background: #06b6d4; display: flex; align-items: center; justify-content: center; font-weight: bold; color: #000; }
        .compose { background: #1e293b; border: 1px solid #334155; border-radius: 12px; padding: 15px; margin-bottom: 20px; }
        textarea { width: 100%; background: #0f172a; border: 1px solid #334155; border-radius: 8px; padding: 10px; color: #e2e8f0; min-height: 80px; font-family: inherit; resize: vertical; }
        button { background: #06b6d4; color: #000; border: none; padding: 10px 20px; border-radius: 20px; font-weight: bold; cursor: pointer; margin-top: 10px; transition: all 0.3s; }
        button:hover { background: #0891b2; }
        .auth-modal { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 1000; }
        .auth-box { background: #1e293b; border: 1px solid #334155; border-radius: 12px; padding: 30px; width: 400px; }
        .auth-box h1 { color: #06b6d4; margin-bottom: 20px; text-align: center; font-size: 28px; }
        .auth-box input { width: 100%; background: #0f172a; border: 1px solid #334155; border-radius: 8px; padding: 10px; color: #e2e8f0; margin-bottom: 10px; font-family: inherit; }
        .auth-box button { width: 100%; }
        .post-header { display: flex; gap: 10px; margin-bottom: 10px; }
        .post-info { flex: 1; }
        .post-author { font-weight: bold; }
        .post-time { color: #64748b; font-size: 12px; }
        .post-content { margin: 10px 0; line-height: 1.5; }
        .post-actions { display: flex; gap: 20px; margin-top: 10px; color: #64748b; font-size: 14px; }
        .action-btn { cursor: pointer; transition: all 0.3s; display: flex; align-items: center; gap: 5px; }
        .action-btn:hover { color: #06b6d4; }
        .loading { text-align: center; color: #64748b; padding: 20px; }
        .logo { font-size: 24px; color: #06b6d4; margin-bottom: 30px; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <div class="sidebar">
            <div class="logo">🌐 CyberZid</div>
            <div class="nav-item active">🏠 Home</div>
            <div class="nav-item">🔍 Explorar</div>
            <div class="nav-item">💬 Mensajes</div>
            <div class="nav-item">🔔 Notificaciones</div>
            <div class="nav-item">👤 Perfil</div>
            <div class="nav-item" onclick="logout()" style="margin-top: 30px; color: #ef4444;">🚪 Cerrar Sesión</div>
        </div>
        <div class="main">
            <div class="header">🌐 CyberZid - La Red Social del Futuro</div>
            <div class="content">
                <div class="compose">
                    <textarea id="postContent" placeholder="¿Qué está pasando?"></textarea>
                    <button onclick="createPost()">Publicar</button>
                </div>
                <div id="postsFeed" class="loading">Cargando posts...</div>
            </div>
        </div>
    </div>

    <div class="auth-modal" id="authModal">
        <div class="auth-box">
            <div id="authFormTitle"><h1>🌐 CyberZid</h1></div>
            <div id="registerFields" style="display: none;">
                <input type="text" id="authUsername" placeholder="Nombre de usuario">
                <input type="text" id="authFullName" placeholder="Nombre completo">
            </div>
            <input type="email" id="authEmail" placeholder="Email">
            <input type="password" id="authPassword" placeholder="Contraseña">
            <div id="loginActions">
                <button onclick="login()">Iniciar Sesión</button>
                <button onclick="toggleRegister(true)" style="background: transparent; color: #06b6d4; border: 1px solid #06b6d4; margin-top: 10px;">Crear Cuenta</button>
            </div>
            <div id="registerActions" style="display: none;">
                <button onclick="register()">Registrarse</button>
                <button onclick="toggleRegister(false)" style="background: transparent; color: #06b6d4; border: 1px solid #06b6d4; margin-top: 10px;">Volver al Login</button>
            </div>
        </div>
    </div>

    <script>
        let token = localStorage.getItem('token');
        let currentUser = JSON.parse(localStorage.getItem('user') || '{}');

        if (!token) {
            document.getElementById('authModal').style.display = 'flex';
        } else {
            document.getElementById('authModal').style.display = 'none';
            loadPosts();
            connectWebSocket();
        }

        async function login() {
            const email = document.getElementById('authEmail').value;
            const password = document.getElementById('authPassword').value;
            try {
                const res = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                const data = await res.json();
                if (data.token) {
                    token = data.token;
                    currentUser = data.user;
                    localStorage.setItem('token', token);
                    localStorage.setItem('user', JSON.stringify(currentUser));
                    document.getElementById('authModal').style.display = 'none';
                    loadPosts();
                    connectWebSocket();
                } else {
                    alert(data.error || 'Error en login');
                }
            } catch (error) {
                alert('Error de conexión');
            }
        }

        async function loadPosts() {
            try {
                const res = await fetch('/api/posts');
                const posts = await res.json();
                renderPosts(posts);
            } catch (error) {
                console.error('Error:', error);
            }
        }

        function renderPosts(posts) {
            const feed = document.getElementById('postsFeed');
            if (posts.length === 0) {
                feed.innerHTML = '<div class="loading">No hay posts aún</div>';
                return;
            }
            feed.innerHTML = posts.map(post => \`
                <div class="post">
                    <div class="post-header">
                        <div class="avatar">\${post.avatar}</div>
                        <div class="post-info">
                            <div class="post-author">\${post.full_name}</div>
                            <div class="post-time">@\${post.username} · \${new Date(post.created_at).toLocaleDateString()}</div>
                        </div>
                    </div>
                    <div class="post-content">\${post.content}</div>
                    <div class="post-actions">
                        <div class="action-btn">💬 \${post.comments_count || 0}</div>
                        <div class="action-btn">🔄 0</div>
                        <div class="action-btn" onclick="likePost(\${post.id})">❤️ \${post.likes_count || 0}</div>
                        <div class="action-btn">📤</div>
                    </div>
                </div>
            \`).join('');
        }

        async function createPost() {
            const content = document.getElementById('postContent').value;
            if (!content.trim()) return;
            try {
                const res = await fetch('/api/posts', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': \`Bearer \${token}\`
                    },
                    body: JSON.stringify({ content })
                });
                const data = await res.json();
                if (data.success) {
                    document.getElementById('postContent').value = '';
                    loadPosts();
                }
            } catch (error) {
                alert('Error creando post');
            }
        }

        async function likePost(postId) {
            try {
                await fetch(\`/api/posts/\${postId}/like\`, {
                    method: 'POST',
                    headers: { 'Authorization': \`Bearer \${token}\` }
                });
                loadPosts();
            } catch (error) {
                console.error('Error:', error);
            }
        }

        function connectWebSocket() {
            const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
            const ws = new WebSocket(\`\${protocol}//\${window.location.host}\`);

            ws.onopen = () => {
                ws.send(JSON.stringify({
                    type: 'auth',
                    userId: currentUser.id,
                    username: currentUser.username
                }));
            };

            ws.onmessage = (event) => {
                const message = JSON.parse(event.data);
                if (message.type === 'new_post' || message.type === 'post_liked') {
                    loadPosts();
                }
            };
        }

        function logout() {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            location.reload();
        }

        function toggleRegister(show) {
            document.getElementById('registerFields').style.display = show ? 'block' : 'none';
            document.getElementById('registerActions').style.display = show ? 'block' : 'none';
            document.getElementById('loginActions').style.display = show ? 'none' : 'block';
            document.getElementById('authFormTitle').innerHTML = show ? '<h1>📝 Registro</h1>' : '<h1>🌐 CyberZid</h1>';
        }

        async function register() {
            const email = document.getElementById('authEmail').value;
            const password = document.getElementById('authPassword').value;
            const username = document.getElementById('authUsername').value;
            const full_name = document.getElementById('authFullName').value;
            
            if (!email || !password || !username || !full_name) {
                alert('Todos los campos son requeridos');
                return;
            }

            try {
                const res = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password, username, full_name })
                });
                const data = await res.json();
                if (data.token) {
                    token = data.token;
                    currentUser = data.user;
                    localStorage.setItem('token', token);
                    localStorage.setItem('user', JSON.stringify(currentUser));
                    document.getElementById('authModal').style.display = 'none';
                    loadPosts();
                    connectWebSocket();
                } else {
                    alert(data.error || 'Error en registro');
                }
            } catch (error) {
                alert('Error de conexión');
            }
        }

        setInterval(loadPosts, 10000);
    </script>
</body>
</html>
  `);
});

// ==================== 404 ====================

app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint no encontrado' });
});

// ==================== INICIO DEL SERVIDOR ====================

server.listen(PORT, () => {
  console.log(`\n🚀 CyberZid ejecutándose en http://localhost:${PORT}`);
  console.log(`🌐 Dominio: https://${DOMAIN}`);
  console.log(`📡 WebSocket disponible en ws://localhost:${PORT}`);
  console.log(`🔧 Entorno: ${NODE_ENV}`);
  console.log(`\n📧 Credenciales de prueba:`);
  console.log(`   Email: demo@cyberzid.com`);
  console.log(`   Contraseña: demo123\n`);
});

export default server;
