const carrito = document.querySelector('#carrito');
const listaProductos = document.querySelector('#lista-productos');
const contenedorCarrito = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito');
let articulosCarrito = [];

//obtener datos desde archivo JSON
obtenerDatos();
function obtenerDatos() {
     fetch('./js/catalogo.json')
          .then(respuesta => {
               return respuesta.json()
          })
          .then(resultado => {
               mostrarHTML(resultado);
               //console.log(resultado)
          })
}

function mostrarHTML(catalogo) {
     const contenido = document.querySelector('#prod');

     let products = '';

     catalogo.forEach(catalogo => {
          const { id, name, autor, tag, img, price, inCart } = catalogo;

          products += `
                    <div class="card">
                         <img ${img}>
                              <div class="info-card">
                                   <h4>${name}</h4>
                                   <p>${autor}</p>
                                   <img src="img/estrellas.png">
                                   <p class="precio">$200 <span class="u-pull-right ">$ ${price}</span></p>
                                   <a href="#" class="u-full-width button-primary button input agregar-carrito" data-id="${id}">Agregar Al Carrito</a>
                              </div>
                    </div>`
     });

     contenido.innerHTML = products;

}

// Listeners
cargarEventListeners();

function cargarEventListeners() {
     listaProductos.addEventListener('click', agregarProducto);

     carrito.addEventListener('click', eliminarProducto);

     vaciarCarritoBtn.addEventListener('click', vaciarCarrito);
     
     document.addEventListener('DOMContentLoaded', () => {
          articulosCarrito = JSON.parse( localStorage.getItem('carrito') ) || []  ;
          carritoHTML();
     });
     //en caso de que no haya nada se pone el arreglo vacio con  || []
}

// Función que añade el producto al carrito
function agregarProducto(e) {
     e.preventDefault();
     if (e.target.classList.contains('agregar-carrito')) {
          const producto = e.target.parentElement.parentElement;
          // Enviamos el producto seleccionado para tomar sus datos
          leerDatosProducto(producto);
     }
}

// Lee los datos del producto
function leerDatosProducto(producto) {
     const infoProducto = {
          imagen: producto.querySelector('img').src,
          titulo: producto.querySelector('h4').textContent,
          precio: producto.querySelector('.precio span').textContent,
          id: producto.querySelector('a').getAttribute('data-id'),
          cantidad: 1
     }

     if (articulosCarrito.some(producto => producto.id === infoProducto.id)) {
          const productos = articulosCarrito.map(producto => {
               if (producto.id === infoProducto.id) {
                    producto.cantidad++;
                    return producto;
               } else {
                    return producto;
               }
          })
          articulosCarrito = [...productos];
     } else {
          articulosCarrito = [...articulosCarrito, infoProducto];
     }

     //console.log(articulosCarrito)
     carritoHTML();
}

// Elimina el producto del carrito en el DOM
function eliminarProducto(e) {
     e.preventDefault();
     if (e.target.classList.contains('borrar-producto')) {
          const producto = e.target.parentElement.parentElement;
          const productoId = e.target.getAttribute('data-id')

          // Eliminar del arreglo del carrito
          articulosCarrito = articulosCarrito.filter(producto => producto.id !== productoId);

          carritoHTML();
     }
}

// Muestra el producto seleccionado en el Carrito
function carritoHTML() {

     vaciarCarrito();

     articulosCarrito.forEach(producto => {
          const row = document.createElement('tr');
          row.innerHTML = `
               <td>  
                    <img src="${producto.imagen}" width=100>
               </td>
               <td>${producto.titulo}</td>
               <td>${producto.precio}</td>
               <td>${producto.cantidad} </td>
               <td>
                    <a href="#" class="borrar-producto" data-id="${producto.id}">X</a>
               </td>
          `;
          contenedorCarrito.appendChild(row);
     });
     
//carro en localstorage
carroLocalStorage ();
}
function carroLocalStorage() {
     localStorage.setItem('carrito', JSON.stringify(articulosCarrito));
}

// Elimina
function vaciarCarrito() {
     localStorage.clear();
     contenedorCarrito.innerHTML = '';
}

