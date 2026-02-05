# 🚀 Deployment en Netlify - CyberZid

Guía completa para desplegar CyberZid en Netlify con dominio personalizado.

## 📋 Requisitos Previos

1. Cuenta en [Netlify](https://netlify.com)
2. Repositorio en GitHub (público o privado)
3. Dominio: `social-planet.space`

## 🔧 Opción 1: Netlify CLI (Recomendado)

### 1.1 Instalar Netlify CLI

```bash
npm install -g netlify-cli
```

### 1.2 Autenticarse

```bash
netlify login
```

### 1.3 Desplegar

```bash
cd cyberzid-source
netlify deploy --prod
```

## 🌐 Opción 2: Conectar GitHub

### 2.1 Preparar Repositorio

```bash
git init
git add .
git commit -m "Initial commit: CyberZid"
git remote add origin https://github.com/tu-usuario/cyberzid.git
git branch -M main
git push -u origin main
```

### 2.2 Conectar en Netlify

1. Ir a https://app.netlify.com
2. Click en "New site from Git"
3. Conectar GitHub
4. Seleccionar repositorio `cyberzid`
5. Configurar build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `public`
   - **Functions directory**: `netlify/functions`

### 2.3 Configurar Variables de Entorno

En Netlify → Site settings → Build & deploy → Environment

Agregar:

```
JWT_SECRET=tu-clave-secreta-super-segura
DB_HOST=tu-base-de-datos-host.com
DB_PORT=3306
DB_USER=cyberzid_user
DB_PASSWORD=tu-contraseña-segura
DB_NAME=cyberzid
DOMAIN=social-planet.space
CORS_ORIGIN=https://social-planet.space,https://www.social-planet.space
```

## 🌍 Configurar Dominio Personalizado

### 3.1 En Netlify

1. Ir a Site settings → Domain management
2. Click en "Add custom domain"
3. Ingresar: `social-planet.space`
4. Netlify mostrará las opciones de DNS

### 3.2 Opción A: Cambiar Nameservers (Recomendado)

En tu registrador (GoDaddy, Namecheap, etc.):

Cambiar nameservers a los que Netlify proporciona

### 3.3 Opción B: Usar CNAME

En tu registrador, agregar registro CNAME:

```
Tipo: CNAME
Nombre: social-planet.space
Valor: [valor-que-netlify-proporciona]
```

### 3.4 Agregar www

En Netlify, agregar también `www.social-planet.space`

## ✅ Verificar Deployment

```bash
# Acceder a la aplicación
https://social-planet.space

# Verificar health check
curl https://social-planet.space/api/health

# Ver logs en tiempo real
netlify logs
```

## 📊 Estructura de Archivos

```
cyberzid/
├── netlify.toml              ← Configuración de Netlify
├── netlify/
│   └── functions/
│       └── server.js         ← Función serverless
├── public/
│   └── index.html            ← Página estática
├── package.json
└── database/
    └── schema.sql
```

## 🔐 Variables de Entorno Requeridas

| Variable | Descripción |
|----------|-------------|
| `JWT_SECRET` | Clave para firmar tokens JWT |
| `DB_HOST` | Host de la base de datos |
| `DB_PORT` | Puerto de la base de datos |
| `DB_USER` | Usuario de la base de datos |
| `DB_PASSWORD` | Contraseña de la base de datos |
| `DB_NAME` | Nombre de la base de datos |
| `DOMAIN` | Dominio personalizado |
| `CORS_ORIGIN` | Orígenes permitidos |

## 🐛 Troubleshooting

### Error: "Build failed"

1. Verificar logs en Netlify
2. Ejecutar localmente: `npm run dev`
3. Revisar errores de sintaxis

### Error: "Function not found"

1. Verificar que `netlify/functions/server.js` existe
2. Verificar que `netlify.toml` está configurado correctamente
3. Redeploy: `netlify deploy --prod`

### Error: "CORS policy"

1. Verificar `CORS_ORIGIN` en variables de entorno
2. Debe incluir `https://social-planet.space`

### Dominio no funciona

1. Esperar 24-48 horas para propagación DNS
2. Verificar nameservers: `nslookup social-planet.space`
3. Verificar en Netlify que dominio esté configurado

## 📈 Monitoreo

### Logs en Tiempo Real

```bash
netlify logs
```

### Analytics

En Netlify → Analytics

## 🔄 Redeploy

### Automático

Cada push a `main` dispara un nuevo deployment

### Manual

```bash
netlify deploy --prod
```

## 🚀 Ventajas de Netlify

✅ Funciones serverless incluidas
✅ Dominio personalizado gratuito
✅ SSL/HTTPS automático
✅ Redeploy automático desde GitHub
✅ Logs en tiempo real
✅ Analytics incluido
✅ Fácil configuración de variables de entorno

## 📞 Soporte

- [Netlify Docs](https://docs.netlify.com)
- [Netlify Support](https://support.netlify.com)
- Email: support@cyberzid.com

---

**URL de la Aplicación**: https://social-planet.space
**Dashboard Netlify**: https://app.netlify.com
