document.addEventListener('DOMContentLoaded', function() {
    // Set default language
    setLanguage(currentLang);

    // Language selector event
    const langSelect = document.getElementById('lang-select');
    langSelect.value = currentLang;
    langSelect.addEventListener('change', function() {
        setLanguage(this.value);
        // Clear previous description
        document.getElementById('generated-description').innerHTML = '';
    });

    const form = document.getElementById('product-form');
    const descriptionDiv = document.getElementById('generated-description');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('product-name').value.trim();
        const featuresRaw = document.getElementById('product-features').value.trim();
        const tone = document.getElementById('tone-select').value;

        if (!name) {
            descriptionDiv.textContent = translations[currentLang].errorEmpty;
            return;
        }

        // Sanitize and split features
        let features = [];
        if (featuresRaw) {
            features = featuresRaw.split(',').map(f => f.trim()).filter(f => f.length > 0);
        }

        fetchGeminiDescription(name, features, tone);
    });
});

// Diccionario de traducciones
const translations = {
    en: {
        title: "Amazon Product Description Generator",
        mainTitle: "Amazon Product Description Generator",
        langLabel: "Language:",
        productLabel: "Full product name (as on Amazon):",
        featuresLabel: "Main features (optional, comma separated):",
        toneLabel: "Writing tone:",
        toneProfessional: "Professional",
        tonePersuasive: "Persuasive",
        toneCasual: "Casual",
        toneMinimalist: "Minimalist",
        toneCreative: "Creative",
        toneSEO: "SEO-Friendly",
        generateBtn: "Generate Description",
        descTitle: "Generated Description:",
        placeholder: "Enter the full product name...",
        loading: "Generating description with AI...",
        errorApiKey: "Could not get API key. Check config.json.",
        errorApi: "An error occurred while generating the description with Gemini. Try again.",
        errorUnexpected: "An unexpected error occurred while generating the description with Gemini. See console.",
        errorEmpty: "Please enter the product name."
    },
    es: {
        title: "Generador de Descripciones de Productos Amazon",
        mainTitle: "Generador de Descripciones de Productos Amazon",
        langLabel: "Idioma:",
        productLabel: "Nombre completo del producto (tal como aparece en Amazon):",
        featuresLabel: "Características principales (opcional, separadas por coma):",
        toneLabel: "Tono de escritura:",
        toneProfessional: "Profesional",
        tonePersuasive: "Persuasivo",
        toneCasual: "Casual",
        toneMinimalist: "Minimalista",
        toneCreative: "Creativo",
        toneSEO: "SEO-Friendly",
        generateBtn: "Generar descripción",
        descTitle: "Descripción generada:",
        placeholder: "Introduce el nombre completo del producto...",
        loading: "Generando descripción con IA...",
        errorApiKey: "No se pudo obtener la clave API. Verifica config.json.",
        errorApi: "Ocurrió un error al generar la descripción con Gemini. Intenta nuevamente.",
        errorUnexpected: "Ocurrió un error inesperado al generar la descripción con Gemini. Consulta la consola.",
        errorEmpty: "Por favor, introduce el nombre del producto."
    },
    fr: {
        title: "Générateur de descriptions de produits Amazon",
        mainTitle: "Générateur de descriptions de produits Amazon",
        langLabel: "Langue:",
        productLabel: "Nom complet du produit (tel qu'il apparaît sur Amazon):",
        featuresLabel: "Caractéristiques principales (optionnel, séparées par des virgules):",
        toneLabel: "Ton d'écriture:",
        toneProfessional: "Professionnel",
        tonePersuasive: "Persuasif",
        toneCasual: "Décontracté",
        toneMinimalist: "Minimaliste",
        toneCreative: "Créatif",
        toneSEO: "SEO-Friendly",
        generateBtn: "Générer la description",
        descTitle: "Description générée:",
        placeholder: "Entrez le nom complet du produit...",
        loading: "Génération de la description avec l'IA...",
        errorApiKey: "Impossible d'obtenir la clé API. Vérifiez config.json.",
        errorApi: "Une erreur s'est produite lors de la génération de la description avec Gemini. Réessayez.",
        errorUnexpected: "Une erreur inattendue s'est produite lors de la génération de la description avec Gemini. Voir la console.",
        errorEmpty: "Veuillez saisir le nom du produit."
    }
};

let currentLang = 'en';

function setLanguage(lang) {
    currentLang = lang;
    const t = translations[lang];
    document.title = t.title;
    document.getElementById('title-text').textContent = t.title;
    document.getElementById('main-title').textContent = t.mainTitle;
    document.getElementById('lang-label').textContent = t.langLabel;
    document.getElementById('product-label').textContent = t.productLabel;
    document.getElementById('features-label').textContent = t.featuresLabel;
    document.getElementById('tone-label').textContent = t.toneLabel;
    document.getElementById('tone-select').options[0].text = t.toneProfessional;
    document.getElementById('tone-select').options[1].text = t.tonePersuasive;
    document.getElementById('tone-select').options[2].text = t.toneCasual;
    document.getElementById('tone-select').options[3].text = t.toneMinimalist;
    document.getElementById('tone-select').options[4].text = t.toneCreative;
    document.getElementById('tone-select').options[5].text = t.toneSEO;
    document.getElementById('generate-btn').textContent = t.generateBtn;
    document.getElementById('desc-title').textContent = t.descTitle;
    document.getElementById('product-name').placeholder = t.placeholder;
}

/**
 * Genera una descripción atractiva y optimizada para Amazon sin utilizar IA.
 * @param {string} name - Nombre del producto.
 * @param {string[]} features - Lista de características principales.
 * @returns {string} Descripción generada.
 */
function generateProductDescription(name, features) {
    if (!name || !features.length) return "";

    let intro = `Descubre el nuevo ${name}, la opción ideal para quienes buscan calidad y funcionalidad en cada detalle.`;
    let featuresList = features.map(f => `• ${capitalizeFirst(f)}`).join('\n');
    let outro = `No pierdas la oportunidad de mejorar tu experiencia con el ${name}. ¡Haz tu pedido ahora y disfruta de sus ventajas en tu día a día!`;

    return `${intro}\n\nCaracterísticas principales:\n${featuresList}\n\n${outro}`;
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Lee el archivo config.json local y devuelve el valor de API_KEY.
 * @returns {Promise<string|null>} La clave API o null si hay error.
 */
async function getApiKeyFromConfig() {
    try {
        const response = await fetch('config.json');
        if (!response.ok) {
            throw new Error('No se pudo cargar config.json');
        }
        const config = await response.json();
        if (!config.API_KEY) {
            throw new Error('API_KEY no encontrada en config.json');
        }
        return config.API_KEY;
    } catch (error) {
        console.error('Error al obtener la clave API:', error.message);
        return null;
    }
}

/**
 * Envía los datos del producto a la API de Gemini y muestra la descripción generada.
 * @param {string} name - Nombre completo del producto.
 * @param {string[]} features - Lista de características principales.
 * @param {string} tone - Tono de escritura
 */
async function fetchGeminiDescription(name, features, tone) {
    const descriptionDiv = document.getElementById('generated-description');
    descriptionDiv.textContent = translations[currentLang].loading;

    try {
        const apiKey = await getApiKeyFromConfig();
        if (!apiKey) {
            descriptionDiv.textContent = translations[currentLang].errorApiKey;
            return;
        }
        const apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

        // Tono por idioma
        const toneInstructions = {
            en: {
                professional: "Write in a professional and informative tone suitable for B2B.",
                persuasive: "Use a persuasive tone that highlights benefits and urges purchase.",
                casual: "Adopt a casual and friendly tone suitable for social media.",
                minimalist: "Use a minimalist, concise tone. Only the essentials.",
                creative: "Be creative and original in your writing style.",
                seo: "Optimize the description for SEO, including relevant keywords naturally."
            },
            es: {
                professional: "Redacta en un tono profesional e informativo, adecuado para negocios (B2B).",
                persuasive: "Utiliza un tono persuasivo que resalte beneficios y motive la compra.",
                casual: "Adopta un tono casual y cercano, ideal para redes sociales.",
                minimalist: "Usa un tono minimalista y conciso. Solo lo esencial.",
                creative: "Sé creativo y original en el estilo de redacción.",
                seo: "Optimiza la descripción para SEO, incluyendo palabras clave relevantes de forma natural."
            },
            fr: {
                professional: "Rédige sur un ton professionnel et informatif adapté au B2B.",
                persuasive: "Utilise un ton persuasif qui met en avant les avantages et incite à l'achat.",
                casual: "Adopte un ton décontracté et amical, idéal pour les réseaux sociaux.",
                minimalist: "Utilise un ton minimaliste et concis. Va à l'essentiel.",
                creative: "Sois créatif et original dans le style d'écriture.",
                seo: "Optimise la description pour le SEO, en incluant naturellement des mots-clés pertinents."
            }
        };

        // Prompt base para Amazon por idioma
        const amazonPrompt = {
            en: `Generate a structured, persuasive, and SEO-friendly Amazon product description in English for the following product. Use markdown-like formatting with these sections:
- Product Name (as a heading)
- Short compelling intro ("Why You'll Love It")
- Key Features (bullet list)
- Use Cases ("Perfect For" section, bullet list)
- Call To Action
Do NOT use emojis. Be concise, clear, and professional. If features are provided, use them; otherwise, infer from the product name. Suggest 3-5 SEO keywords at the end (as a list).`,
            es: `Genera una descripción de producto para Amazon en español, estructurada, persuasiva y optimizada para SEO. Usa formato tipo markdown con estas secciones:
- Nombre del producto (como título)
- Breve introducción atractiva ("Por qué te encantará")
- Características clave (lista de viñetas)
- Usos ideales ("Perfecto para", lista de viñetas)
- Llamada a la acción
NO uses emojis. Sé claro, conciso y profesional. Si se proporcionen características, úsalas; si no, infiere a partir del nombre. Sugiere 3-5 palabras clave SEO al final (como lista).`,
            fr: `Génère une description de produit Amazon en français, structurée, persuasive et optimisée pour le SEO. Utilise un format type markdown avec ces sections :
- Nom du produit (en titre)
- Brève introduction accrocheuse ("Pourquoi vous allez l'adorer")
- Caractéristiques clés (liste à puces)
- Usages idéaux ("Parfait pour", liste à puces)
- Appel à l'action
N'utilise PAS d'emojis. Sois clair, concis et professionnel. Si des caractéristiques sont fournies, utilise-les ; sinon, déduis-les du nom. Suggère 3 à 5 mots-clés SEO à la fin (en liste).`
        };

        // Construir prompt final
        let prompt = amazonPrompt[currentLang] + "\n";
        prompt += toneInstructions[currentLang][tone] + "\n";
        prompt += `\nProduct Name: ${name}`;
        if (features && features.length > 0) {
            prompt += `\nFeatures:\n- ${features.join('\n- ')}`;
        }

        const body = {
            contents: [
                {
                    parts: [
                        { text: prompt }
                    ]
                }
            ]
        };

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-goog-api-key': apiKey
            },
            body: JSON.stringify(body)
        });

        let data;
        try {
            data = await response.json();
        } catch (jsonError) {
            descriptionDiv.textContent = "La respuesta de la API no es válida.";
            console.error("Error al parsear JSON:", jsonError);
            return;
        }

        if (!response.ok) {
            const apiError = data?.error?.message || `Error en la API: ${response.status}`;
            descriptionDiv.textContent = "Error: " + apiError;
            console.error("API error:", data);
            return;
        }

        const geminiText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No se pudo generar la descripción.";

        if (window.marked && typeof window.marked.parse === 'function') {
            descriptionDiv.innerHTML = marked.parse(geminiText);
        } else {
            descriptionDiv.textContent = geminiText;
        }
    } catch (error) {
        descriptionDiv.textContent = translations[currentLang].errorUnexpected;
        console.error(error);
    }
}
