export function ajoutListenersAvis() {
    const piecesElements = document.querySelectorAll(".fiches article button");

    for (let i = 0; i < piecesElements.length; i++) {
        piecesElements[i].addEventListener("click", async function (event) {
            const id = event.target.dataset.id;

            let avis = window.localStorage.getItem(id + 'avis');
            if (avis === null) {
                const reponse = await fetch("http://localhost:8081/pieces/" + id + "/avis");
                avis = await reponse.json();
                console.log("ALORS NON");
                const valeurReponse = JSON.stringify(reponse);
                window.localStorage.setItem(id + "avis", valeurReponse);
            } else {
                avis = JSON.parse(avis);
                console.log("JE VEUX VERIF");
            }

            const pieceElement = event.target.parentElement;

            const avisElement = document.createElement("p");
            for (let i = 0; i < avis.length; i++) {
                avisElement.innerHTML += `${avis[i].utilisateur}: ${avis[i].commentaire} <br> ${avis[i].nbEtoiles}`;
            }
            pieceElement.appendChild(avisElement);
        });
    }
}

export function ajoutListenerEnvoyerAvis() {
    const formulaireAvis = document.querySelector(".formulaire-avis");
    formulaireAvis.addEventListener("submit", function (event) {
        event.preventDefault();
        // Création de l’objet du nouvel avis.
        const avis = {
            pieceId: parseInt(event.target.querySelector("[name=piece-id]").value),
            utilisateur: event.target.querySelector("[name=utilisateur").value,
            commentaire: event.target.querySelector("[name=commentaire]").value,
            nbEtoiles: event.target.querySelector("[name=nb-stars]").value,
        };
        // Création de la charge utile au format JSON
        const chargeUtile = JSON.stringify(avis);

        fetch("http://localhost:8081/avis", {

            method: "POST",

            headers: { "Content-Type": "application/json" },

            body: chargeUtile

        });
    });
}

export async function afficherGraphiqueAvis() {

    // Légende qui s'affichera sur la gauche à côté de la barre horizontale

    const labels = ["5", "4", "3", "2", "1"];

    // Données et personnalisation du graphique
    const data = {
        labels: labels,
        datasets: [{
            label: "Étoiles attribuées",
            data: nb_commentaires.reverse(),
            backgroundColor: "rgba(255, 230, 0, 1)", // couleur jaune
        }],
    };

    // Objet de configuration final

    const config = {

        type: "bar",

        data: data,

        options: {

            indexAxis: "y",

        },

    };

    // Rendu du graphique dans l'élément canvas

    const graphiqueAvis = new Chart(

        document.querySelector("#graphique-avis"),

        config,

    );

}



export async function afficherGraphiqueCommentaires() {

    // Légende qui s'affichera sur la gauche à côté de la barre horizontale

    const labels = ["Pièces disponibles", "Pièces non disponibles",];

    // Données et personnalisation du graphique
    const data = {
        labels: labels,
        datasets: [{
            label: "Commentaires attribuées",
            data: [nbCommentairesDispo, nbCommentairesNonDispo],
            backgroundColor: "rgba(83, 234, 93, 1)", // couleur lime
        }],
    };

    // Objet de configuration final

    const config = {

        type: "bar",

        data: data,

        options: {

            indexAxis: "x",

        },

    };

    // Rendu du graphique dans l'élément canvas

    const graphiqueAvis = new Chart(

        document.querySelector("#graphique-commentaires"),

        config,

    );

}



// Calcul du nombre total de commentaires par quantité d'étoiles attribuées

// const disponible = await fetch("http://localhost:8081/pieces").then(disponible => disponible.json());

const nb_disponibilite_commentaires = [0, 0];

// for (var i = 0; i < disponible.length; i++) {
//     if (disponible[i].disponible) {
//         nb_disponibilite_commentaires[0]++;
//     } else {
//         nb_disponibilite_commentaires[1]++;
//     }
// }

const avis = await fetch("http://localhost:8081/avis").then(avis => avis.json());

const nb_commentaires = [0, 0, 0, 0, 0];

for (let commentaire of avis) {

    nb_commentaires[commentaire.nbEtoiles - 1]++;

}

const pieces = await fetch("http://localhost:8081/pieces").then(pieces => pieces.json());

let nbCommentairesDispo = 0;
let nbCommentairesNonDispo = 0;

for (let i = 0; i < avis.length; i++) {
    const piece = pieces.find(p => p.id === avis[i].pieceId);

    if (piece.disponibilite) {
        nbCommentairesDispo++;
    } else {
        nbCommentairesNonDispo++;
    }

}