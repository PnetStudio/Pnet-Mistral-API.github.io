function translateText(text) {
    // Implémentez votre mécanisme de traduction ici
    // Vous pouvez utiliser un objet avec des traductions pour chaque langue
    // Par exemple :
    var translations = {
        "Choisir la langue :": {
            "français": "Choisir la langue :",
            "english": "Choose language:",
            "español": "Elegir idioma:",
            "deutsch": "Sprache wählen:",
            // ... d'autres langues ...
        },
        "Interface Mistral API": {
            "français": "Interface Mistral API",
            "english": "Mistral API Interface",
            "español": "Interfaz de Mistral API",
            "deutsch": "Mistral API Oberfläche",
            // ... d'autres langues ...
        },
        "Choisir un modèle": {
            "français": "Choisir un modèle",
            "english": "Choose a model",
            "español": "Elegir un modelo",
            "deutsch": "Modell auswählen",
            // ... d'autres langues ...
        },
        "Envoyer la question": {
            "français": "Envoyer la question",
            "english": "Send the question",
            "español": "Enviar la pregunta",
            "deutsch": "Frage senden",
            // ... d'autres langues ...
        },
        "Historique des Questions/Réponses": {
            "français": "Historique des Questions/Réponses",
            "english": "History of Questions/Answers",
            "español": "Historial de preguntas/respuestas",
            "deutsch": "Verlauf von Fragen/Antworten",
            // ... d'autres langues ...
        },
        "Supprimer tout l'historique": {
            "français": "Supprimer tout l'historique",
            "english": "Delete all history",
            "español": "Eliminar todo el historial",
            "deutsch": "Den gesamten Verlauf löschen",
            // ... d'autres langues ...
        },
        "Entrez votre question ici": {
            "français": "Entrez votre question ici",
            "english": "Enter your question here",
            "español": "Ingrese su pregunta aquí",
            "deutsch": "Geben Sie hier Ihre Frage ein",
            // ... autres langues ...
        },
        "Nouvelle conversation": {
            "français": "Nouvelle conversation",
            "english": "New conversation",
            "español": "Nueva conversación",
            "deutsch": "Neues Gespräch",
            // ... d'autres langues ...
        },
        "Nouvelle conversation": {
        "français": "Nouvelle conversation",
        "english": "New conversation",
        "español": "Nueva conversación",
        "deutsch": "Neues Gespräch",
        // ... autres langues ...
        },
        "Voir l'historique archivé": {
            "français": "Voir l'historique archivé",
            "english": "View archived history",
            "español": "Ver historial archivado",
            "deutsch": "Archivverlauf anzeigen",
            // ... autres langues ...
        },
        "Supprimer": {
            "français": "Supprimer",
            "english": "Delete",
            "español": "Eliminar",
            "deutsch": "Löschen"
            // ... autres langues ...
        },
        // ... autres textes ...
    };

    var selectedLanguage = getSelectedLanguage();
    return translations[text][selectedLanguage] || text;
}