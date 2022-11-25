// 1ere etape - recupérer l'id d'un produit avec URLSEARCHPARAMS
// 2eme etape - recupérer le produit a afficher a l'aide de son ID
// 3eme etape - insérer les valeurs du produits dans le DOM


// 1ere etape
let url = new URL(window.location.href);
let id = url.searchParams.get("id");


// 2eme etape
fetch('http://localhost:3000/api/products/'+id)
    .then (function(res) {
        if(res.ok) {
        return res.json();
        }
    })

// 3eme etape
    .then (function(value) {
        document.querySelector('.item__img').innerHTML = `<img src="${value.imageUrl}" alt="${value.altTxt}"></img>`
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