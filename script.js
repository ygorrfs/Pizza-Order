let modalQt = 1;
let cart = [];
let modalKey = 0;

const c = (el) => document.querySelector(el);
const cs = (el) => document.querySelectorAll(el);

/* listagem de pizzas */
pizzaJson.map((item, index) => {
    let pizzaItem = c('.models .pizza-item').cloneNode(true); /* clona */

    pizzaItem.setAttribute('data-key', index);
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
    pizzaItem.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault();
        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        modalQt = 1;
        modalKey = key;

        c('.pizzaBig img').src = pizzaJson[key].img;
        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;

        c('.pizzaInfo--actualPrice').innerHTML = `$ ${pizzaJson[key].price.toFixed(2)}`;

        c('.pizzaInfo--size.selected').classList.remove('selected');

        cs('.pizzaInfo--size').forEach((size, sizeIndex) => {
            if (sizeIndex == 0) {
                size.classList.add('selected');
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
            size.addEventListener('click', () => {
                c('.pizzaInfo--size.selected').classList.remove('selected');
                size.classList.add('selected');

                const selectedSize = sizeIndex;
                let pricePizza = parseFloat(pizzaJson[modalKey].price);
                if (selectedSize === 1) {
                    pricePizza = pricePizza * 1.8;
                } else if (selectedSize === 2) {
                    pricePizza = pricePizza * 2.8;
                }

                c('.pizzaInfo--actualPrice').innerHTML = `$ ${pricePizza.toFixed(2)}`;
            });
        });

        c('.pizzaInfo--qt').innerHTML = modalQt;
        c('.pizzaWindowArea').style.opacity = 0;
        c('.pizzaWindowArea').style.display = 'flex';
        setTimeout(() => {
            c('.pizzaWindowArea').style.opacity = 1;
        }, 200);

    });

    c('.pizza-area').append(pizzaItem);
});


/* eventos do modal */

const closeModal = () => {
    c('.pizzaWindowArea').style.opacity = 0;
    setTimeout(() => {
        c('.pizzaWindowArea').style.display = 'none';
    }, 500);

}

cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item) => {
    item.addEventListener('click', closeModal);
})

/* quantidade de itens */

c('.pizzaInfo--qtmenos').addEventListener('click', () => {
    if (modalQt > 1) {
        modalQt--;
        c('.pizzaInfo--qt').innerHTML = modalQt;
    }
});

c('.pizzaInfo--qtmais').addEventListener('click', () => {
    modalQt++;
    c('.pizzaInfo--qt').innerHTML = modalQt;
});

/* tamanho da pizza */

cs('.pizzaInfo--size').forEach((size, sizeIndex) => {
    size.addEventListener('click', (e) => {
        c('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    });
});

/* adicionar ao carrinho */

c('.pizzaInfo--addButton').addEventListener('click', () => {

    let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));
    let identifier = pizzaJson[modalKey].id + '@' + size;
    let key = cart.findIndex((item) => {
        return item.identifier == identifier;
    });

    if (key > -1) {
        cart[key].qt += modalQt;
    } else {
        cart.push({
            identifier,
            id: pizzaJson[modalKey].id,
            size,
            qt: modalQt
        });
    }
    updateCart();
    closeModal();

});

const updateCart = () => {

    /* menu mobile */
    c('.menu-openner span').innerHTML = cart.length;

    c('.menu-openner').addEventListener('click', () => {
        if (cart.length > 0) {
            c('aside').style.left = '0';
        }
    })
    c('.menu-closer').addEventListener('click', () => {
        c('aside').style.left = '100vw';
    })

    if (cart.length > 0) {
        c('aside').classList.add('show');
        c('.cart').innerHTML = '';

        let itemPrice = 0;
        let subtotalItem = 0;
        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        for (let i in cart) {
            let pizzaItem = pizzaJson.find((item) => {
                return item.id == cart[i].id;
            });

            itemPrice = pizzaItem.price * cart[i].qt;

            let pizzaSize;
            switch (cart[i].size) {
                case 0:
                    pizzaSize = 'P';
                    subtotalItem = itemPrice;
                    break;
                case 1:
                    pizzaSize = 'M';
                    subtotalItem = itemPrice * 1.8;
                    break;
                case 2:
                    pizzaSize = 'G';
                    subtotalItem = itemPrice * 2.8;
                    break;
            }

            let cartItem = c('.models .cart--item').cloneNode(true);
            let pizzaName = `${pizzaItem.name} (${pizzaSize})`;

            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
                if (cart[i].qt > 1) {
                    cart[i].qt--;
                } else {
                    cart.splice(i, 1);
                }
                updateCart();
            })
            cartItem.querySelector('.cart--item--remove').addEventListener('click', () => {
                cart.splice(i, 1);
                updateCart();

            })
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
                cart[i].qt++;
                updateCart();
            })
            cartItem.querySelector('.cart--subtotal').innerHTML = `$ ${subtotalItem.toFixed(2)}`;
            c('.cart').append(cartItem);

            subtotal += subtotalItem;
        }


        desconto = subtotal * 0.1;
        total = subtotal - desconto;
        c('.cart--subtotal span:last-child').innerHTML = `$ ${subtotalItem.toFixed(2)}`;
        c('.subtotal span:last-child').innerHTML = `$ ${subtotal.toFixed(2)}`;
        c('.desconto span:last-child').innerHTML = `$ ${desconto.toFixed(2)}`;
        c('.total span:last-child').innerHTML = `$ ${total.toFixed(2)}`;

    } else {
        c('aside').classList.remove('show');
        c('aside').style.left = '100vw';
    }
}