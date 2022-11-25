// affichage des produits dans la page d'acceuil
    // 1ere etape - On recupere les données depuis l'API
    // 2eme etape - on stock les produits dans une variable
    // 3eme etape - on insere la variable dans le HTML
        // 3.1 - on cible l'id dans le HTML
        // 3.2 - on modifie le code en le remplacant par la variable

// 1ere etape
fetch("http://localhost:3000/api/products/")
    .then(function(res) {
        if (res.ok) { 
            return res.json();
        }
    })
// 2eme etape
    .then(function(value) {
        let allItems = ""
        for (let item of value) { 
            allItems += `
                <a href="./product.html?id=${item._id}">
                    <article>
                    <img src="${item.imageUrl}" alt="${item.altTxt}">
                    <h3 class="productName">${item.name}</h3>
                    <p class="productDescription">${item.description}</p>
                    </article>
                </a>`
            }
// 3eme etape
        return document
                .getElementById('items')
                .innerHTML = allItems;
    })
// Si il y a une erreur de recupération des produits
    .catch(function(err) {
        alert("Une erreur est survenue : \n .catch : " + err);
    })