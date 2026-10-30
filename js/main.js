//credenciales

const TOKEN_AIRTABLE = 'patOoFu7Bto4pDoHo.8c9bda4c8bb84444923d14382b3a7391d99c4e19a397f54e84f8a3f6f959c0a7';
const BASE_ID = 'appZlkSjGvBFv37fA';
const TABLA = 'Productos';


let catalogoGlobal = [];

//Busca los datos en la nube
async function cargarProductos() {
    const url = `https://api.airtable.com/v0/${BASE_ID}/${TABLA}`;
    const contenedor = document.querySelector('.contenedor-productos');

try{

    const respuesta = await fetch(url, {
        headers: {
            'Authorization' : `Bearer ${TOKEN_AIRTABLE}` }
    });

    if (!respuesta.ok) throw new Error('Error al conectar con la api de Airtable');

    const data = await respuesta.json();
    const productos = data.records;

    if(productos.length === 0) {
        contenedor.innerHTML = '<p class="mensaje-estado">No hay productos disponibles en este momento, lo lamentamos mucho</p>';
        return;
    }

    catalogoGlobal = productos;


    renderizarProductos(productos)

} catch (error){
    contenedor.innerHTML  = '<p class="mensaje-estado">Hubo un problema al cargar la tienda por favor intenta actualizar la pagina</p>';
}

}






//Cards
function renderizarProductos(productos){
    const contenedor = document.querySelector('.contenedor-productos');

    productos.forEach(producto => {
        const campos = producto.fields;
        const id = producto.id;

        const cardHTML = `
         <article class="card-producto" data-id="${id}" onclick="abrirModalProducto('${id}')" style="cursor: pointer">
                <div class="pagina"></div>
                <img src="${campos.Imagen}" alt="${campos.Nombre}">
                <h3>Mundo Ropa</h3>
                <h2>${campos.Nombre}</h2>
                <p class="precio">$${campos.Precio}</p>

            </article>
        `;
        contenedor.innerHTML += cardHTML;
    });
}

//modal
function abrirModalProducto(id) {
    const producto = catalogoGlobal.find(item => item.id === id);
    if (!producto) return;

    const campos = producto.fields;


    const modalHTML = `
    <!--Modal del producto-->
     <section id="modal-producto" class="modal-overlay" aria-label="Detalles del producto" onclick="cerrarFondo(event)">
      <div class="modal-contenido">
        <button class="btn-cerrar" onclick="cerrarModal()" aria-label="cerrar-modal"><span class="sr-only">Cerrar modal</span></button>
        <div class="modal-body">
            <img src="${campos.Imagen}" alt="${campos.Nombre}" class="modal-imagen">
            <!-- informacion -->
            <div class="modal-info">
                <h2>${campos.Nombre}</h2>
                <p>${campos.Descripcion}.</p>
                <p class="precio">$${campos.Precio}</p>
                 <!-- Selector de talles -->
                 <div class="selector-talle">
                <label for="talle">Seleccionar talle:</label>
                <select name="talle" id="talle">
                    <option value="xs">XS</option>
                    <option value="s">S</option>
                    <option value="m">M</option>
                    <option value="l">L</option>
                    <option value="xl">XL</option>
                </select>
                </div>


                <!-- Botones de agregar al carrito y a favoritos -->
                <div class="producto-acciones">
                    <button class="agregar-carrito">Agregar al carrito</button>
                    <button class="agregar-fav"><span class="sr-only">Agregar a favoritos</span></button>
            </div>

        </div>

      </div>
      </section>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

//cerrar modal
function cerrarModal() {
    const modal = document.getElementById('modal-producto');
    if(modal) {
        modal.remove();
    }

}

function cerrarFondo(event){
    if(event.target.id === 'modal-producto') {
        cerrarModal();
    }
}


document.addEventListener('DOMContentLoaded', () =>{
    cargarProductos();
});