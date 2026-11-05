
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
let catalogoGlobal = [];
//credenciales

const TOKEN_AIRTABLE = 'patOoFu7Bto4pDoHo.8c9bda4c8bb84444923d14382b3a7391d99c4e19a397f54e84f8a3f6f959c0a7';
const BASE_ID = 'appZlkSjGvBFv37fA';
const TABLA = 'Productos';



//Busca los datos en la nube
async function cargarProductos() {
    const url = `https://api.airtable.com/v0/${BASE_ID}/${TABLA}`;
    const contenedor = document.querySelector('.contenedor-productos');
    if (!contenedor) return;

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


    renderizarProductos(productos);

    renderizarCarrito();

} catch (error){
    contenedor.innerHTML  = '<p class="mensaje-estado">Hubo un problema al cargar la tienda por favor intenta actualizar la pagina</p>';
}

}


//Buscador
function inicializarBuscador(){
    const contenedorBuscador = document.querySelector('.buscador');
    const btnBuscar = document.querySelector('.buscador-btn');
    const inputBusqueda = document.querySelector('.buscador-input');

    if(!contenedorBuscador || !btnBuscar || !inputBusqueda) return;
    btnBuscar.addEventListener('click', (e) =>{
     e.preventDefault();
     e.stopImmediatePropagation();

     contenedorBuscador.classList.toggle('activo');

     if(contenedorBuscador.classList.contains('activo')){
        inputBusqueda.focus();
     }else{
        inputBusqueda.value = '';
        renderizarProductos(catalogoGlobal);
     }
    });

    // filtrar en tiempo real
    inputBusqueda.addEventListener('input', (e) => {
        const termino = e.target.value.toLowerCase().trim();

        const resultados = catalogoGlobal.filter(producto => {

            const campos = producto.fields;

            const nombre = producto.fields.Nombre ? producto.fields.Nombre.toLowerCase() : '';
            
            const categorias = Array.isArray(campos.Categoria) ?
            campos.Categoria.map(cat => cat.toLowerCase()) : [];

            const coincidenciaNombre = nombre.includes(termino);
            const coincidenciaCategoria = categorias.some(cat => cat.includes(termino));

            return (coincidenciaNombre || coincidenciaCategoria);
        });

        const contenedor = document.querySelector('.contenedor-productos');
        
        if (resultados.length === 0){
          
        }else{
            renderizarProductos(resultados);
        }
    });

    //cerrar
    document.addEventListener('click', (e) =>{ 
        if(!contenedorBuscador.contains(e.target) && contenedorBuscador.classList.contains('activo'))  {
            contenedorBuscador.classList.remove('activo');
            inputBusqueda.value = '';
            renderizarProductos(catalogoGlobal);
        }      
    });

    inputBusqueda.addEventListener('click', (e) => {
        e.stopImmediatePropagation();
    });
}



//Cards
function renderizarProductos(productos){
    const contenedor = document.querySelector('.contenedor-productos');


contenedor.innerHTML = '';

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
                    <button class="agregar-carrito" onclick="agregarAlCarrito('${id}')">Agregar al carrito</button>
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

//Carrito----------------------------------------------------------------
//Agregar al carrito
function agregarAlCarrito(idProducto) {

    const selectTalle = document.getElementById('talle');
    const talleSeleccionado = selectTalle ? selectTalle.value : 'Único';
    const existe = carrito.find(item => item.id === idProducto && item.talle === talleSeleccionado);

    if(existe){
        existe.cantidad += 1;
    }else{
        carrito.push({id: idProducto, cantidad: 1, talle: talleSeleccionado});
    }

    actualizarYGuardar();
    cerrarModal();
    alert('¡El producto se agregó al carrito!');
   

};
//renderizar el carrito
function renderizarCarrito() {
     const ListaCarrito = document.getElementById('carrito-body');
     const cartCount = document.getElementById('cart-count');
     const contenedorTotal = document.getElementById('carrito-precio-total');
    const btnVaciar = document.getElementById('vaciar-carrito');
    const btnCheckout = document.querySelector('.btn-checkout');
        
    if (!ListaCarrito) return;

    ListaCarrito.innerHTML = '';
    let total = 0;



    if (carrito.length === 0) {
        ListaCarrito.innerHTML =`
        <p>Tu carrito está vacío</p>
        `
        cartCount.textContent = 0;
        cartCount.classList.remove('active');
        if (contenedorTotal) contenedorTotal.textContent = '$0';
        if (btnVaciar) btnVaciar.disabled = true;
        if (btnCheckout) btnCheckout.disabled = true;
        return;
    }
    if (btnVaciar) btnVaciar.disabled = false;
    if (btnCheckout) btnCheckout.disabled = false;
    //Contador
    if (cartCount) {
    cartCount.classList.add('active');
    const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    cartCount.textContent = totalItems;
    }

    
carrito.forEach((item, index) => {
        const prod = catalogoGlobal.find(producto => producto.id === item.id);
        if (!prod) return;

        const campos = prod.fields;

        const subtotal = campos.Precio * item.cantidad;
        total += subtotal;

        const li = document.createElement('li');

        li.className = 'carrito-item';
        li.innerHTML = `
           <img src="${campos.Imagen}" alt="${campos.Nombre}" class="carrito-item-img">
            
            <div class="carrito-item-info">
                <div class="carrito-item-titulo-precio">
                    <h3>${campos.Nombre}</h3>
                    <span class="carrito-item-precio">$${subtotal.toLocaleString('es-AR')}</span>
                </div>
                
                <p style="margin: 0; font-size: 0.85rem;">Talle: <strong>${item.talle}</strong></p>
                
                <div class="carrito-item-controles">
                    <div class="carrito-item-cantidad">
                        <button class="btn-restar" onclick="restarCantidad(${index})" ${item.cantidad === 1 ? 'disabled' : ''}>-</button>
                        <span>${item.cantidad}</span>
                        <button class="btn-sumar" onclick="sumarCantidad(${index})">+</button>
                    </div>
                    
                    <button class="btn-eliminar-item" aria-label="Eliminar ${campos.Nombre}" onclick="eliminarItem(${index})">
                        Eliminar
                    </button>
                </div>
            </div>
        `;
        
        ListaCarrito.appendChild(li);
    });
    if (contenedorTotal) {
    contenedorTotal.textContent = '$' + total.toLocaleString('es-AR');
 }
}


function cerrarFondo(event){
    if(event.target.id === 'modal-producto') {
        cerrarModal();
    }
}

function actualizarYGuardar() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
    renderizarCarrito();
}

document.addEventListener('click', (e) => {
    if(e.target.id === 'vaciar-carrito'){
        carrito = [];
        actualizarYGuardar();
    }
});

// Sumo cantidad de un producto 
function sumarCantidad(index) {
    if (carrito[index]) {
        carrito[index].cantidad += 1;
        actualizarYGuardar();
    }
}

// Resto cantidad de un producto 
function restarCantidad(index) {
    if (carrito[index] && carrito[index].cantidad > 1) {
        carrito[index].cantidad -= 1;
        actualizarYGuardar();
    }
}

// Eliminar un producto
function eliminarItem(index) {
    carrito.splice(index, 1);
    actualizarYGuardar();
}

// Filtrado
function filtrarPorCategoria(categoria) {
    if (categoria === 'todas') {
        renderizarProductos(catalogoGlobal);
        return;
    }

    const termino = categoria.toLowerCase();
    const filtrados = catalogoGlobal.filter(producto => {
        const campos = producto.fields;
        const nombre = campos.Nombre ? campos.Nombre.toLowerCase() : '';
        const categorias = Array.isArray(campos.Categoria)
            ? campos.Categoria.map(cat => cat.toLowerCase())
            : (campos.Categoria ? [String(campos.Categoria).toLowerCase()] : []);

        return categorias.some(cat => cat.includes(termino)) || nombre.includes(termino);
    });

    renderizarProductos(filtrados);
}


document.addEventListener('DOMContentLoaded', () =>{
    cargarProductos();
    inicializarBuscador();
    inicializarCheckout();

});

// ckeckout
function inicializarCheckout() {
    const form = document.getElementById('form-checkout');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        
        const nombre = document.getElementById('nombre').value.trim();
        const apellido = document.getElementById('apellido').value.trim();
        const email = document.getElementById('email').value.trim();
        const telefono = document.getElementById('telefono').value.trim();
        const direccion = document.getElementById('direccion').value.trim();
        const ciudad = document.getElementById('ciudad').value.trim();
        const cp = document.getElementById('codigo-postal').value.trim();

       
        document.querySelectorAll('.mensaje-error').forEach(el => el.textContent = '');

        let esValido = true;
        const soloNumeros = /^[0-9]+$/;
        const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (nombre.length < 3) {
            document.getElementById('error-nombre').textContent = 'Ingresá tu nombre (mínimo 3 letras).';
            esValido = false;
        }

        if (apellido.length < 3) {
            document.getElementById('error-apellido').textContent = 'Ingresá tu apellido (mínimo 3 letras).';
            esValido = false;
        }

        if (!formatoEmail.test(email)) {
            document.getElementById('error-email').textContent = 'Ingresá un formato de email válido (ej: usuario@correo.com).';
            esValido = false;
        }

        if (!soloNumeros.test(telefono) || telefono.length < 8) {
            document.getElementById('error-telefono').textContent = 'El teléfono debe contener solo números (mínimo 8 dígitos).';
            esValido = false;
        }

        if (direccion.length < 5) {
            document.getElementById('error-direccion').textContent = 'Ingresá una dirección válida (mínimo 5 caracteres).';
            esValido = false;
        }

        if (ciudad.length < 3) {
            document.getElementById('error-ciudad').textContent = 'Ingresá tu ciudad (mínimo 3 caracteres).';
            esValido = false;
        }

        if (!soloNumeros.test(cp) || cp.length < 4) {
            document.getElementById('error-cp').textContent = 'El código postal debe ser numérico (mínimo 4 dígitos).';
            esValido = false;
        }

      
        if (esValido) {
            const contenedorDatos = document.getElementById('datos-confirmacion');
            contenedorDatos.innerHTML = `
                <p><strong>Nombre y Apellido:</strong> ${nombre} ${apellido}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Teléfono:</strong> ${telefono}</p>
                <p><strong>Dirección:</strong> ${direccion}</p>
                <p><strong>Ciudad:</strong> ${ciudad} (CP: ${cp})</p>
            `;

            const modalConfirmacion = document.getElementById('modal-confirmacion');
            modalConfirmacion.hidden = false;

            // limpio el carrito
            carrito = [];
            localStorage.removeItem('carrito');
        }
    });
}