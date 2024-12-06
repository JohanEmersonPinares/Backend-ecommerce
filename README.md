
# Kyurem - E-Commerce de Ropa

Kyurem es una tienda en línea que ofrece una gran variedad de ropa de alta calidad. Con una interfaz moderna y un sistema eficiente de compras, Kyurem está diseñado para brindarte una experiencia de usuario única y fácil de usar.

## Características

- **Catálogo de productos:** Amplia selección de ropa con imágenes y detalles.
- **Carrito de compras:** Sistema para agregar, actualizar y eliminar productos del carrito.
- **Autenticación de usuarios:** Los usuarios pueden registrarse, iniciar sesión y ver su carrito de compras.
- **Procesamiento de pagos:** Integración de métodos de pago para una compra segura.
- **Envío:** Cálculo de tarifas de envío y opciones de entrega.

## Instalación

Para ejecutar el proyecto localmente, sigue los siguientes pasos:

1. Clona este repositorio:
   ```bash
   git clone https://github.com/tu-usuario/kyurem.git
   ```

2. Accede a la carpeta del proyecto:
   ```bash
   cd kyurem
   ```

3. Instala las dependencias:
   ```bash
   npm install
   ```

4. Configura las variables de entorno en un archivo `.env`:
   ```bash
   BACKEND_URL=<URL_DEL_BACKEND>
   CLOUDINARY_URL=<URL_DE_CLOUDINARY>
   JWT_SECRET=<SECRETO_DEL_JWT>
   ```

5. Ejecuta el proyecto:
   ```bash
   npm start
   ```

## Estructura del Proyecto

```
kyurem/
├── backend/
│   ├── cloudinary.js
│   ├── db.js
│   ├── controllers/
│   │   ├── cartController.js
│   │   ├── productController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── adminAuth.js
│   │   └── auth.js
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   └── routes/
│       ├── cartRoute.js
│       ├── productRoute.js
│       └── userRoute.js
├── frontend/
│   ├── src/
│   │   ├── app.js
│   │   └── index.js
│   └── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

## Contribuir

Si deseas contribuir a este proyecto, por favor sigue estos pasos:

1. Haz un fork del repositorio.
2. Crea una rama para tu característica (`git checkout -b feature-nueva`).
3. Realiza tus cambios y haz un commit (`git commit -am 'Añadir nueva característica'`).
4. Haz un push a tu rama (`git push origin feature-nueva`).
5. Crea un Pull Request.

## Autor

- **GitHub**: [Johan Emerson Pinares](https://github.com/JohanEmersonPinares)
- **LinkedIn**: [Johan Emerson Pinares](https://www.linkedin.com/in/johanemersonpinares/)

## Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más detalles.
