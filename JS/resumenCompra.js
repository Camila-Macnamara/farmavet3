// Resumen de Compra

// Obtener los datos del carrito y el formulario del localStorage
const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
const usuario = JSON.parse(localStorage.getItem("usuario")) || {}; // Asegúrate de que esto sea correcto

// Función para calcular el total
function calcularTotal() {
    return carrito.reduce((total, item) => {
        const precioPresentacion = item.medicamento.presentaciones.find(
            (p) => p.nombre === item.presentacion
        ).precio; // Obtener el precio de la presentación
        return total + precioPresentacion * item.cantidad;
    }, 0).toFixed(2); // Redondear a 2 decimales
}

// Función para mostrar el resumen de la compra
function mostrarResumen() {
    const resumenDiv = document.getElementById("resumen");

    // Verificar si hay datos del usuario
    if (!usuario || Object.keys(usuario).length === 0) {
        resumenDiv.innerHTML = "<p>No hay datos de usuario.</p>";
        return;
    }

    // Crear el resumen del usuario
    const datosUsuario = `
        <h3>Datos para el Envío:</h3>
        <p>Nombre y Apellido: ${usuario.nombre}</p>
        <p>Teléfono: ${usuario.telefono}</p>
        <p>Dirección: ${usuario.direccion}</p>
        <p>Método de Pago: ${usuario.metodoPago}</p>
        <p>Envío: ${usuario.envio}</p>
    `;

      // Crear la lista de productos comprados
  const listaProductos = carrito.map(item => {
    const precioPresentacion = item.medicamento.presentaciones.find(
        p => p.nombre === item.presentacion
    ).precio;
    const precioTotal = (precioPresentacion * item.cantidad).toFixed(2);
    return `
        <li>
            <img src="${item.medicamento.imagen}" alt="${item.medicamento.nombre}" style="width: 50px; height: 50px;">
            ${item.medicamento.nombre} (${item.presentacion}) - ${item.cantidad} unidades - Precio Total: $${precioTotal}
        </li>
    `;
}).join("");

    const productosResumen = `
        <h3>Productos Comprados:</h3>
        <ul>
            ${listaProductos}
        </ul>
    `;

    // Calcular el total
    const totalPagado = calcularTotal();

    // Mostrar todo en el resumen
    resumenDiv.innerHTML = `${datosUsuario}${productosResumen}
        <h3>Total Pagado: $${totalPagado}</h3>`;
}

// Llamar a la función para mostrar el resumen
mostrarResumen();


// Vaciar el carrito y el usuario del localStorage al cargar la página
localStorage.removeItem("carrito");
localStorage.removeItem("usuario");

// Función para volver a la página principal
function volverAPaginaPrincipal() {
    window.location.href = '../index.html';
}
