const medicamentos = [
  {
    "id": 1,
    "nombre": "Naxpet",
    "presentaciones": [
      { "nombre": "100ml", "precio": 120 },
      { "nombre": "200ml", "precio": 189 }
    ],
    "propiedades": "Antiinflamatorio y analgésico para animales",
    "imagen": "./img/naxpet.jpg"
  },
  {
    "id": 2,
    "nombre": "Doxiciclina",
    "presentaciones": [
      { "nombre": "10 cápsulas", "precio": 100 },
      { "nombre": "20 cápsulas", "precio": 180 }
    ],
    "propiedades": "Antibiótico de amplio espectro",
    "imagen": "./img/doximicin.jpg"
  },
  {
    "id": 3,
    "nombre": "Prednisolona",
    "presentaciones": [
      { "nombre": "10 cápsulas", "precio": 45 },
      { "nombre": "25 cápsulas", "precio": 80 }
    ],
    "propiedades": "Corticoide antiinflamatorio",
    "imagen": "./img/dern.jpg"
  },
  {
    "id": 4,
    "nombre": "Fenilbutazona",
    "presentaciones": [
      { "nombre": "100ml", "precio": 70 },
      { "nombre": "250ml", "precio": 150 }
    ],
    "propiedades": "Analgésico y antiinflamatorio",
    "imagen": "./img/fenil.jpg"
  },
  {
    "id": 5,
    "nombre": "Clorhidrato de Trimebutina",
    "presentaciones": [
      { "nombre": "100ml", "precio": 60 },
      { "nombre": "200ml", "precio": 110 }
    ],
    "propiedades": "Antiespasmódico y analgésico",
    "imagen": "./img/respig.jpg"
  },
  {
    "id": 6,
    "nombre": "Ivermectina",
    "presentaciones": [
      { "nombre": "50ml", "precio": 55 },
      { "nombre": "100ml", "precio": 95 }
    ],
    "propiedades": "Antiparasitario",
    "imagen": "./img/invermic.jpg"
  },
  {
    "id": 7,
    "nombre": "Bendazol",
    "presentaciones": [
      { "nombre": "30ml", "precio": 70 },
      { "nombre": "60ml", "precio": 120 }
    ],
    "propiedades": "Antiparasitario de amplio espectro",
    "imagen": "./img/bzol.jpg"
  },
  {
    "id": 8,
    "nombre": "Metronidazol",
    "presentaciones": [
      { "nombre": "100ml", "precio": 30 },
      { "nombre": "200ml", "precio": 50 }
    ],
    "propiedades": "Antibiótico y antiparasitario",
    "imagen": "./img/gastroenteril.jpg"
  },
  {
    "id": 9,
    "nombre": "Loperamida",
    "presentaciones": [
      { "nombre": "100ml", "precio": 59 },
      { "nombre": "200ml", "precio": 80 }
    ],
    "propiedades": "Antidiarreico",
    "imagen": "./img/diarrepas.jpg"
  }
];

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

function modificarCantidadEnCarrito(idMedicamento, presentacion, accion) {
  const itemCarrito = carrito.find(
    (item) =>
      item.medicamento.id === idMedicamento &&
      item.presentacion === presentacion
  );
  if (itemCarrito) {
    if (accion === "incrementar") {
      itemCarrito.cantidad++;
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

function actualizarCarritoEnDOM() {
  const listaCarrito = document.getElementsByClassName("listaCarrito")[0];
  listaCarrito.innerHTML = "";
  carrito.forEach((item) => {
    const li = document.createElement("li");
    const precioPresentacion = item.medicamento.presentaciones.find(
      (p) => p.nombre === item.presentacion
    ).precio;
    li.textContent = `${item.medicamento.nombre} (${item.presentacion}) - ${item.cantidad} unidades - Precio: $${precioPresentacion}`;

    const botonAumentar = document.createElement("button");
    botonAumentar.textContent = "+";
    botonAumentar.onclick = () => modificarCantidadEnCarrito(item.medicamento.id, item.presentacion, "incrementar");

    const botonEliminar = document.createElement("button");
    botonEliminar.innerHTML = '<i class="fas fa-trash-alt"></i>';
    botonEliminar.onclick = () => eliminarDelCarrito(item.medicamento.id, item.presentacion);

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

  // Mostrar mensaje de confirmación
  mensaje.textContent = `Gracias por comprar en Farma Vet, ${nombre}. Estaremos enviando tus productos a ${direccion} en los próximos días.`;
  mensaje.style.display = 'block';

  // Limpiar el carrito de pedido
  carrito = [];
  localStorage.removeItem("carrito");
  actualizarCarritoEnDOM();

  // Mantener el modal abierto durante 5 segundos
  const modal = bootstrap.Modal.getInstance(document.getElementById("carritoModal"));
  modal.show();

  // Ocultar el formulario y el mensaje después de 5 segundos
  setTimeout(() => {
    formularioContainer.style.display = 'none';
    mensaje.style.display = 'none';
    modal.hide();
  }, 5000);
});


// Evento para vaciar el carrito
const botonVaciar = document.getElementById("vaciar-carrito");
botonVaciar.addEventListener("click", vaciarCarrito);

// Inicializar la aplicación
mostrarProductos();
actualizarCarritoEnDOM();
