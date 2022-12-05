// sauvegarder le localstorage
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Recuperer le panier stocker dans le localstorage
function getCart() {
  let cart = localStorage.getItem("cart")
  if(cart == null) {
      return [];
  } else {
      return JSON.parse(cart);
  }
}

// supprimer un article du papnier
function removeArticle(id, colors) {
  let cart = getCart();
  cart = cart.filter(a => a.id != id && a.colors != colors);
  saveCart(cart)
}



// Recuperer chaque article present dans le panier (des que l'on recoit le panier)
async function getAllArticle() {
  // on attend le resultat de getCart()
  const cart = await getCart();
  let allCartItems = "";

  // pour chaque article dans le panier on effectue une requete (get) pour recuperer le details
  for (let article of cart) {

    fetch(`http://localhost:3000/api/products/${article.id}`)
      .then(function(res) {
        if(res.ok) {
          return res.json()
        }
      })

    // une fois les details recupérer on stocke le tout dans une variable
    .then(function(value) {
      allCartItems += `
        <article class="cart__item" data-id="${article.id}" data-color="${article.colors}">
          <div class="cart__item__img">
            <img src="${value.imageUrl}" alt="${value.altTxt}">
          </div>
          <div class="cart__item__content">
            <div class="cart__item__content__description">
              <h2>${value.name}</h2>
              <p>${article.colors}</p>
              <p>${value.price} €</p>
            </div>
            <div class="cart__item__content__settings">
              <div class="cart__item__content__settings__quantity">
                <p>Qté : </p>
                <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${article.quantity}">
              </div>
              <div class="cart__item__content__settings__delete">
                <p class="deleteItem">Supprimer</p>
              </div>
            </div>
          </div>
        </article>`;
        return allCartItems;
    })

    // on appelle la variable dès que les valeurs sont stockées
    .then(function() {
      return document
              .getElementById("cart__items")
              .innerHTML = allCartItems;
    })

    // on affiche un message en cas d'erreur
    .catch(function(err) {
      alert("Une erreur est survenue : \n .catch : " + err);
    })
  }
}
// enfin on appelle la fonction pour afficher le panier
getAllArticle();


// --------------- POUR AFFICHER LE NOMBRE TOTAL D'ARTICLE ------------


// on defini de maniere asynchrone la fonction permettant l'affichage de la quantité total
async function getNumberArticle() {

  // on attend le resultat de getCart()
  let cart = await getCart();
  let totalQuantity = 0;

  // pour chaque article présent dans le panier on récupère les quantitées pour les additionner dans une variable
  for (let article of cart) {
    totalQuantity += parseInt(article.quantity);
  }

  // on retourne la variable contenant le total des quantitées dans le DOM
  return document.getElementById("totalQuantity").textContent = totalQuantity;
}

// on appelle la fonction pour afficher son résultat
getNumberArticle()

// ------------- POUR AFFICHER LE PRIX TOTAL --------------

// on defini de maniere asynchrone la fonction permettant l'affichage du prix total
async function getTotalPrice() {

  // on attend le resultat de getCart()
  let cart = await getCart();
  let totalPrice = 0;

  // pour chaque article présent dans le panier on récupère les prix stockés dans l'API
  for (let article of cart) {

    fetch(`http://localhost:3000/api/products/${article.id}`)
    .then(function(res) {
      if(res.ok) {
        return res.json();
      }
    })
    
    // ensuite on pour chaque article présent dans le panier on multiplie son prix par sa quantité
    // puis on additionne le tout dans une variable
    .then(function(product) {
      totalPrice += parseInt(product.price)*parseInt(article.quantity);
      return totalPrice;
    })

    // on déclare la variable dans le DOM
    .then(function() {
      return document.getElementById("totalPrice").textContent = totalPrice;
    })

    // on affiche un message en cas d'erreur
    .catch(function(err) {
      alert("Une erreur est survenue : \n .catch : " + err);
    })
  }
}

// on appelle la variable pour afficher le résultat
getTotalPrice();
