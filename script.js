document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('product-form');
    const descriptionDiv = document.getElementById('generated-description');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('product-name').value.trim();
        const featuresRaw = document.getElementById('product-features').value.trim();

        if (!name || !featuresRaw) {
            descriptionDiv.textContent = "Por favor, completa todos los campos.";
            return;
        }

        const features = featuresRaw.split(',').map(f => f.trim()).filter(f => f.length > 0);

        const description = generateProductDescription(name, features);
        descriptionDiv.textContent = description;
    });
});

/**
 * Genera una descripción atractiva y optimizada para Amazon.
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
