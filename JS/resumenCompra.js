//Resumen de compra

// Obtener los datos del carrito y el formulario del localStorage
let carrito = [];
let usuario = {};

try {
  carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  usuario = JSON.parse(localStorage.getItem("usuario")) || {};
} catch (error) {
  console.error("Error al obtener los datos del carrito o del usuario:", error);
}

// Función para calcular el total
function calcularTotal() {
  try {
    return carrito
      .reduce((total, item) => {
        const precioPresentacion = item.medicamento.presentaciones.find(
          (p) => p.nombre === item.presentacion
        ).precio;
        return total + precioPresentacion * item.cantidad;
      }, 0)
      .toFixed(2);
  } catch (error) {
    console.error("Error al calcular el total:", error);
    return "Error al calcular el total de tu compra.";
  }
}

// Función para mostrar el resumen de la compra
function mostrarResumen() {
  const resumenDiv = document.getElementById("resumen");

  try {
    // Verificar si hay datos del usuario y/o productos en el carrito
    if (!usuario || Object.keys(usuario).length === 0 || carrito.length === 0) {
      resumenDiv.innerHTML = "<p>No hay productos en el carrito.</p>";
      return;
    }

    // Con esto creo un número de orden ficticio
    const numeroOrden = Math.floor(Math.random() * 10000000000).toString();

    // Crear el mensaje de agradecimiento
    const mensajeAgradecimiento = `
         <h3>¡Tu compra ha sido confirmada!</h3>
         <p>Hola, ${usuario.nombre || "Cliente"}</p>
         <p>Tu número de orden es <strong>${numeroOrden}</strong></p>
         <p>Tu pedido pronto se encontrará en preparación. ¡Gracias por hacernos parte del cuidado de tus peluditos!</p>
         <p>En los próximos días te enviaremos un mensaje con tu número de seguimiento. </p>
         <p>Gracias por preferir FarmaVet. </p>
     `;

    // Crear el resumen del usuario
    const datosUsuario = `
            <h3>Datos para el Envío:</h3>
            <p>Nombre y Apellido: ${usuario.nombre}</p>
            <p>Teléfono: ${usuario.telefono}</p>
            <p>Dirección: ${usuario.direccion}</p>
            <p>Método de Pago utilizado: ${usuario.metodoPago}</p>
            <p>Envío elegido: ${usuario.envio}</p>
        `;

    // Crear la lista de productos comprados
    const listaProductos = carrito
      .map((item) => {
        const precioPresentacion = item.medicamento.presentaciones.find(
          (p) => p.nombre === item.presentacion
        ).precio;
        const precioTotal = (precioPresentacion * item.cantidad).toFixed(2);
        return `
            <li>
                <img src="${item.medicamento.imagen}" alt="${item.medicamento.nombre}" style="width: 50px; height: 50px; margin: 5px;">
                ${item.medicamento.nombre} (${item.presentacion}) - ${item.cantidad} unidades - Precio: $${precioTotal}
            </li>
        `;
      })
      .join("");

    const productosResumen = `
            <h3>Productos Comprados:</h3>
            <ul>
                ${listaProductos}
            </ul>
        `;

    // Se calcula el total
    const totalPagado = calcularTotal();

    // Se muestra todo en el resumen
    resumenDiv.innerHTML = `${mensajeAgradecimiento}${datosUsuario}${productosResumen}
        <h3>Total Pagado: $${totalPagado}</h3>`;
  } catch (error) {
    // Mostrar mensaje de error en el resumen
    resumenDiv.innerHTML = "<p>Error al mostrar el resumen de tu compra.</p>";
    console.error("Error al mostrar el resumen de compra:", error);
  }
}

// Llamar a la función para mostrar el resumen
mostrarResumen();

// Vaciar el carrito y el usuario del localStorage al cargar la página
localStorage.removeItem("carrito");
localStorage.removeItem("usuario");

// Función para volver a la página principal
function volverAPaginaPrincipal() {
  window.location.href = "../index.html";
}
