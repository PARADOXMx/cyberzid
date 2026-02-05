# CyberZid - Red Social Moderna

Una red social moderna con características de tiempo real, autenticación segura y una interfaz intuitiva.

## 🚀 Características

- **Autenticación JWT**: Login seguro con tokens JWT
- **Posts en Tiempo Real**: Crea y comparte posts instantáneamente
- **Mensajería**: Chat en tiempo real con WebSocket
- **Sistema de Likes**: Interactúa con posts
- **Perfiles de Usuario**: Visualiza información de usuarios
- **Notificaciones**: Recibe actualizaciones en tiempo real
- **Tema Oscuro**: Interfaz moderna con tema cyberpunk

## 📋 Requisitos

- Node.js 16+ 
- MySQL 8.0+
- npm o yarn

## 🔧 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/cyberzid.git
cd cyberzid
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar base de datos

```bash
# Crear base de datos
mysql -u root -p < database/schema.sql

# O crear manualmente
mysql -u root -p
CREATE DATABASE cyberzid;
USE cyberzid;
SOURCE database/schema.sql;
```

### 4. Configurar variables de entorno

```bash
cp .env.example .env
```

Edita `.env` con tus configuraciones:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_NAME=cyberzid
JWT_SECRET=tu-clave-secreta-super-segura
```

### 5. Iniciar el servidor

```bash
npm run dev
```

El servidor estará disponible en `http://localhost:3000`

## 📱 Uso

### Credenciales de Prueba

```
Email: demo@cyberzid.com
Contraseña: demo123
```

### Endpoints API

#### Autenticación

```bash
# Login
POST /api/auth/login
Content-Type: application/json

{
  "email": "demo@cyberzid.com",
  "password": "demo123"
}

# Respuesta
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "username": "demo",
    "email": "demo@cyberzid.com",
    "full_name": "Demo User"
  }
}
```

#### Posts

```bash
# Obtener todos los posts
GET /api/posts

# Crear post
POST /api/posts
Authorization: Bearer {token}
Content-Type: application/json

{
  "content": "Hola CyberZid!"
}

# Like a post
POST /api/posts/{id}/like
Authorization: Bearer {token}

# Eliminar post
DELETE /api/posts/{id}
Authorization: Bearer {token}
```

#### Usuarios

```bash
# Obtener todos los usuarios
GET /api/users

# Obtener perfil de usuario
GET /api/users/{username}
```

#### Mensajes

```bash
# Obtener mensajes del usuario
GET /api/messages
Authorization: Bearer {token}
```

## 🏗️ Estructura del Proyecto

```
cyberzid/
├── server/
│   └── index.js              # Servidor Express + WebSocket
├── database/
│   └── schema.sql            # Esquema de base de datos
├── client/                   # (Opcional) Frontend React
├── package.json              # Dependencias
├── .env.example              # Configuración de ejemplo
└── README.md                 # Este archivo
```

## 🔐 Seguridad

- **JWT Authentication**: Tokens seguros con expiración
- **Password Hashing**: Contraseñas hasheadas con bcrypt
- **CORS**: Control de origen cruzado
- **Input Validation**: Validación de entrada en todos los endpoints
- **SQL Injection Protection**: Uso de prepared statements

## 🗄️ Base de Datos

### Tablas Principales

- **users**: Información de usuarios
- **posts**: Posts de usuarios
- **comments**: Comentarios en posts
- **likes**: Sistema de likes
- **messages**: Mensajería privada
- **followers**: Sistema de seguimiento
- **notifications**: Notificaciones
- **trending_topics**: Temas trending
- **user_sessions**: Sesiones de usuario
- **security_logs**: Logs de seguridad

## 🔄 WebSocket

El servidor WebSocket está integrado en el mismo puerto que Express (3000).

### Eventos WebSocket

```javascript
// Autenticación
ws.send(JSON.stringify({
  type: 'auth',
  userId: 1,
  username: 'demo'
}));

// Enviar mensaje
ws.send(JSON.stringify({
  type: 'message',
  sender_id: 1,
  receiver_id: 2,
  content: 'Hola!'
}));

// Eventos recibidos
ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  if (message.type === 'new_post') {
    // Nuevo post recibido
  }
};
```

## 🚀 Deployment

### Heroku

```bash
# Crear app
heroku create cyberzid

# Configurar variables de entorno
heroku config:set JWT_SECRET=tu-clave-secreta
heroku config:set DATABASE_URL=mysql://...

# Deploy
git push heroku main
```

### Railway

```bash
# Login
railway login

# Link proyecto
railway link

# Deploy
railway up
```

### Docker

```bash
# Construir imagen
docker build -t cyberzid .

# Ejecutar contenedor
docker run -p 3000:3000 -e DATABASE_URL=mysql://... cyberzid
```

## 🐛 Troubleshooting

### Error: "Cannot find module 'express'"

```bash
npm install
```

### Error: "Connection refused" (Base de datos)

Verifica que MySQL esté ejecutándose:

```bash
# macOS
brew services start mysql

# Linux
sudo systemctl start mysql

# Windows
net start MySQL80
```

### Error: "CORS policy"

Actualiza `CORS_ORIGIN` en `.env` con tu dominio.

## 📚 Documentación Adicional

- [Express.js](https://expressjs.com/)
- [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- [JWT](https://jwt.io/)
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js)

## 📝 Licencia

MIT License - Siéntete libre de usar este proyecto

## 👥 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📧 Contacto

Para preguntas o sugerencias, contacta a través de:
- Email: info@cyberzid.com
- Twitter: @cyberzid
- Discord: [Servidor CyberZid]

---

**Hecho con ❤️ por el equipo de CyberZid**
