// testScript.js

function sumar(a, b) {
    return a + b;
  }
  
  // Manejo de argumentos para seleccionar el tipo de prueba
  if (process.argv.includes('--unit-test')) {
    console.log('Ejecutando pruebas unitarias...');
  
    // Lógica para pruebas unitarias
    const resultado = sumar(2, 3);
    if (resultado === 5) {
      console.log('Prueba unitaria exitosa: La suma es correcta.');
    } else {
      console.log('Prueba unitaria fallida: La suma es incorrecta.');
    }
  
  } else if (process.argv.includes('--integration-test')) {
    console.log('Ejecutando pruebas de integración...');
    
    // Lógica para pruebas de integración (Ejemplo: probar una función más compleja)
    const resultado1 = sumar(2, 3);
    const resultado2 = sumar(5, 5);
    if (resultado1 === 5 && resultado2 === 10) {
      console.log('Prueba de integración exitosa: Las sumas son correctas.');
    } else {
      console.log('Prueba de integración fallida: Las sumas son incorrectas.');
    }
  
  } else if (process.argv.includes('--simulate')) {
    console.log('Ejecutando simulación...');
    
    // Lógica para la simulación
    for (let i = 0; i < 3; i++) {
      const a = Math.floor(Math.random() * 10);
      const b = Math.floor(Math.random() * 10);
      console.log(`Simulando suma de ${a} + ${b}: Resultado = ${sumar(a, b)}`);
    }
  
  } else {
    console.log('Tipo de prueba no especificado.');
  }
  