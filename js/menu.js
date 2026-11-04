const primaryCart = document.querySelector('.carrito-lateral');
const cartToggle = document.querySelector('.carrito-comprar');
const closeCart = document.querySelector('.btn-cerrar-carrito');
const CloseAll = document.querySelector('.close-all');

///carrito
if(cartToggle && primaryCart){
cartToggle.addEventListener('click', (e) => {
    e.preventDefault();

   primaryCart.classList.add('abierto');
   primaryCart.setAttribute('aria-hidden', 'false');

   if (CloseAll) {
    CloseAll.classList.add('activo');
   }
    


    document.body.classList.add('no-scroll');//pausar el scroll de la pagina
});
};

//cerrar carrito
function cerrarCarrito() {
    if (primaryCart) {
        primaryCart.classList.remove('abierto');
        primaryCart.setAttribute('aria-hidden', 'true');
}
if (CloseAll) {
    CloseAll.classList.remove('activo');
}
document.body.classList.remove('no-scroll');//volver a poner el scroll de la pagina
}

if (closeCart) {
    closeCart.addEventListener('click', cerrarCarrito);
}
if (CloseAll) {
    CloseAll.addEventListener('click', cerrarCarrito);
}




