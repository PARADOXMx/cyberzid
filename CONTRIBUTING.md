# 🤝 Guía de Contribución - CyberZid

¡Gracias por tu interés en contribuir a CyberZid! Este documento proporciona pautas y procedimientos para contribuir.

## 📋 Código de Conducta

Todos los contribuyentes deben seguir nuestro código de conducta:

- Sé respetuoso con otros contribuyentes
- Acepta críticas constructivas
- Enfócate en lo mejor para la comunidad
- Reporta comportamiento inapropiado

## 🚀 Cómo Contribuir

### 1. Reportar Bugs

Si encuentras un bug:

1. Verifica que no haya sido reportado
2. Crea un issue con:
   - Descripción clara del problema
   - Pasos para reproducir
   - Comportamiento esperado
   - Comportamiento actual
   - Información del sistema

```markdown
## Descripción
[Descripción clara del bug]

## Pasos para Reproducir
1. [Primer paso]
2. [Segundo paso]
3. [...]

## Comportamiento Esperado
[Qué debería suceder]

## Comportamiento Actual
[Qué sucede actualmente]

## Sistema
- OS: [ej: Ubuntu 22.04]
- Node: [ej: 18.0.0]
- npm: [ej: 8.0.0]
```

### 2. Sugerir Mejoras

Para sugerir una mejora:

1. Usa el título descriptivo
2. Proporciona descripción detallada
3. Explica el caso de uso
4. Lista ejemplos si es posible

```markdown
## Descripción de la Mejora
[Descripción clara]

## Motivación
[Por qué es necesaria]

## Solución Propuesta
[Cómo implementarla]

## Alternativas
[Otras opciones consideradas]
```

### 3. Pull Requests

#### Preparación

```bash
# 1. Fork el repositorio
git clone https://github.com/tu-usuario/cyberzid.git
cd cyberzid

# 2. Crear rama de feature
git checkout -b feature/nombre-descriptivo

# 3. Instalar dependencias
npm install

# 4. Crear cambios
# ... edita archivos ...

# 5. Commit con mensajes claros
git commit -m "feat: descripción clara del cambio"

# 6. Push a tu fork
git push origin feature/nombre-descriptivo

# 7. Crear Pull Request en GitHub
```

#### Estándares de Commit

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

```
<tipo>(<scope>): <descripción>

<cuerpo>

<pie>
```

Tipos:
- `feat`: Nueva característica
- `fix`: Corrección de bug
- `docs`: Cambios en documentación
- `style`: Cambios de formato (sin lógica)
- `refactor`: Refactorización de código
- `perf`: Mejora de rendimiento
- `test`: Agregar o actualizar tests
- `chore`: Cambios en build, deps, etc.

Ejemplos:

```bash
git commit -m "feat(auth): agregar autenticación de dos factores"
git commit -m "fix(posts): corregir error al crear posts"
git commit -m "docs: actualizar README con instrucciones"
```

#### Checklist de PR

Antes de enviar un PR, verifica:

- [ ] El código sigue los estándares del proyecto
- [ ] He actualizado la documentación
- [ ] He agregado tests si es necesario
- [ ] Los tests pasan: `npm test`
- [ ] No hay errores de linting: `npm run lint`
- [ ] El commit message es claro

## 📝 Estándares de Código

### JavaScript/Node.js

```javascript
// ✅ Bueno
function getUserById(userId) {
  if (!userId) {
    throw new Error('User ID is required');
  }
  return users.find(u => u.id === userId);
}

// ❌ Malo
function getUser(id) {
  return users.find(u => u.id == id);
}
```

### Nombres

- Variables: `camelCase`
- Constantes: `UPPER_SNAKE_CASE`
- Clases: `PascalCase`
- Funciones: `camelCase`

### Comentarios

```javascript
// ✅ Bueno - Explica el "por qué"
// Usar bcrypt en lugar de crypto simple para mayor seguridad
const hash = await bcrypt.hash(password, 10);

// ❌ Malo - Explica el "qué" (obvio)
// Hashear la contraseña
const hash = await bcrypt.hash(password, 10);
```

### Errores

```javascript
// ✅ Bueno
try {
  const user = await getUser(userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
} catch (error) {
  console.error('Error fetching user:', error);
  return res.status(500).json({ error: 'Server error' });
}

// ❌ Malo
const user = await getUser(userId);
return res.json(user);
```

## 🧪 Testing

### Ejecutar Tests

```bash
npm test
```

### Escribir Tests

```javascript
// Ejemplo con Jest
describe('User Authentication', () => {
  test('should login with valid credentials', async () => {
    const result = await login('user@example.com', 'password123');
    expect(result.token).toBeDefined();
    expect(result.user.id).toBe(1);
  });

  test('should fail with invalid credentials', async () => {
    expect(() => {
      login('user@example.com', 'wrongpassword');
    }).toThrow('Invalid credentials');
  });
});
```

## 📚 Documentación

### Actualizar README

Si tu cambio afecta el uso:

```markdown
## Nueva Característica

Descripción de la característica.

### Uso

```bash
npm run nueva-caracteristica
```

### Ejemplo

```javascript
const resultado = nuevaCaracteristica();
```
```

### Comentarios de Código

```javascript
/**
 * Obtiene un usuario por ID
 * @param {number} userId - ID del usuario
 * @returns {Promise<User>} El usuario encontrado
 * @throws {Error} Si el usuario no existe
 */
async function getUserById(userId) {
  // ...
}
```

## 🔄 Proceso de Review

1. Un mantenedor revisará tu PR
2. Puede solicitar cambios
3. Realiza los cambios solicitados
4. Marca como "ready for review"
5. Se aprueba y se hace merge

## 🎯 Áreas de Contribución

### Fácil (Bueno para principiantes)

- [ ] Mejorar documentación
- [ ] Agregar ejemplos
- [ ] Corregir typos
- [ ] Mejorar mensajes de error

### Intermedio

- [ ] Agregar nuevas características menores
- [ ] Refactorización de código
- [ ] Mejorar tests
- [ ] Optimizar rendimiento

### Avanzado

- [ ] Arquitectura de sistema
- [ ] Características complejas
- [ ] Integración de nuevas tecnologías
- [ ] Análisis de seguridad

## 📞 Contacto

- **Issues**: Para reportes de bugs y solicitudes de features
- **Discussions**: Para preguntas y discusiones
- **Email**: dev@cyberzid.com

## 📜 Licencia

Al contribuir, aceptas que tu código será licenciado bajo MIT License.

---

¡Gracias por contribuir a CyberZid! 🎉
