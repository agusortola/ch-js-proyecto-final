
let dataBase;
let cart = [];
$(async function (){
    const openCart = document.querySelector('.i-carrito');
    openCart.addEventListener('click', function() {
        document.getElementById('sidebar').classList.toggle('active');
    });

    dataBase = await getData();
    async function getData(){
        const response = await fetch("database.json");
        const json = await response.json();
        return json;
    };

    showCart(); //Muestra los productos cargados en el carrito con el localStorage
    let productsInPage = ``
    for (let i = 0; i < dataBase.length; i++){
        let product = dataBase[i];
        productsInPage += `
            <div class= "product-card" id="product-card" style= "grid-area: area-${i};">
                <img class= "foto-prod" src= "${product.img}"> 
                <h2 class="h2">${product.name}</h2>
                <h2 class="price">60ml $${product.price}</h2> 
                <button id= 'btn-${i}' class= "botonComprar" onclick = 'addToCart("${product.name}", 1, "${product.price}")'>Añadir.</button>
            </div>
            `;
    }
    $("#product-grid").html(productsInPage);

    const searchBar = document.getElementById('searchbar'); //Barra para buscar productos! (filtro)
    searchBar.addEventListener('input', searchForProducts);
    function searchForProducts(){
        productsInPage = ``;
        var newGridArea = 0;
        for (let i = 0; i < dataBase.length; i++){
            product = dataBase[i];
            if (product.name.toLowerCase().startsWith(searchBar.value.toLowerCase())){   
                productsInPage += `
                    <div class= "product-card" id="product-card" style= "grid-area: area-${newGridArea};">
                        <img class= "foto-prod" src= "${product.img}"> 
                        <h2 class="h2">${product.name}</h2>
                    <h2 class="price">60ml $${product.price}</h2> 
                        <button id= 'btn-${i}' class= "botonComprar" onclick = 'addToCart("${product.name}", 1, "${product.price}")'>Añadir.</button>
                    </div>
                    `;    
                $("#product-grid").html(productsInPage);
                newGridArea++
            };
        };
    };
});
    
function filterByCategory(cat){  
    productsInPage = ``;
    var newGridArea = 0;
    for (let i = 0; i < dataBase.length; i++){
    product = dataBase[i];
    if (cat == "all"){
        productsInPage += `
                <div class= "product-card" id="product-card" style= "grid-area: area-${newGridArea};">
                    <img class= "foto-prod" src= "${product.img}"> 
                    <h2 class="h2">${product.name}</h2>
                <h2 class="price">60ml $${product.price}</h2> 
                    <button id= 'btn-${i}' class= "botonComprar" onclick = 'addToCart("${product.name}", 1, "${product.price}")'>Añadir.</button>
                </div>
                `;    
            $("#product-grid").html(productsInPage);
            newGridArea++
    }; 
    if (product.cat == cat){   
    productsInPage += `
                <div class= "product-card" id="product-card" style= "grid-area: area-${newGridArea};">
                    <img class= "foto-prod" src= "${product.img}"> 
                    <h2 class="h2">${product.name}</h2>
                <h2 class="price">60ml $${product.price}</h2> 
                    <button id= 'btn-${i}' class= "botonComprar" onclick = 'addToCart("${product.name}", 1, "${product.price}")'>Añadir.</button>
                </div>
                `;    
            $("#product-grid").html(productsInPage);
            newGridArea++
        };
    }
};

function addToCart(value, qty, price){   
    var product = findProductByName(value, dataBase);
    if (product != null){
        var productInCart = findProductByName(value, cart);
        if (productInCart == null){ 
            let productoAñadido = new ProductInCart(`${value}`, qty, price);
            cart.push(productoAñadido);
        } else {
            productInCart.addQty(qty);
        }
        localStorage.setItem('carrito', JSON.stringify(cart));
        showCart();
    };
};

function findProductByName(value, list){ 
    var encontrado = null;
    let i = 0; 
    while (encontrado == null && i < list.length){ //mientras que encontrado sea nulo y la i sea menor a la longitud de la base de datos de productos, segui buscando!
        var product = list[i]; 
        if (product.name == value) { // si el value es igual al nombre de algun producto, encontrado deja de ser nulo y pasa a ser ese producto (un objeto!!!)
            encontrado = product;
        }
        i++;
    }
    return encontrado; //siempre devuelve encontrado, que puede seguir siendo nulo o un producto.
};

const listaCompra = document.querySelector('#lista-carrito tbody');
function showCart() {   
    listaCompra.innerHTML = "";
    let cart = JSON.parse(localStorage.getItem('carrito'));
    var purchaseTotal = 0;
    var itemTotal = 0;
    if (cart != null) {
        for (let i = 0; i < cart.length; i++){     
            const row = document.createElement('tr');  
            let productoAñadido = cart[i];
            row.id = productoAñadido.name;
            row.innerHTML = `
                <td>${productoAñadido.name} </td>
                <td><input id='item-${i}' class= "inp"  value="${productoAñadido.qty}" onchange='addToCart("${productoAñadido.name}", Number (this.value - "${productoAñadido.qty}"))' type="number" min="0"></td>
                <td> $${productoAñadido.qty*findProductByName(productoAñadido.name, dataBase).price} </td>
                <td><button id='btn-remove-${i}' class="btn-remove" onclick='removeItemFromCart("${productoAñadido.name}")'>X</button></td>
            `;
            listaCompra.appendChild(row);
            var precioProducto = findProductByName(productoAñadido.name, dataBase).price;
            purchaseTotal += precioProducto * productoAñadido.qty;
            itemTotal += productoAñadido.qty;
        };
    };
    $("#precio-tot").html(`$${purchaseTotal}`);
    $("#cant-tot").html(`${itemTotal}`);
};

function clearCart(){
    cart.length = 0;    
    listaCompra.innerHTML = "";
    localStorage.clear('carrito');
    showCart();
};

function removeItemFromCart(name){   
    var cartItem = document.getElementById(name); //el row que muestra el item en el carrito tiene el nombre del producto como id
    cartItem.remove(); 
    var productInCart = findProductByName(name, cart);
    var index = cart.indexOf(productInCart);
    cart.splice(index,1);
    localStorage.removeItem('carrito');
    localStorage.setItem('carrito', JSON.stringify(cart));
    showCart();
};

function mapCartToMPCheckout(){
    return cart.map(product => product.toMPProduct());
}

function goToMPCheckOut(){
    const items = mapCartToMPCheckout();
    $.ajax({
        url: 'https://api.mercadopago.com/checkout/preferences?access_token=APP_USR-6240986439270148-030515-c0c1f6f69c6ee05d332aa50bc3eaadab-165975148',
        type: 'POST',
        data: JSON.stringify({
            items,
        }),
        headers: {
            'Content-Type': 'application/json',
        },
        success : function(data){
            window.open(`https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=${data.id}`)
        }
    });
};