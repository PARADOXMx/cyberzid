# 🔐 Guía de Seguridad - CyberZid

## Medidas de Seguridad Implementadas

### 1. Autenticación

- **JWT (JSON Web Tokens)**: Tokens seguros con expiración de 7 días
- **Bcrypt**: Hashing de contraseñas con 10 rondas
- **Sesiones**: Almacenamiento de sesiones en base de datos

```javascript
// Ejemplo de autenticación
const token = jwt.sign(
  { id: user.id, email: user.email },
  JWT_SECRET,
  { expiresIn: '7d' }
);
```

### 2. Validación de Entrada

- Validación de email y contraseña
- Sanitización de contenido de posts
- Límite de caracteres en campos de texto
- Validación de tipos de datos

```javascript
// Validación básica
if (!email || !password) {
  return res.status(400).json({ error: 'Campos requeridos' });
}
```

### 3. Control de Acceso

- **Autenticación requerida** para operaciones sensibles
- **Autorización**: Verificación de propiedad de recursos
- **Roles**: Sistema de roles (admin, user)

```javascript
// Middleware de autenticación
function authenticateToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token requerido' });
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token inválido' });
    req.user = user;
    next();
  });
}
```

### 4. CORS (Cross-Origin Resource Sharing)

- Configuración de orígenes permitidos
- Métodos HTTP restringidos
- Headers personalizados

```javascript
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(','),
  credentials: true
}));
```

### 5. Rate Limiting (Recomendado)

Para producción, implementar rate limiting:

```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // límite de 100 requests por ventana
});

app.use('/api/', limiter);
```

### 6. HTTPS

- Usar HTTPS en producción
- Certificados SSL/TLS válidos
- Redirección de HTTP a HTTPS

```javascript
// En producción
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      res.redirect(`https://${req.header('host')}${req.url}`);
    } else {
      next();
    }
  });
}
```

### 7. Protección contra Ataques

#### XSS (Cross-Site Scripting)
- Sanitización de contenido de usuario
- Content Security Policy (CSP)

```javascript
app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "default-src 'self'");
  next();
});
```

#### SQL Injection
- Uso de prepared statements (MySQL2 lo hace automáticamente)
- Validación de entrada

#### CSRF (Cross-Site Request Forgery)
- Tokens CSRF en formularios
- SameSite cookies

```javascript
// En producción
app.use(express.json({ limit: '10kb' })); // Limitar tamaño de payload
```

### 8. Logging de Seguridad

Registrar eventos de seguridad:

```javascript
// Tabla security_logs en base de datos
INSERT INTO security_logs (user_id, action, ip_address, details)
VALUES (1, 'login', '192.168.1.1', JSON_OBJECT('success', true));
```

### 9. Gestión de Secretos

- **Nunca** commitear `.env` a git
- Usar variables de entorno
- Cambiar JWT_SECRET en producción

```bash
# .gitignore
.env
.env.local
node_modules/
```

### 10. Actualización de Dependencias

Mantener dependencias actualizadas:

```bash
npm audit
npm update
npm audit fix
```

## 🚨 Checklist de Seguridad para Producción

- [ ] Cambiar JWT_SECRET a un valor seguro
- [ ] Configurar HTTPS/SSL
- [ ] Habilitar CORS solo para dominios permitidos
- [ ] Implementar rate limiting
- [ ] Configurar logging de seguridad
- [ ] Hacer backup regular de base de datos
- [ ] Implementar 2FA (autenticación de dos factores)
- [ ] Usar variables de entorno para secretos
- [ ] Auditar dependencias con `npm audit`
- [ ] Implementar WAF (Web Application Firewall)
- [ ] Configurar monitoreo y alertas
- [ ] Realizar penetration testing

## 🔑 Mejores Prácticas

### Contraseñas

- Mínimo 8 caracteres
- Incluir mayúsculas, minúsculas, números y símbolos
- No reutilizar contraseñas
- Cambiar regularmente

### Tokens

- Expiración de 7 días (ajustable)
- Refresh tokens para renovación
- Almacenar en httpOnly cookies

### Base de Datos

- Backups automáticos
- Encriptación de datos sensibles
- Acceso restringido a credenciales
- Logs de acceso

### Infraestructura

- Firewall configurado
- SSH con claves (no contraseñas)
- Actualizaciones de seguridad regulares
- Monitoreo de recursos

## 📞 Reporte de Vulnerabilidades

Si encuentras una vulnerabilidad de seguridad:

1. **NO** la publiques públicamente
2. Contacta a: security@cyberzid.com
3. Proporciona detalles técnicos
4. Espera confirmación en 48 horas

## 📚 Referencias

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Express.js Security](https://expressjs.com/en/advanced/best-practice-security.html)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

---

**Última actualización**: 2024-02-04
**Versión**: 1.0.0
