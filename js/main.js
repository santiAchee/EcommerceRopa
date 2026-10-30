//credenciales

const TOKEN_AIRTABLE = 'patOoFu7Bto4pDoHo.8c9bda4c8bb84444923d14382b3a7391d99c4e19a397f54e84f8a3f6f959c0a7';
const BASE_ID = 'appZlkSjGvBFv37fA';
const TABLA = 'Productos';


//Busca los datos en la nube
async function cargarProductos() {
    const url = `https://api.airtable.com/v0/${BASE_ID}/${TABLA}`;
    const contenedor = document.querySelector('.contenedor-productos');

try{
    contenedor.innerHTML = '<p class="mensaje-estado">Cargando Catálogo...</p>'

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
         <article class="card-producto" data-id="${id}" >
                <div class="pagina"></div>
                <img src="${campos.Imagen}" alt="${campos.Nombre}">
                <h3>Mundo Ropa</h3>
                <h2>${campos.Nombre}</h2>
                <p class="precio">${campos.Precio}</p>

                <button class="btn btn-addFavorito"><span>favorito</span></button>

                <button class="btn btn-addCarrito"><span>Carrito</span></button>

                <a href="#" onclick="abrirModalProducto('${id}'); return false;">Ver Detalle del Producto.</a>
            </article>
        `;
        contenedor.innerHTML += cardHTML;
    });
}

document.addEventListener('DOMContentLoaded', () =>{
    cargarProductos();
});