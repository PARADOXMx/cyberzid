# 📡 API Endpoints - CyberZid

Documentación completa de todos los endpoints de la API REST de CyberZid.

## 🔐 Autenticación

### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Respuesta (200)**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "username",
    "email": "user@example.com",
    "full_name": "Full Name",
    "avatar": "F",
    "bio": "User bio"
  }
}
```

**Errores**
- `400`: Email y contraseña requeridos
- `401`: Credenciales inválidas

### Registro

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "password123",
  "username": "newuser",
  "full_name": "New User"
}
```

**Respuesta (200)**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 2,
    "username": "newuser",
    "email": "newuser@example.com",
    "full_name": "New User",
    "avatar": "N"
  }
}
```

**Errores**
- `400`: Campos requeridos o usuario ya existe
- `500`: Error en servidor

---

## 📝 Posts

### Obtener todos los posts

```http
GET /api/posts
```

**Respuesta (200)**
```json
[
  {
    "id": 1,
    "user_id": 1,
    "content": "Contenido del post",
    "likes_count": 42,
    "comments_count": 5,
    "created_at": "2024-02-01T10:00:00Z",
    "username": "username",
    "full_name": "Full Name",
    "avatar": "F"
  }
]
```

### Crear post

```http
POST /api/posts
Authorization: Bearer {token}
Content-Type: application/json

{
  "content": "Mi nuevo post en CyberZid"
}
```

**Respuesta (200)**
```json
{
  "success": true,
  "post": {
    "id": 3,
    "user_id": 1,
    "content": "Mi nuevo post en CyberZid",
    "likes_count": 0,
    "comments_count": 0,
    "created_at": "2024-02-04T15:30:00Z",
    "username": "username",
    "full_name": "Full Name",
    "avatar": "F"
  }
}
```

**Errores**
- `400`: Contenido no puede estar vacío
- `401`: Token requerido
- `403`: Token inválido

### Like a un post

```http
POST /api/posts/{id}/like
Authorization: Bearer {token}
```

**Respuesta (200)**
```json
{
  "success": true,
  "likes_count": 43
}
```

**Errores**
- `404`: Post no encontrado
- `401`: Token requerido

### Eliminar post

```http
DELETE /api/posts/{id}
Authorization: Bearer {token}
```

**Respuesta (200)**
```json
{
  "success": true
}
```

**Errores**
- `404`: Post no encontrado
- `403`: No tienes permiso para eliminar este post
- `401`: Token requerido

---

## 👥 Usuarios

### Obtener todos los usuarios

```http
GET /api/users
```

**Respuesta (200)**
```json
[
  {
    "id": 1,
    "username": "username",
    "full_name": "Full Name",
    "avatar": "F",
    "bio": "User bio"
  },
  {
    "id": 2,
    "username": "anotheruser",
    "full_name": "Another User",
    "avatar": "A",
    "bio": ""
  }
]
```

### Obtener perfil de usuario

```http
GET /api/users/{username}
```

**Respuesta (200)**
```json
{
  "id": 1,
  "username": "username",
  "full_name": "Full Name",
  "avatar": "F",
  "bio": "User bio",
  "created_at": "2024-01-15T08:00:00Z",
  "posts_count": 12
}
```

**Errores**
- `404`: Usuario no encontrado

---

## 💬 Mensajes

### Obtener mensajes

```http
GET /api/messages
Authorization: Bearer {token}
```

**Respuesta (200)**
```json
[
  {
    "id": 1,
    "sender_id": 1,
    "receiver_id": 2,
    "content": "Hola, ¿cómo estás?",
    "created_at": "2024-02-04T14:20:00Z",
    "read": false
  },
  {
    "id": 2,
    "sender_id": 2,
    "receiver_id": 1,
    "content": "¡Bien, gracias!",
    "created_at": "2024-02-04T14:25:00Z",
    "read": true
  }
]
```

**Errores**
- `401`: Token requerido

---

## 🔄 WebSocket

### Conexión WebSocket

```javascript
const ws = new WebSocket('ws://localhost:3000');

// Autenticación
ws.send(JSON.stringify({
  type: 'auth',
  userId: 1,
  username: 'username'
}));

// Escuchar mensajes
ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  console.log(message);
};
```

### Eventos WebSocket

#### Autenticación

```json
{
  "type": "auth",
  "userId": 1,
  "username": "username"
}
```

#### Enviar Mensaje

```json
{
  "type": "message",
  "sender_id": 1,
  "receiver_id": 2,
  "content": "Hola!"
}
```

#### Nuevo Post (Recibido)

```json
{
  "type": "new_post",
  "data": {
    "id": 3,
    "user_id": 1,
    "content": "Nuevo post",
    "likes_count": 0,
    "comments_count": 0,
    "created_at": "2024-02-04T15:30:00Z",
    "username": "username",
    "full_name": "Full Name",
    "avatar": "F"
  }
}
```

#### Post Liked (Recibido)

```json
{
  "type": "post_liked",
  "data": {
    "post_id": 1,
    "likes_count": 43
  }
}
```

#### Post Deleted (Recibido)

```json
{
  "type": "post_deleted",
  "data": {
    "post_id": 1
  }
}
```

#### Nuevo Mensaje (Recibido)

```json
{
  "type": "new_message",
  "data": {
    "id": 1,
    "sender_id": 1,
    "receiver_id": 2,
    "content": "Hola!",
    "created_at": "2024-02-04T14:20:00Z",
    "read": false
  }
}
```

---

## 📊 Códigos de Estado HTTP

| Código | Significado |
|--------|------------|
| `200` | OK - Solicitud exitosa |
| `201` | Created - Recurso creado |
| `400` | Bad Request - Solicitud inválida |
| `401` | Unauthorized - Autenticación requerida |
| `403` | Forbidden - Acceso denegado |
| `404` | Not Found - Recurso no encontrado |
| `500` | Internal Server Error - Error del servidor |

---

## 🔑 Autenticación con Token

Todos los endpoints protegidos requieren un token JWT en el header:

```http
Authorization: Bearer {token}
```

Ejemplo:

```bash
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
     http://localhost:3000/api/posts
```

---

## 📝 Ejemplos de Uso

### JavaScript/Fetch

```javascript
// Login
const loginResponse = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});

const { token } = await loginResponse.json();

// Crear post
const postResponse = await fetch('/api/posts', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    content: 'Mi nuevo post'
  })
});

const { post } = await postResponse.json();
```

### cURL

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Obtener posts
curl http://localhost:3000/api/posts

# Crear post
curl -X POST http://localhost:3000/api/posts \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"content":"Mi nuevo post"}'
```

### Python

```python
import requests

# Login
response = requests.post('http://localhost:3000/api/auth/login', json={
    'email': 'user@example.com',
    'password': 'password123'
})
token = response.json()['token']

# Crear post
headers = {'Authorization': f'Bearer {token}'}
response = requests.post('http://localhost:3000/api/posts',
    headers=headers,
    json={'content': 'Mi nuevo post'}
)
```

---

## 🚀 Rate Limiting (Recomendado)

Para producción, implementar rate limiting:

- 100 requests por 15 minutos por IP
- 1000 requests por hora por usuario autenticado

---

**Última actualización**: 2024-02-04
**Versión API**: 1.0.0
