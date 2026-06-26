# Docentes — Cliente Angular 22 · Semana 7

Aplicación **Angular 22** con autenticación, rutas protegidas, interceptores HTTP y CRUD de usuarios y docentes (con exportación a CSV, Excel y PDF).

## Estructura

```
login/src/app/
├── core/
│   ├── guards/          # authGuard, guestGuard, adminGuard
│   ├── interceptors/    # credentials, CSRF, errores
│   ├── models/          # interfaces TypeScript
│   ├── services/        # Auth, Usuario, Docente, Export, CSRF
│   └── state/           # AuthStore, UsuarioStore, DocenteStore (signals)
└── features/
    ├── login/           # Formulario reactivo de login
    ├── inicio/          # Pantalla de bienvenida Semana 7
    ├── usuarios/        # Listado y formulario CRUD
    └── docentes/        # Listado (con exportación) y formulario CRUD
```

## Requisitos

- [Node.js 20+](https://nodejs.org/)
- Backend corriendo en `http://localhost:5121`

## Configuración

Archivo: `src/environments/environment.ts`

| Variable | Descripción |
|---|---|
| `apiUrl` | URL base de la API (`http://localhost:5121/api`) |

## Ejecutar

```bash
cd login
npm install
npm start
```

La app queda en `http://localhost:4200`.

## Credenciales de prueba

| Usuario | Contraseña |
|---|---|
| `admin` | `Admin123!` |
| `maria.garcia` | `Maria2024!` |

## Build de producción

```bash
npm run build
```

Salida en `dist/login/`.

## Pruebas

```bash
npm test
```
