// affichage des produits dans la page d'acceuil

// fonction permettant de générer le HTML pour afficher un produit
function createElt(item) {
    let link = document.createElement("a");
        link.setAttribute("href", `./product.html?id=${item._id}`);
        document.querySelector("#items").prepend(link);

    let article = document.createElement("article");
        document.querySelector("#items a").append(article);

    let img = document.createElement("img");
        img.setAttribute("src", item.imageUrl);
        img.setAttribute("alt", item.altTxt);
        document.querySelector("#items article").append(img);

    let title = document.createElement("h3");
        title.classList.add("productName");
        title.textContent = item.name;
        document.querySelector("#items article").append(title);


    let description = document.createElement("p");
        description.classList.add("productDescription");
        description.textContent = item.description;
        document.querySelector("#items article").append(description);
}




// on recupère les données dans l'API avec un fetch et on verifie que tout se passe bien
fetch("http://localhost:3000/api/products/")
    .then(function(res) {
        if (res.ok) { 
            return res.json();
        }
    })


// si le fetch c'est bien passé on appel la fonction pour afficher chaque produit sur la page d'acceuil
    .then(function(value) {
        for (let item of value) {
            createElt(item);
        }
    })


// Si il y a une erreur de recupération des produits on affiche un message
    .catch(function(err) {
        alert("Une erreur est survenue : \n .catch : " + err);
    })