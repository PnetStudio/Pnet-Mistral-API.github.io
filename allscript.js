var showArchivedHistory = false; 
function requestAPIKey() {
    var apiKey = prompt("Veuillez entrer votre clé API Mistral / Please enter your Mistral API key :");
    if (apiKey) {
        localStorage.setItem("apiKey", apiKey);
        location.reload();
    } else {
        alert("Vous devez fournir une clé API pour utiliser le service Mistral. / You must provide an API key to use the Mistral service.");
    }
}
var storedAPIKey = localStorage.getItem("apiKey");
if (!storedAPIKey) {
    requestAPIKey();
}

function updatePlaceholder() {
    var userQuestionInput = document.getElementById("userQuestion");
    var placeholderText = translateText('Entrez votre question ici');
    userQuestionInput.setAttribute('placeholder', placeholderText);
}

document.addEventListener("DOMContentLoaded", function () {
    updatePlaceholder();
    updateTheme();

    var userQuestionInput = document.getElementById("userQuestion");

    userQuestionInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            callMistralAPI();
        }
    });
    document.getElementById("theme-toggle").addEventListener("click", function () {
        document.body.classList.toggle("dark");
        if (document.body.classList.contains("dark")) {
            this.textContent = "Light";
            localStorage.setItem('theme', 'dark');
        } else {
            this.textContent = "Dark";
            localStorage.removeItem('theme');
        }
    });
    // Ajoutez cet appel pour mettre à jour la langue lors du chargement de la page
    changeLanguage(false);
});
function changeLanguage(sendRequest = true) {
    var selectedLanguage = document.getElementById("languageSelect").value;
    localStorage.setItem("selectedLanguage", selectedLanguage);
    // Appelle la fonction callMistralAPI seulement si sendRequest est true
    if (sendRequest) {
        callMistralAPI();
    }
    // Mettez à jour l'interface en fonction de la langue
    updateInterfaceLanguage();
    // Mettez à jour les textes de l'interface
    updateInterfaceTexts();
    updatePlaceholder();
}
function updateInterfaceTexts() {
    // Obtenez la langue sélectionnée
    var selectedLanguage = getSelectedLanguage();
    // Mettez à jour les textes de l'interface ici en fonction de la langue sélectionnée
    document.querySelector("label[for='languageSelect']").textContent = translateText("Choisir la langue :");
    document.querySelector("h1").textContent = translateText("Interface Mistral API");
    document.querySelector("h2").textContent = translateText("Choisir un modèle");
    document.querySelector("button").textContent = translateText("Envoyer la question");
    document.querySelector("h2.history-title").textContent = translateText("Historique des Questions/Réponses");
    document.querySelector("button.delete-all-btn").textContent = translateText("Supprimer tout l'historique");
    document.querySelector("button.new-conversation-btn").textContent = translateText("Nouvelle conversation");
    document.querySelector("button.delete-all-btn").textContent = translateText("Supprimer");
    document.querySelector("button.toggle-history-btn").textContent = translateText("Voir l'historique archivé");
}
function updateInterfaceLanguage() {
    document.querySelector("h1").textContent = "Interface Mistral API";
}
function getSelectedLanguage() {
    return localStorage.getItem("selectedLanguage") || "fr"; // Par défaut, la langue est le français
}
// Utilisez la fonction pour obtenir la langue actuellement sélectionnée
var selectedLanguage = getSelectedLanguage();
// Affiche la langue sélectionnée dans la console (vous pouvez le modifier selon vos besoins)
console.log("Langue sélectionnée :", selectedLanguage);
let history = JSON.parse(localStorage.getItem("history")) || [];
renderHistory();
var apiCallInProgress = false; 

function callMistralAPI() {
    console.log("Calling Mistral API...");          
    if (apiCallInProgress) {
        return;
    }
    document.getElementById("loading-icon").style.display = "inline";
    apiCallInProgress = true;           
    // Utilisez la première déclaration de apiKey
    var apiKey = localStorage.getItem("apiKey");            
    // Vérifie si une clé API Mistral a été fournie
    if (!apiKey) {
        alert("Veuillez entrer votre clé API Mistral.");
        apiCallInProgress = false; // Réinitialisez la variable ici
        return;
    }

    // Récupère la question actuelle de l'utilisateur
    var question = document.getElementById("userQuestion").value;
    var selectedModel = document.querySelector('input[name="model"]:checked').value;            
    // Récupère la langue sélectionnée
    var selectedLanguage = getSelectedLanguage();           
    // Crée un tableau des messages de l'utilisateur
    var userMessages = [
        {
            "role": "user",
            "content_type": "prompt",
            "content": question
        },
        {
            "role": "user",
            "content_type": "language",
            "content": selectedLanguage
        }
    ];

    // Ajoute les questions précédentes de l'historique
    userMessages = userMessages.concat(
        history.map(entry => ({
            "role": "user",
            "content_type": "prompt",
            "content": entry.question
        }))
    );

    // Prépare la requête vers l'API Mistral
    var xhr = new XMLHttpRequest();
    var url = "https://api.mistral.ai/v1/chat/completions";
    var data = JSON.stringify({
        "model": selectedModel,
        "messages": userMessages
    });

    // Gère la réponse de l'API
    xhr.onreadystatechange = function () {
        console.log("XHR Ready State:", xhr.readyState, "Status:", xhr.status);

    if (xhr.readyState == 4) {
        if (xhr.status == 200) {
            console.log("API Response:", xhr.responseText);
            var result = JSON.parse(xhr.responseText);
            var content = result['choices'][0]['message']['content'];

            // Met à jour la réponse dans l'interface
            updateResponse(content);

            // Ajoute à l'historique
            addToHistory(question, content, selectedModel);
            //teste update history
            renderHistory();
        } else {
            console.error("Error during request. Status code:", xhr.status);
            document.getElementById("response").innerHTML = "<p>Error during request. Status code: " + xhr.status + '</p>';
            document.getElementById("loading-icon").style.display = "none";
        }

        // Masquer l'icône de chargement
        document.getElementById("loading-icon").style.display = "none";

        // Réinitialisez la variable ici
        apiCallInProgress = false;
    }
    };


    // Configure et envoie la requête vers l'API Mistral
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Authorization", "Bearer " + apiKey);
    xhr.send(data);
}


function addToHistory(question, answer, model) {
    history.push({
        question,
        answer,
        model
    });

    // Limite de l'historique à 50 entrées
    const maxHistoryLength = 50;
    if (history.length > maxHistoryLength) {
        history.splice(0, history.length - maxHistoryLength);
    }

    // Sauvegarde et met à jour l'affichage de l'historique
    saveHistory();
    renderHistory();
}

function updateResponse(content) {
    // Efface le contenu précédent
    document.getElementById("response").innerHTML = '';

    const escapedContent = escapeHtml(content);
    // Sépare les blocs de code du reste du texte
    const sections = content.split(/(```.*?```)/gs);

    sections.forEach(section => {
        if (section.startsWith("```") && section.endsWith("```")) {
            // Crée et affiche le bloc de code
            const codeContent = section.substring(3, section.length - 3);
            const codeBlock = document.createElement('div');
            codeBlock.className = 'code-block';
            codeBlock.textContent = codeContent;
            document.getElementById("response").appendChild(codeBlock);
        } else {
            // Ajoute une indentation aux lignes commençant par un numéro suivi d'un point
            const indentedSection = section.replace(/^\s*([\d.]+)\s*/gm, '<br>$1.<br>');
        
            // Crée et affiche le bloc de texte mis à jour
            const textBlock = document.createElement('div');
            textBlock.className = 'text-block';  // Ajout d'une classe pour le bloc de texte
            textBlock.innerHTML = indentedSection;
            document.getElementById("response").appendChild(textBlock);
        }
    });
}
function startNewConversation() {
    // Archiver l'historique actuel sans affecter l'affichage actuel
    archiveHistory();
    // Rafraîchir seulement l'affichage de l'historique
    renderHistory();
}
function toggleHistoryView() {
    showArchivedHistory = !showArchivedHistory;
    renderHistory(); // Make sure to call the renderHistory function after toggling
}
function archiveHistory() {
    // Récupérer l'historique actuel depuis le stockage local
   const archivedHistory = JSON.parse(localStorage.getItem("archivedHistory")) || [];

    // Ajouter l'historique actuel à l'archive
    archivedHistory.push(...history);

    // Sauvegarder l'archive dans le stockage local
    localStorage.setItem("archivedHistory", JSON.stringify(archivedHistory));

     // Effacer l'historique actuel
    history = [];
    saveHistory();
    }
    function updateTheme() {
        var savedTheme = localStorage.getItem('theme');
        var themeToggle = document.getElementById("theme-toggle");
                
        if (savedTheme === 'dark') {
            document.body.classList.add('dark');
            themeToggle.textContent = "Light";
        } else {
            document.body.classList.remove('dark');
            themeToggle.textContent = "Dark";
        }
}
function renderHistory() {
    const historyDiv = document.getElementById("history");
    historyDiv.innerHTML = '';
    const displayedHistory = showArchivedHistory ? getArchivedHistory() : history;
    const reversedHistory = displayedHistory.slice().reverse();

    reversedHistory.forEach((entry, index) => {
        const entryDiv = document.createElement("div");
        entryDiv.className = "history-entry";

        const escapedContent = escapeHtml(entry.answer);
        const formattedAnswer = escapedContent.replace(/(```.*?```)/gs, function(match) {
            return `<div class="code-block">${match.slice(3, -3)}</div>`;
        });
    
        entryDiv.innerHTML = `
            <p><strong>Question :</strong> ${entry.question}</p>
            <p><strong>Réponse :</strong></p>
            ${formattedAnswer}
            <p><strong>Modèle :</strong> ${entry.model}</p>
            <button class="delete-btn" onclick="deleteEntry(${index})">${translateText("Supprimer")}</button>`;
    
        historyDiv.appendChild(entryDiv);
    });
}
function getArchivedHistory() {
    return JSON.parse(localStorage.getItem("archivedHistory")) || [];
}
function deleteEntry(index) {
    if (showArchivedHistory) {
        // Si l'affichage est basculé vers l'historique archivé, supprimez de l'archivage
        const archivedHistory = getArchivedHistory();
        archivedHistory.splice(index, 1);
        localStorage.setItem("archivedHistory", JSON.stringify(archivedHistory));
    } else {
        // Sinon, supprimez de l'historique actuel
        history.splice(index, 1);
        saveHistory();
    }

    renderHistory();
}

function clearHistory() {
    if (showArchivedHistory) {
        // Si l'affichage est basculé vers l'historique archivé, effacez l'archivage
        localStorage.removeItem("archivedHistory");
    } else {
        // Sinon, effacez l'historique actuel
        history = [];
        saveHistory();
    }

    renderHistory();
}

function saveHistory() {
    localStorage.setItem("history", JSON.stringify(history));
}
// Fonction pour échapper les balises HTML
function escapeHtml(text) {
    var map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };

    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}