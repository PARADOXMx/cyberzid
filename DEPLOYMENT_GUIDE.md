# 🚀 Guía de Deployment - CyberZid en Vercel

## 📋 Pasos para Desplegar en Vercel

### 1. Preparar el Repositorio

```bash
# Inicializar Git
git init
git add .
git commit -m "Initial commit: CyberZid social network"
```

### 2. Crear Repositorio en GitHub

1. Ir a https://github.com/new
2. Crear repositorio llamado `cyberzid`
3. Conectar repositorio local:

```bash
git remote add origin https://github.com/tu-usuario/cyberzid.git
git branch -M main
git push -u origin main
```

### 3. Conectar Vercel

1. Ir a https://vercel.com/dashboard
2. Click en "New Project"
3. Seleccionar "Import Git Repository"
4. Conectar GitHub y seleccionar `cyberzid`

### 4. Configurar Variables de Entorno en Vercel

En Vercel Dashboard → Project Settings → Environment Variables

Agregar:

```
JWT_SECRET=tu-clave-secreta-super-segura-cambiar-en-produccion
DB_HOST=tu-base-de-datos-host.com
DB_PORT=3306
DB_USER=cyberzid_user
DB_PASSWORD=tu-contraseña-segura
DB_NAME=cyberzid
NODE_ENV=production
CORS_ORIGIN=https://social-planet.space,https://www.social-planet.space
DOMAIN=social-planet.space
```

### 5. Configurar Dominio Personalizado

1. En Vercel → Project Settings → Domains
2. Click en "Add Domain"
3. Ingresar: `social-planet.space`
4. Vercel mostrará los nameservers

### 6. Actualizar DNS en tu Registrador

En tu registrador de dominios (GoDaddy, Namecheap, etc.):

Cambiar nameservers a:
```
ns1.vercel-dns.com
ns2.vercel-dns.com
```

O agregar registro CNAME:
```
Tipo: CNAME
Nombre: social-planet.space
Valor: cname.vercel-dns.com
```

### 7. Agregar www

En Vercel, agregar también `www.social-planet.space`

### 8. Verificar Deployment

```bash
# Esperar 5-10 minutos para propagación DNS
# Luego acceder a:
https://social-planet.space

# Verificar health check
curl https://social-planet.space/health
```

## 📊 Estructura de Archivos Importante

```
cyberzid/
├── server/
│   └── index.js              ← Punto de entrada
├── database/
│   └── schema.sql
├── vercel.json               ← Configuración de Vercel
├── package.json
└── .env.production           ← Variables de producción
```

## 🔐 Variables de Entorno Requeridas

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `JWT_SECRET` | Clave para firmar tokens JWT | `tu-clave-segura-32-caracteres` |
| `DB_HOST` | Host de la base de datos | `db.example.com` |
| `DB_PORT` | Puerto de la base de datos | `3306` |
| `DB_USER` | Usuario de la base de datos | `cyberzid_user` |
| `DB_PASSWORD` | Contraseña de la base de datos | `contraseña-segura` |
| `DB_NAME` | Nombre de la base de datos | `cyberzid` |
| `DOMAIN` | Dominio personalizado | `social-planet.space` |
| `CORS_ORIGIN` | Orígenes permitidos | `https://social-planet.space` |

## 🐛 Troubleshooting

### Error: "Cannot find module"

```bash
# Reinstalar dependencias
npm install

# Verificar package.json
cat package.json
```

### Error: "Build failed"

1. Verificar logs en Vercel
2. Ejecutar localmente: `npm run dev`
3. Revisar errores de sintaxis

### Error: "CORS policy"

Verificar `CORS_ORIGIN` en variables de entorno

### Dominio no funciona

1. Esperar 24-48 horas para propagación DNS
2. Verificar nameservers: `nslookup social-planet.space`
3. Verificar en Vercel que dominio esté configurado

## 📈 Monitoreo

### Logs en Tiempo Real

```bash
# Instalar Vercel CLI
npm i -g vercel

# Ver logs
vercel logs --follow
```

### Analytics

En Vercel Dashboard → Analytics

## 🔄 Redeploy

### Automático

Cada push a `main` dispara un nuevo deployment

### Manual

En Vercel Dashboard → Deployments → Click en "Redeploy"

## 🚀 Próximos Pasos

1. ✅ Desplegar en Vercel
2. ✅ Configurar dominio personalizado
3. ⬜ Configurar base de datos en la nube
4. ⬜ Implementar email notifications
5. ⬜ Agregar más features

## 📞 Soporte

- [Vercel Docs](https://vercel.com/docs)
- [Vercel Support](https://vercel.com/support)
- Email: support@cyberzid.com

---

**URL de la Aplicación**: https://social-planet.space
**Dashboard Vercel**: https://vercel.com/dashboard
