// 1ere etape - recupérer l'id d'un produit avec URLSEARCHPARAMS
// 2eme etape - recupérer le produit a afficher a l'aide de son ID
// 3eme etape - insérer les valeurs du produits dans le DOM


// 1ere etape
let url = new URL(window.location.href);
let numberId = url.searchParams.get("id");


// 2eme etape
fetch('http://localhost:3000/api/products/'+numberId)
    .then (function(res) {
        if(res.ok) {
        return res.json();
        }
    })

// 3eme etape
    .then (function(value) {
        document.querySelector('.item__img').innerHTML = `<img src="${value.imageUrl}" alt="${value.altTxt}">`
        document.getElementById('title').textContent = `${value.name}`
        document.getElementById('price').textContent = `${value.price}`
        document.getElementById('description').textContent = `${value.description}`
        let colors = value.colors
        let allColors = '<option value="">--SVP, choisissez une couleur --</option>'
        for (let i in colors) {
            allColors += `<option value="${value.colors[i]}">${value.colors[i]}</option>`
        }
        document
            .getElementById('colors')
            .innerHTML = allColors
    })

// Si il y a une erreur de recupération des produits
    .catch(function(err) {
        alert("Une erreur est survenue : \n .catch : " + err);
    })


// LOCALSTORAGE
// ajouter un element depuis la page vers le localstorage

    // 1ere etape - cibler les valeure sur le DOM
    // 2eme etape - gestion du localstorage
        // 2.1 - permettre de sauvegarder un article sur le localstorage
        // 2.2 - recupere un article sur le localstorage ou si il n'y a pas d'article renvoi un tableau vide
    // 3eme etape - permettre à l'utilisateur de sauvegarder son choix sur le localstorage grace au bouton "ajouter au panier"
        // 3.1 - verifie que l'utilisateur a bien choisi la couleur et la quantité



// 1ere etape

/* la variable numberId et deja defini plus haut pour recuperer l'id du produit */
let colors = document.getElementById("colors");
let quantity = document.getElementById("quantity");



// 2eme etape
    // 2.1 sauvegarde sur le localstorage
    function saveCart(cart) {
        localStorage.setItem("cart", JSON.stringify(cart));
    }


    // 2.2 recupere sur le localstorage
    function getCart() {
        let cart = localStorage.getItem("cart")
        // if = si le panier est vide renvoi [] sinon renvoi le panier
        if (cart == undefined) {
            return [];
        } else {
            return JSON.parse(cart);
        }
    }


// 3eme etape
    function addToCart(article) {
        // condition avant ajout au panier
        if (colors.value == "" && quantity.value < 1 || quantity.value > 100) {
            alert("veuillez selectionner une couleur \nquantité non autorisée")

        } else if (colors.value == "") {
            alert("veuillez selectionner une couleur")
        }

        else if (quantity.value < 1 || quantity.value > 100) {
            alert("erreur sur la quantité \nselon stock disponible (1-100)")
        }

        else {
            // recupère les articles stockés et verifie si ils y sont déjà
            let cart = getCart()
            let foundArticle = cart.find(a => (a.id === article.id && a.colors == article.colors));

            // si déja présent augmente la quantité sinon ajoute un nouvel article
            if (foundArticle != undefined) {
                foundArticle.quantity = parseInt(article.quantity)+parseInt(foundArticle.quantity);

                if (foundArticle.quantity > 100) { 
                        foundArticle.quantity = 100;
                        alert("stock limité à 100")
                }

            } else {
                cart.push(article);
            }
            saveCart(cart)
            alert("article bien ajouté au panier")
        }
    }


// 3eme etape
class Article {
    constructor (id, colors, quantity) {
        this.id = id,
        this.colors = colors
        this.quantity = quantity
    }
}
document
    .getElementById('addToCart')
    .addEventListener('click', function() {
            let article = new Article (numberId, colors.value, quantity.value)
        addToCart(article)
    })





