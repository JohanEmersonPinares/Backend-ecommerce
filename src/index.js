import app from '../src/app.js';
import connectCloudinary from '../config/cloudinary.js'; 
const PORT = process.env.PORT || 3000;

// Conectar a Cloudinary
connectCloudinary()
  .then(() => {
    console.log('Cloudinary connected successfully');
    // Iniciar el servidor solo si la conexión con Cloudinary fue exitosa
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to Cloudinary:', error);
  });
