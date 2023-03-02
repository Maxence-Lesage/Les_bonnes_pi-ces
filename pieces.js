// Récupération des pièces depuis le fichier JSON
const reponse = await fetch('pieces-autos.json');
const pieces = await reponse.json();

for (var i = 0; i < pieces.length; i++) {

    const article = pieces[i];

    const sectionFiches = document.querySelector(".fiches");
    const pieceElement = document.createElement("article");

    const imageElement = document.createElement("img");
    imageElement.src = article.image;

    const nomElement = document.createElement("h2");
    nomElement.innerText = article.nom;

    const prixElement = document.createElement("p");
    prixElement.innerText =
        `Prix: ${article.prix} € (${article.prix < 15 ? "€" : article.prix < 35 ? "€€" : "€€€"})`;

    const categorieElement = document.createElement("p");
    categorieElement.innerText = article.categorie ?? "aucune catégorie";

    const categorieDescription = document.createElement("p");
    categorieDescription.innerText = article.description ?? "Pas de description pour le moment";

    const categorieDisponible = document.createElement("p");
    categorieDisponible.innerText = `${article.disponible == "oui" ? "L'article est disponible" : "L'article est en rupture de stock"}`;

    sectionFiches.appendChild(pieceElement);
    pieceElement.appendChild(imageElement);
    pieceElement.appendChild(nomElement);
    pieceElement.appendChild(prixElement);
    pieceElement.appendChild(categorieElement);
    pieceElement.appendChild(categorieDescription);
    pieceElement.appendChild(categorieDisponible);

}