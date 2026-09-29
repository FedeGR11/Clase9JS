const inputNombre = document.getElementById("input-nombre");
const inputPrecio = document.getElementById("input-precio");
const btnAgregar = document.getElementById("btn-agregar");
const inputBusqueda = document.getElementById("input-busqueda");
const feedback = document.getElementById("feedback");
const contenedorProductos = document.getElementById("contenedor-productos");


const productos = [
    { id: 1, nombre: "Teclado mecánico", precio: 45000 },
    { id: 2, nombre: "Mouse inalámbrico", precio: 22000 },
    { id: 3, nombre: "Monitor 24''", precio: 180000 }
];

const productosJS = JSON.parse(localStorage.getItem("productosJS")) ?? productos;
if (!localStorage.getItem("productosJS")) {
    guardarLocalStorage();
}

function guardarLocalStorage() {
    localStorage.setItem("productosJS", JSON.stringify(productosJS));
}

function renderizarProductos(lista) {
    contenedorProductos.innerHTML = "";

    lista.forEach(({ id, nombre, precio }) => {
        contenedorProductos.innerHTML += `
            <div>
                <h3>${nombre}</h3>
                <span>ID:${id}</span>
                <p>Precio: $${precio}</p>
                <button class="btn-eliminar" data-id="${id}">Eliminar</button>
            </div>
         `;
    });
}

function actualizarVista() {
    const textoFiltro = inputBusqueda.value.toLowerCase().trim();
    const productosFiltrados = productosJS.filter((producto) => producto.nombre.toLowerCase().includes(textoFiltro)
    );
    renderizarProductos(productosFiltrados);
}

actualizarVista();

setTimeout(() => {
    feedback.textContent = "🔔 Sistema de inventario cargado correctamente. Datos sincronizados.";
    feedback.className = "mensaje-exito";
}, 3000);


btnAgregar.addEventListener("click", () => {

    try {
        const nombre = inputNombre.value.trim();
        const precio = parseFloat(inputPrecio.value);

        if (nombre === "" || isNaN(precio) || precio <= 0) {
            throw new Error("Por favor, ingrese un nombre y un precio valido.");
        }

        const nuevoId = productosJS.length > 0 ? Math.max(...productosJS.map(p => p.id)) + 1 : 1;

        const nuevoProducto = { id: nuevoId, nombre, precio };

        productosJS.push(nuevoProducto);

        guardarLocalStorage();
        actualizarVista();

        feedback.textContent = "Producto agregado con éxito.";
        feedback.className = "mensaje-exito";

    } catch (error) {
        feedback.textContent = `⚠️ ${error.message}`;
        feedback.className = "mensaje-error";

    } finally {
        inputNombre.value = "";
        inputPrecio.value = "";
    }

});

inputBusqueda.addEventListener("keyup", (e) => {
    actualizarVista();
});

contenedorProductos.addEventListener("click", (e) => {

    if (e.target?.classList.contains("btn-eliminar")) {
        try {
            const idAEliminar = parseInt(e.target.getAttribute("data-id"));

            if (isNaN(idAEliminar)) {
                throw new Error("No se pudo identificar el producto a eliminar.")
            }

            const indice = productosJS.findIndex(p => p.id === idAEliminar);

            if (indice !== -1) {
                productosJS.splice(indice, 1);
            }

            guardarLocalStorage();


            feedback.textContent = "Producto eliminado con éxito.";
            feedback.className = "mensaje-alerta"

            actualizarVista();

        } catch (error) {
            feedback.textContent = `⚠️ ${error.message}`;
            feedback.className = "mensaje-error";
        }

    }
});