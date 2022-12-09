/* Dans un premier temps on defini tout les fonctions nous permettant de pouvoir afficher les articles sur la page
panier ou changer directement les articles dans le localStorage */



// sauvegarder le localstorage
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Recuperer le panier stocker dans le localstorage
function getCart() {
  let cart = localStorage.getItem("cart");
  if(cart == null) {
      return [];
  } else {
      return JSON.parse(cart);
  }
}

/* function getCart1() {
  let cart = localStorage.getItem("cart");
  return (cart != null) ? JSON.parse(cart) : [];
} */

// supprimer un article du papnier



function removeArticle(article) {
  let cart = getCart();
  cart = cart.filter(a => (a.id !== article.dataset.id || a.colors != article.dataset.color));
  saveCart(cart);
}



// Recuperer chaque article present dans le panier (des que l'on recoit le panier)
async function displayAllArticle() {
  // on attend le resultat de getCart()
  const cart = await getCart();

  let allCartItems = "";
  if (cart == []) {
    alert("votre panier est vide");
  }
  
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
displayAllArticle();




/* ----------------------------- La deuxieme étape -------------------------------
pouvoir calculer, à partir des articles dans le local storage, la quantité d'article ainsi que leur prix total */





//--------------- POUR AFFICHER LE NOMBRE TOTAL D'ARTICLE ------------



// on defini de maniere asynchrone la fonction permettant l'affichage de la quantité total
async function displayNumberArticle() {

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
displayNumberArticle()









// ------------- POUR AFFICHER LE PRIX TOTAL --------------





// on defini de maniere asynchrone la fonction permettant l'affichage du prix total
async function displayTotalPrice() {

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
displayTotalPrice();








/* ------------------------------------ 3eme etape ----------------------------------
Pouvoir supprimer ou changer la quantité d'un article depuis la page panier */


let deleteButtonCollection = document.getElementsByClassName("deleteItem");
let quantityCollection = document.getElementsByClassName("itemQuantity");
let itemArticle = document.querySelectorAll(".cart__item");
let name = document.getElementsByTagName("h2");

// modifier la quantité 

function changeQuantity(article, quantity) {
  // condition avant ajout au panier
  if (quantity.value < 1 || quantity.value > 100) {
      alert("erreur sur la quantité \nselon stock disponible (1-100)")
  }
  else {
      // recupere les articles stockés et verifie si ils y sont deja
      let cart = getCart()
      let foundArticle = cart.find(a => a.id == article.dataset.id && a.colors == article.dataset.color)

      // change la quantité de l'article
      if (foundArticle != undefined) {
          foundArticle.quantity = parseInt(quantity.value);
          if (foundArticle.quantity > 100) { 
                  foundArticle.quantity = 100;
                  alert("stock limité à 100");
          }
      saveCart(cart)
      alert("changement de quantité effectué")
    }
  }
}

// ajoute un Event "change" sur 'input .itemQuantity'
setTimeout(function addEventChange() {
  for (let i in quantityCollection) {

    // pour chaque input => selection de son article
    let article = quantityCollection.item(i).closest("article");

    // ajout de l'event
    quantityCollection.item(i).addEventListener("change", function(e) {
      e.preventDefault();
      e.stopImmediatePropagation();

      // on appele la fonction qui change la quantité puis on actualise le total des articles et le prix total de la commande
      changeQuantity(article, quantityCollection.item(i));
      displayNumberArticle();
      displayTotalPrice();
    })
  }
}, 1500)


// ajoute un Event "click" qui permet de suprimer un article sur 'p .deleteItem' si c'est confirmer


setTimeout(function addEventDelete() {
    for (let i in deleteButtonCollection) {

      // pour chaque 'p .deleteItem' => selection de l'article pour recuperer les data-id et data-color
      let article = deleteButtonCollection.item(i).closest("article");

      // on récupère le nom du produit
      let name = document.getElementsByTagName("h2").item(i);

      // ajout de l'event
      deleteButtonCollection.item(i).addEventListener("click", function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        let isExecuted = confirm("Etes vous sûr de vouloir supprimer ce produit ?")
        if (isExecuted == true) {
          // appelle de la fonction qui permet de supprimer un article puis on actualise la page
          removeArticle(article);
          location.reload();

          
        // on affiche une alerte pour indiquer quel produit a été supprimé
        alert(`L'article ${name.outerText} de couleur ${article.dataset.color} a bien été supprimé`);
        }
      })
    }
}, 1500)





/* -------------------------------------- VALIDATION DU FORMULAIRE ------------------------------ */
// définir les variable ciblant les inputs du HTML

let firstName = document.getElementById("firstName");
let lastName = document.getElementById("lastName");
let address = document.getElementById("address");
let city = document.getElementById("city");
let email = document.getElementById("email");



// definir les fonctions verifiant les entrées des inputs et les intégrer aux HTML


// vérifie nom, prénom, ville

function isValidName(input) {
return /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]{2,30}$/i.test(input);
}



// vérifie email
function isValidEmail(input) {
  return  /^[0-9a-z._-]+@{1}[0-9a-z.-]{2,}[.]{1}[a-z]{2,5}$/i.test(input);
}

// vérifie adresse
function isValidAddress(input) {
  return /^[a-zA-Z0-9À-ÖØ-öø-ÿ,'-\s]*$/i.test(input);
}




// on ajoute les event "change" sur chaque input pour verifier la validité des entrées


// pour le Prénom
firstName.addEventListener("change", function() {
  let msgErr = document.getElementById("firstNameErrorMsg")
  if (isValidName(firstName.value) == false) {
    msgErr.innerText = `${firstName.value} n'est pas un prénom valide`;
  } else {
    msgErr.textContent = "Prénom valide";
  }
})


// pour le nom
lastName.addEventListener("change", function() {
  let msgErr = document.getElementById("lastNameErrorMsg");
  if (isValidName(lastName.value) == false) {
    msgErr.innerText = `${lastName.value} n'est pas un nom valide`;
  } else {
    msgErr.textContent = "Nom valide";
  }
})


// pour la ville
city.addEventListener("change", function() {
  let msgErr = document.getElementById("cityErrorMsg");
  if (isValidName(city.value) == false) {
    msgErr.innerText = `${city.value} n'est pas une ville valide`;
  } else {
    msgErr.textContent = `Ville valide`
  }
})

// pour l'adresse
address.addEventListener("change", function() {
  let msgErr = document.getElementById("addressErrorMsg");
  if (isValidAddress(address.value) == false) {
    msgErr.innerText = `${address.value} n'est pas une adresse valide`
  } else {
    msgErr.innerText = "Adresse valide"
  }
})

// pour l'email
email.addEventListener("change", function() {
  let msgErr = document.getElementById("emailErrorMsg");
  if (isValidEmail(email.value) == false) {
    msgErr.innerText = `${email.value} n'est pas une email valide`
  } else {
    msgErr.innerText = "email valide"
  }
})