let medicamentos = [];

// Cargar medicamentos desde el archivo JSON
fetch('./JS/productos.json')

  .then(response => response.json())
  .then(data => {
    medicamentos = data;
    mostrarProductos();
    actualizarCarritoEnDOM();
  })
  .catch(error => console.error('Error al cargar los productos:', error));

// Carrito de compras
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// Funciones de lógica del carrito
function agregarAlCarrito(idMedicamento, presentacion) {
  const medicamento = medicamentos.find((m) => m.id === idMedicamento);
  const itemCarrito = carrito.find(
    (item) =>
      item.medicamento.id === idMedicamento &&
      item.presentacion === presentacion
  );
  if (itemCarrito) {
    itemCarrito.cantidad++;
  } else {
    carrito.push({ medicamento, presentacion, cantidad: 1 });
  }
  guardarCarritoEnLocalStorage();
  actualizarCarritoEnDOM();
}

// Función para modificar la cantidad en el carrito
function modificarCantidadEnCarrito(idMedicamento, presentacion, accion) {
  const itemCarrito = carrito.find(
    (item) =>
      item.medicamento.id === idMedicamento &&
      item.presentacion === presentacion
  );

  if (itemCarrito) {
    if (accion === "incrementar") {
      itemCarrito.cantidad++;
    } else if (accion === "disminuir") {

      if (itemCarrito.cantidad > 1) {
        itemCarrito.cantidad--;
      } else {
        eliminarDelCarrito(idMedicamento, presentacion);
      }
    }
  }
  guardarCarritoEnLocalStorage();
  actualizarCarritoEnDOM();
}

function eliminarDelCarrito(idMedicamento, presentacion) {
  carrito = carrito.filter(
    (item) =>
      !(item.medicamento.id === idMedicamento && item.presentacion === presentacion)
  );
  guardarCarritoEnLocalStorage();
  actualizarCarritoEnDOM();
}

function vaciarCarrito() {
  carrito = [];
  guardarCarritoEnLocalStorage();
  actualizarCarritoEnDOM();
}

function guardarCarritoEnLocalStorage() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

function calcularTotal() {
  return carrito.reduce((total, item) => {
    const precioPresentacion = item.medicamento.presentaciones.find(
      (p) => p.nombre === item.presentacion
    ).precio;
    return total + precioPresentacion * item.cantidad;
  }, 0);
}

// Función para actualizar el carrito en el DOM
function actualizarCarritoEnDOM() {
  const listaCarrito = document.getElementsByClassName("listaCarrito")[0];
  listaCarrito.innerHTML = "";
  carrito.forEach((item) => {
    const li = document.createElement("li");
    const precioPresentacion = item.medicamento.presentaciones.find(
      (p) => p.nombre === item.presentacion
    ).precio;

    li.textContent = `${item.medicamento.nombre} (${item.presentacion}) - ${item.cantidad} unidades - Precio: $${precioPresentacion}`;

    // Botón para aumentar la cantidad
    const botonAumentar = document.createElement("button");
    botonAumentar.textContent = "+";
    botonAumentar.onclick = () => modificarCantidadEnCarrito(item.medicamento.id, item.presentacion, "incrementar");

    // Botón para disminuir la cantidad
    const botonDisminuir = document.createElement("button");
    botonDisminuir.textContent = "-";
    botonDisminuir.onclick = () => modificarCantidadEnCarrito(item.medicamento.id, item.presentacion, "disminuir");

    // Botón para eliminar el producto del carrito
    const botonEliminar = document.createElement("button");
    botonEliminar.innerHTML = '<i class="fas fa-trash-alt"></i>';
    botonEliminar.onclick = () => eliminarDelCarrito(item.medicamento.id, item.presentacion);

    li.appendChild(botonDisminuir);
    li.appendChild(botonAumentar);
    li.appendChild(botonEliminar);

    listaCarrito.appendChild(li);
  });

  const total = calcularTotal();
  const totalElement = document.getElementsByClassName("totalCarrito")[0];
  totalElement.textContent = `Total: $${total}`;
}

// Mostrar productos y agregar eventos
function mostrarProductos() {
  const productosContainer = document.getElementById("productos-container");
  productosContainer.innerHTML = "";
  medicamentos.forEach((medicamento) => {
    const col = document.createElement("div");
    col.className = "col-md-4 mb-4";

    // Opciones del select usando map
    const opciones = medicamento.presentaciones.map(presentacion =>
      `<option value="${presentacion.nombre}" data-precio="${presentacion.precio}">${presentacion.nombre}</option>`
    ).join("");

    // HTML sin incluir js
    col.innerHTML = `
            <div class="card">
                <img src="${medicamento.imagen}" class="card-img-top" alt="${medicamento.nombre}">
                <div class="card-body">
                    <h5 class="card-title">${medicamento.nombre}</h5>
                    <p class="card-text">Propiedades: ${medicamento.propiedades}</p>
                    <p>Precio: <span class="precio" id="precio-${medicamento.id}">$${medicamento.presentaciones[0].precio}</span></p>
                    <select class="form-select mb-3" id="select-${medicamento.id}">
                        ${opciones}
                    </select>
                    <button class="btn btn-primary" id="boton-agregar-${medicamento.id}">Agregar al Carrito</button>
                </div>
            </div>
        `;

    // Agregar eventos después de asignar el HTML
    const selectPresentacion = col.querySelector(`#select-${medicamento.id}`);
    selectPresentacion.onchange = (event) => {
      const selectedOption = event.target.options[event.target.selectedIndex];
      const nuevoPrecio = selectedOption.dataset.precio;
      document.getElementById(`precio-${medicamento.id}`).textContent = `$${nuevoPrecio}`;
    };

    const botonAgregar = col.querySelector(`#boton-agregar-${medicamento.id}`);
    botonAgregar.onclick = () => {
      const presentacionSeleccionada = selectPresentacion.value;
      agregarAlCarrito(medicamento.id, presentacionSeleccionada);
    };

    productosContainer.appendChild(col);
  });
}

// Mostrar el formulario si hay productos en el carrito
const botonFinalizarModal = document.getElementById("finalizar-pedido-modal");
const formularioContainer = document.getElementById("formulario-container");
const formularioPedido = document.getElementById("formulario-pedido");
const mensaje = document.getElementById("mensaje");

// Evento para finalizar el pedido desde el modal
botonFinalizarModal.addEventListener("click", () => {
  const mensajeError = document.getElementById("mensaje-error");
  mensajeError.style.display = "none";

  if (carrito.length > 0) {
    formularioContainer.style.display = "block";
  } else {
    mensajeError.textContent = "El carrito está vacío. Añade productos antes de finalizar el pedido.";
    mensajeError.style.display = "block";
  }
});


formularioPedido.addEventListener('submit', (event) => {
  event.preventDefault();
  
  // Obtener los datos ingresados en el formulario
  const nombre = document.getElementById("nombre").value;
  const telefono = document.getElementById("telefono").value;
  const direccion = document.getElementById("direccion").value;
  const metodoPago = document.getElementById("metodoPago").value;
  const envio = document.getElementById("envio").value;

  // Crear un objeto de resumen de la compra
  const usuario = {
    nombre,
    telefono,
    direccion,
    metodoPago,
    envio,
    productos: carrito 
  };

  // Guardar el resumen en localStorage
  localStorage.setItem("usuario", JSON.stringify(usuario));
  localStorage.setItem("carrito", JSON.stringify(carrito));

  // Limpiar el carrito de pedido
  carrito = [];

  // Redirigir a la página del resumen
  window.location.href = '../resumendecompra.html'; 
});


// Evento para vaciar el carrito
const botonVaciar = document.getElementById("vaciar-carrito");
botonVaciar.addEventListener("click", vaciarCarrito);

// Inicializar la aplicación
mostrarProductos();
actualizarCarritoEnDOM();
