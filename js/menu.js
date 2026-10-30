// document.addEventListener('DOMContentLoaded', () => {
//     const btnBusqueda = document.getElementById('buscador-btn');
//     const contenedorBusqueda = document.getElementById('buscador-contenedor');
//     const inputBusqueda = document.getElementById('buscador-input');


//     if(btnBusqueda && contenedorBusqueda){
//         btnBusqueda.addEventListener('click', (e) =>{
//             if(contenedorBusqueda.classList.contains('activo') && inputBusqueda.value.trim() !== ""){
//                 console.log("Buscando: ", inputBusqueda.value);
//                 return
//             }

//             e.stopPropagation();


//             contenedorBusqueda.classList.toggle('activo');

//             if (contenedorBusqueda.classList.contains('activo')){
//                 inputBusqueda.focus();
//             }
//         });

//         document.addEventListener('click', (e) =>{
//             if(!contenedorBusqueda.contains(e.target)){
//                 contenedorBusqueda.classList.remove('activo')
//             }
//         });
//     }

// });