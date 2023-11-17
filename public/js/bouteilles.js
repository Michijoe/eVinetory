//*********************** */
//* Get the inventory of Bouteilles as a view
// * @param {*} bouteilleId
//
function manageCellierForBouteille(bouteilleId) {
    console.log("manageCellierForBouteille", bouteilleId);
    fetch("/ajax/bouteilles_viewfor_managecellier/" + bouteilleId)
        .then((response) => response.text())
        .then((html) => {
            //console.log("html", html)
            document.getElementById("modaleContent").innerHTML = html;
        })
        .catch((error) => console.error("Error:", error));

    showModale();
}



//*********************** */
//* BouteilleCellier: Change amount and trigger save function
//
function decrementValue(button) {
    var input = button.parentNode.querySelector('input[type=number]');
    input.stepDown();
    triggerSaveAmount(input);
}

function incrementValue(button) {
    var input = button.parentNode.querySelector('input[type=number]');
    input.stepUp();
    triggerSaveAmount(input);
}

function triggerSaveAmount(input) {
    var bottleId = input.getAttribute('data-id');
    bouteilleCellier_saveAmount(input, bottleId);
}


//*********************** */
//* BouteilleCellier: Save amount
// * @param {*} element clicked element
// * @param {*} bouteilleCellierId Id bouteilleCellier
//
function bouteilleCellier_saveAmount(element, bouteilleCellierId) {
    var newAmount = element.value;
    console.log(
        "bouteilleCellier_saveAmount",
        element,
        bouteilleCellierId,
        newAmount
    );
    sendRequest("/bouteilleCellier/saveAmount", {
        id: bouteilleCellierId,
        amount: newAmount,
    })
        .then((data) => console.log(data))
        .catch((error) => console.error("Error:", error));
}

//*********************** */
//* BouteilleCellier: Delete
// * @param {*} element clicked element
// * @param {*} bouteilleCellierId Id bouteilleCellier
//
function bouteilleCellier_delete(element, bouteilleCellierId, bouteilleId) {
    sendRequest(
        "/bouteilleCellier/delete",
        { id: bouteilleCellierId },
        "DELETE"
    )
        .then((data) => {
            console.log(data);
            manageCellierForBouteille(bouteilleId);
        })
        .catch((error) => console.error("Error:", error));
}

//*********************** */
//* BouteilleCellier: Add
// * @param {*} element clicked element
// * @param {*} bouteilleCellierId Id bouteilleCellier
// * @param {*} idBouteille Id bouteille
// * @param {*} idCellier Id cellier
//

function bouteilleCellier_add(
    element,
    bouteilleCellierId,
    idBouteille,
    idCellier,
    quantite
) {
    sendRequest(
        "/bouteilleCellier/add", 
        {
            id: bouteilleCellierId, 
            idBouteille: idBouteille, 
            idCellier: idCellier, 
            quantite: quantite, 
        },
        "POST" // Utilisez la méthode HTTP appropriée selon votre route Laravel
    )
        .then((data) => {
            console.log(data);
            manageCellierForBouteille(idBouteille);
        })
        .catch((error) => console.error("Erreur:", error));
}

//fh: pas terminé(cette fonction utilisera sendRequest mais échoue actuellement)
function searchBouteillesv2() {
    const query = document.getElementById("searchField").value;
    const sort = document.getElementById("tri-component").value; // Get the selected sorting value

    // Clear the previous timeout
    if (searchTimeoutToken) {
        clearTimeout(searchTimeoutToken);
    }

    searchTimeoutToken = setTimeout(() => {
        document.getElementById("loading").style.display = "block";

        // Use the sendRequest function
        sendRequest(`/search/bouteilles?query=${query}&sort=${sort}`, {}, "GET")
            .then((html) => {
                document.getElementById("loading").style.display = "none";
                document.getElementById("bouteilles-container").innerHTML =
                    html;
                // Update any additional elements as needed
            })
            .catch((error) => {
                console.error("Erreur:", error);
                document.getElementById("loading").style.display = "none";
            });
    }, 500); // Delay before sending the request
}


