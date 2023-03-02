import { ajoutListenersAvis, ajoutListenerEnvoyerAvis, afficherGraphiqueAvis, afficherGraphiqueCommentaires } from "./avis.js";

//Récupération des pièces eventuellement stockées dans le localStorage

afficherGraphiqueAvis();
afficherGraphiqueCommentaires();

let pieces = window.localStorage.getItem('pieces');
if (pieces === null) {
    // Récupération des pièces depuis l'API
    const reponse = await fetch('http://localhost:8081/pieces/');
    pieces = await reponse.json();
    // Transformation des pièces en JSON
    const valeurPieces = JSON.stringify(pieces);
    // Stockage des informations dans le localStorage
    window.localStorage.setItem("pieces", valeurPieces);
} else {
    pieces = JSON.parse(pieces);
}

// Ajout du listener pour mettre à jour des données du localStorage

const boutonMettreAJour = document.querySelector(".btn-maj");

boutonMettreAJour.addEventListener("click", function () {

    window.localStorage.removeItem("pieces");

});

const piecesPrixCroissant = Array.from(pieces);
piecesPrixCroissant.sort(function (a, b) {
    return a.prix - b.prix;
});

const piecesPrixDecroissant = Array.from(pieces);
piecesPrixDecroissant.sort(function (a, b) {
    return b.prix - a.prix;
});

const piecesPrixAbordable = pieces.filter(function (a) {
    return a.prix <= 35;
});

const piecesDescriptionExistante = pieces.filter(function (a) {
    return a.description;
});


function piecesLoader(piecesList) {
    document.querySelector(".fiches").innerHTML = "";

    for (var i = 0; i < piecesList.length; i++) {

        const article = piecesList[i];

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
        categorieDisponible.innerText = `${article.disponibilite ? "L'article est disponible" : "L'article est en rupture de stock"}`;

        const avisBouton = document.createElement("button");
        avisBouton.dataset.id = article.id;
        avisBouton.textContent = "Afficher les avis";

        sectionFiches.appendChild(pieceElement);
        pieceElement.appendChild(imageElement);
        pieceElement.appendChild(nomElement);
        pieceElement.appendChild(prixElement);
        pieceElement.appendChild(categorieElement);
        pieceElement.appendChild(categorieDescription);
        pieceElement.appendChild(categorieDisponible);
        pieceElement.appendChild(avisBouton);
    }

    ajoutListenersAvis();
    ajoutListenerEnvoyerAvis();
}

piecesLoader(pieces);

const boutonTrier = document.querySelector(".btn-trier");
boutonTrier.addEventListener("click", function () {
    piecesLoader(piecesPrixCroissant);
});

const boutonTrierReverse = document.querySelector(".btn-trier-reverse");
boutonTrierReverse.addEventListener("click", function () {
    piecesLoader(piecesPrixDecroissant);
});

const boutonFiltrer = document.querySelector(".btn-filtrer");
boutonFiltrer.addEventListener("click", function () {
    piecesLoader(piecesPrixAbordable);
});

const boutonFiltrerDescription = document.querySelector(".btn-filtrer-description");
boutonFiltrerDescription.addEventListener("click", function () {
    piecesLoader(piecesDescriptionExistante);
});

const range = document.querySelector(".btn-filter-range");
range.value = 60;
range.addEventListener('input', () => {
    document.querySelector(".rangeLabel").innerHTML = "Filtrer par prix: " + range.value + "€";
});



// const noms = pieces.map(piece => piece.nom);
// for (let i = pieces.length - 1; i >= 0; i--) {
//     if (pieces[i].prix > 35) {
//         noms.splice(i, 1)
//     }
// }
// console.log(noms)


// //Création de la liste
// const abordablesElements = document.createElement('ul');
// //Ajout de chaque nom à la liste
// for (let i = 0; i < noms.length; i++) {
//     const nomElement = document.createElement('li');
//     nomElement.innerText = noms[i];
//     abordablesElements.appendChild(nomElement)
// }
// // Ajout de l'en-tête puis de la liste au bloc résultats filtres
// document.querySelector('.abordables')
//     .appendChild(abordablesElements)