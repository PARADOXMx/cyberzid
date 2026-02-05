# 🚀 Deployment en Vercel - CyberZid

Guía completa para desplegar CyberZid en Vercel con dominio personalizado.

## 📋 Requisitos Previos

1. Cuenta en [Vercel](https://vercel.com)
2. Repositorio en GitHub (público o privado)
3. Dominio: `social-planet.space`
4. Base de datos MySQL (en la nube o local)

## 🔧 Paso 1: Preparar el Repositorio

### 1.1 Inicializar Git

```bash
cd cyberzid-source
git init
git add .
git commit -m "Initial commit: CyberZid social network"
```

### 1.2 Crear Repositorio en GitHub

```bash
# En GitHub, crear nuevo repositorio "cyberzid"
# Luego ejecutar:
git remote add origin https://github.com/tu-usuario/cyberzid.git
git branch -M main
git push -u origin main
```

## 🌐 Paso 2: Conectar Vercel

### 2.1 Importar Proyecto

1. Ir a [Vercel Dashboard](https://vercel.com/dashboard)
2. Click en "New Project"
3. Seleccionar "Import Git Repository"
4. Conectar GitHub y seleccionar el repositorio `cyberzid`

### 2.2 Configurar Build Settings

En Vercel, configurar:

- **Framework Preset**: Other
- **Build Command**: `npm run build`
- **Output Directory**: (dejar vacío)
- **Install Command**: `npm install`

## 🔐 Paso 3: Configurar Variables de Entorno

En Vercel Dashboard → Project Settings → Environment Variables

Agregar las siguientes variables:

```
JWT_SECRET=tu-clave-secreta-super-segura-cambiar-en-produccion
DB_HOST=tu-base-de-datos-host.com
DB_PORT=3306
DB_USER=cyberzid_user
DB_PASSWORD=tu-contraseña-segura
DB_NAME=cyberzid
NODE_ENV=production
CORS_ORIGIN=https://social-planet.space,https://www.social-planet.space
```

### Obtener Credenciales de Base de Datos

Opciones recomendadas:

#### Opción A: PlanetScale (MySQL compatible)

```bash
# 1. Crear cuenta en https://planetscale.com
# 2. Crear base de datos "cyberzid"
# 3. Obtener connection string
# 4. Usar credenciales en Vercel
```

#### Opción B: AWS RDS

```bash
# 1. Crear instancia RDS MySQL
# 2. Configurar security groups
# 3. Obtener endpoint
# 4. Usar en Vercel
```

#### Opción C: DigitalOcean Managed Database

```bash
# 1. Crear base de datos MySQL
# 2. Obtener connection details
# 3. Usar en Vercel
```

## 🌍 Paso 4: Configurar Dominio Personalizado

### 4.1 En Vercel

1. Ir a Project Settings → Domains
2. Click en "Add Domain"
3. Ingresar: `social-planet.space`
4. Vercel mostrará los nameservers

### 4.2 En tu Registrador de Dominios

1. Ir a tu registrador (GoDaddy, Namecheap, etc.)
2. Acceder a DNS Settings
3. Cambiar nameservers a los de Vercel:

```
ns1.vercel-dns.com
ns2.vercel-dns.com
```

O agregar registros CNAME:

```
Tipo: CNAME
Nombre: social-planet.space
Valor: cname.vercel-dns.com
```

### 4.3 Agregar www

1. En Vercel, agregar también `www.social-planet.space`
2. Vercel lo redirigirá automáticamente

## ✅ Paso 5: Verificar Deployment

### 5.1 Verificar en Vercel

1. Ir a Deployments
2. Ver que el deployment esté en estado "Ready"
3. Click en "Visit" para ver la aplicación

### 5.2 Probar la Aplicación

```bash
# Acceder a la URL
https://social-planet.space

# Probar login
Email: demo@cyberzid.com
Contraseña: demo123

# Probar API
curl https://social-planet.space/api/posts
```

### 5.3 Verificar Dominio

```bash
# Verificar DNS
nslookup social-planet.space

# Verificar HTTPS
curl -I https://social-planet.space
```

## 🔄 Paso 6: Configurar Redeploy Automático

En Vercel, el redeploy automático está habilitado por defecto:

- Cada push a `main` dispara un nuevo deployment
- Los deployments anteriores se conservan
- Puedes revertir a versiones anteriores

## 📊 Monitoreo

### En Vercel Dashboard

- **Analytics**: Ver tráfico y rendimiento
- **Logs**: Ver logs del servidor
- **Deployments**: Historial de deployments

### Logs en Tiempo Real

```bash
vercel logs --follow
```

## 🐛 Troubleshooting

### Error: "Cannot find module"

```bash
# Reinstalar dependencias
npm install

# Verificar package.json
cat package.json
```

### Error: "Database connection refused"

```bash
# Verificar credenciales en .env.production
# Verificar que la BD está accesible desde Vercel
# Agregar IP de Vercel a firewall de BD
```

### Error: "CORS policy"

```bash
# Verificar CORS_ORIGIN en variables de entorno
# Debe incluir https://social-planet.space
```

### Dominio no funciona

```bash
# Esperar 24-48 horas para propagación DNS
# Verificar nameservers: nslookup social-planet.space
# Verificar en Vercel que dominio esté configurado
```

## 🔐 Seguridad en Producción

### Checklist

- [ ] JWT_SECRET cambiado a valor seguro
- [ ] DB_PASSWORD es fuerte (12+ caracteres)
- [ ] CORS_ORIGIN configurado correctamente
- [ ] HTTPS habilitado (automático en Vercel)
- [ ] Base de datos con backups automáticos
- [ ] Monitoreo de logs habilitado

### Actualizar Secretos

```bash
# En Vercel Dashboard
# Settings → Environment Variables
# Editar y guardar
# Vercel redeploya automáticamente
```

## 📈 Escalado

Si la aplicación crece:

1. **Aumentar recursos en Vercel**: Pro Plan
2. **Optimizar base de datos**: Índices, caché
3. **Implementar CDN**: Para archivos estáticos
4. **Usar Redis**: Para caché y sesiones

## 📞 Soporte

- [Vercel Docs](https://vercel.com/docs)
- [Vercel Support](https://vercel.com/support)
- Email: support@cyberzid.com

## 🎯 Próximos Pasos

1. ✅ Desplegar en Vercel
2. ✅ Configurar dominio
3. ⬜ Configurar email notifications
4. ⬜ Implementar analytics
5. ⬜ Agregar más features

---

**Última actualización**: 2024-02-04
**Versión**: 1.0.0

## URLs Importantes

- **Aplicación**: https://social-planet.space
- **Dashboard Vercel**: https://vercel.com/dashboard
- **Repositorio**: https://github.com/tu-usuario/cyberzid
