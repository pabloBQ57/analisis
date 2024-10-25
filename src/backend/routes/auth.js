import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js'; // Importar el modelo de usuario

const router = express.Router();

// Ruta para registrar un nuevo usuario
router.post('/register', async (req, res) => {
  const { nombre_usuario, email, password } = req.body;

  try {
    // Verificar si el usuario o el email ya existen
    const existingUser = await User.findOne({ where: { nombre_usuario } });
    if (existingUser) {
      return res.status(400).json({ message: 'El nombre de usuario ya está en uso.' });
    }

    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      return res.status(400).json({ message: 'El email ya está registrado.' });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear y guardar el usuario
    const user = await User.create({
      nombre_usuario,
      email,
      password_hash: hashedPassword
    });

    res.status(201).json({ message: 'Usuario registrado con éxito', user });
  } catch (error) {
    console.error("Error al registrar usuario:", error); // Mostrar el error completo en la consola
    res.status(500).json({ message: 'Error al registrar usuario', error: error.message });
  }
});

// Ruta para iniciar sesión
router.post('/login', async (req, res) => {
  const { nombre_usuario, password } = req.body;

  try {
    // Verificar si el usuario existe
    const user = await User.findOne({ where: { nombre_usuario } });
    if (!user) {
      return res.status(400).json({ message: 'Usuario no encontrado.' });
    }

    // Comparar la contraseña ingresada con la almacenada
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Contraseña incorrecta.' });
    }

    // Si la contraseña coincide, iniciar sesión exitoso
    res.status(200).json({ message: 'Inicio de sesión exitoso' });
  } catch (error) {
    console.error("Error al iniciar sesión:", error); // Mostrar el error completo en la consola
    res.status(500).json({ message: 'Error al iniciar sesión', error: error.message });
  }
});

export default router;
