// afficher le numero de commande en le recupérant directement dans le lien grace a l'URL search params
document.getElementById("orderId").textContent = new URL(window.location.href).searchParams.get("orderId");

localStorage.clear()