# Frontend - PlanMyMoney

## Descripción del Proyecto
El frontend de la aplicación de Gestión de Finanzas Personales es una interfaz web intuitiva y fácil de usar que permite a los usuarios gestionar sus ingresos, gastos y saldo actual. La aplicación está diseñada para visualizar datos financieros de manera clara y eficiente.

## Tecnologías Utilizadas
- **React.js** - Biblioteca de JavaScript para la construcción de interfaces de usuario.
- **Vite** - Herramienta para el desarrollo rápido de aplicaciones React.
- **PrimeReact** - Componentes UI para una mejor experiencia de usuario.
- **Axios** - Cliente HTTP para realizar peticiones al backend.
- **React Router** - Gestión de navegación entre vistas.
- **CSS y Styled Components** - Para la personalización del diseño.

## Instalación y Configuración
1. Clonar el repositorio:
   ```sh
   git clone https://github.com/
   ```
2. Entrar al directorio del frontend:
   ```sh
   cd frontend
   ```
3. Instalar dependencias:
   ```sh
   npm install
   ```
4. Configurar las variables de entorno en un archivo `.env`:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_SECRET_KEY=S3cUr3!K3y@2025
   ```
5. Iniciar la aplicación:
   ```sh
   npm run dev
   ```

## Estructura del Proyecto
```
frontend/
│── src/
│   ├── components/     # Componentes reutilizables
│   ├── pages/          # Vistas principales
│   ├── services/       # Llamadas a la API
│   ├── hooks/          # Hooks personalizados
│   ├── context/        # Contexto global de la aplicación
│   ├── styles/         # Estilos globales
│   ├── App.jsx         # Componente principal
│   ├── main.jsx        # Punto de entrada de React
```

## Contribuciones
Las contribuciones son bienvenidas. Para colaborar:
1. Crea un fork del repositorio.
2. Crea una nueva rama (`git checkout -b feature/nueva-funcionalidad`).
3. Realiza cambios y súbelos (`git commit -m "Descripción del cambio"`).
4. Envía un Pull Request.
