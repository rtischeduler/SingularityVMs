// Configuración de Mautic
const MAUTIC_ENDPOINT = 'https://www.megadisk.net/registration/signup.php';

// 1. Validación de correo + console.log
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = re.test(String(email).toLowerCase());
    console.log(`[validateEmail] Email: "${email}" es válido?`, isValid);
    return isValid;
}

// 2. Funciones de popup (opcional: puedes dejarlas como están)
function showPopup() {
    const popup = document.getElementById('subscription-popup');
    if (popup) {
        popup.classList.add('show');
        popup.removeAttribute('hidden');
        popup.setAttribute('aria-hidden', 'false');
    }
}
function closePopup() {
    const popup = document.getElementById('subscription-popup');
    if (popup) {
        popup.classList.remove('show');
        popup.setAttribute('aria-hidden', 'true');
        popup.setAttribute('hidden', '');
    }
}

// Función para mostrar popup de error
function showErrorPopup() {
    const popup = document.getElementById('subscription-popup');
    if (popup) {
        popup.querySelector('h3').textContent = 'Subscription Error';
        popup.querySelector('p').textContent = 'There was an error processing your subscription. Please try again later.';
        showPopup();
    }
}

// 3. Función para enviar datos al servidor (proxy PHP)
async function submitToMautic(email) {
    try {

	const response = await fetch(`${MAUTIC_ENDPOINT}?e=${email}`);

        if (!response.ok) {
            console.error('[submitToMautic] HTTP error:', response.status);
            return false;
        }

	const text = await response.text();
        console.log('[submitToMautic] Response:', text);

        return true;

    } catch (error) {
        console.error('[submitToMautic] Fetch error:', error);
        return false;
    }
}

// 4. Función para manejar el envío del formulario
async function handleFormSubmit(form) {
    const emailInput = form.querySelector('input[type="email"]');
    const submitBtn = form.querySelector('button[type="submit"]');
    
    if (!emailInput || !submitBtn) return;

    const email = emailInput.value.trim();
    const originalBtnText = submitBtn.textContent;

    // Validación
    if (!validateEmail(email)) {
        alert('Please enter a valid email address.');
        return;
    }

    // Deshabilitar botón durante el envío
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    try {
        console.log('[formulario] 🔁 Enviando datos al servidor...');
        const success = await submitToMautic(email);

        if (success) {
            console.log('[formulario] ✅ Éxito al enviar a Mautic');
            showPopup();
            emailInput.value = '';
        } else {
            console.warn('[formulario] ❌ Falló el envío');
            showErrorPopup();
        }
    } catch (error) {
        console.error('[formulario] ❌ Error al enviar:', error);
        showErrorPopup();
    } finally {
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
    }
}

// 5. Actualiza el event listener para el formulario
//document.addEventListener('DOMContentLoaded', function() {
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.removeEventListener('submit', handleFormSubmit);
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmit(this);
        });
    }
//});


function showInitialContent() {
    // Configuramos contenido inicial apropiado para OnWorks
    document.getElementById('latest-blog-title').textContent = 'Latest OnWorks News';
    document.querySelector('.post-date-badge-main1').textContent = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    document.querySelector('.blog-link-main1').href = 'https://www.onworks.net/blog/';
}


//document.addEventListener('DOMContentLoaded', () => {
    const blogCard = document.querySelector('.alert-content-main1');

if (blogCard) {

    const noticeThumbnail = blogCard.querySelector('.notice-thumbnail-main1');
    const imageLink = blogCard.querySelector('.offidocs-link-main1');
    const readMoreLink = blogCard.querySelector('.cta-button-read-main1');
    const postHeadline = blogCard.querySelector('.post-headline-main1');
    const postDateBadge = blogCard.querySelector('.post-date-badge-main1');
    const DEFAULT_IMAGE = "https://www.offidocs.com/blog/wp-content/uploads/2025/05/RunApps-1.png";

    async function loadLatestPost() {
      try {
        const response = await fetch('https://www.onworks.net/blog/wp-json/wp/v2/posts?per_page=1&_embed');

        if (!response.ok) throw new Error('Network response was not ok');

        const [latestPost] = await response.json();

        if (!latestPost) throw new Error('No posts found');

        // Actualizamos el título
        document.getElementById('latest-blog-title').textContent = latestPost.title.rendered;

        // Formateamos la fecha
        const postDate = new Date(latestPost.date);
        document.querySelector('.post-date-badge-main1').textContent = postDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        document.querySelector('.post-date-badge-main1').setAttribute('datetime', latestPost.date);

        // Actualizamos el enlace
        document.querySelector('.blog-link-main1').href = latestPost.link;

        // Obtenemos la imagen destacada (usando _embed para evitar segunda llamada)
        if (latestPost._embedded && latestPost._embedded['wp:featuredmedia']) {
            const mediaData = latestPost._embedded['wp:featuredmedia'][0];
            const imgElement = document.querySelector('.blog-img-main1');
            imgElement.src = mediaData.source_url;
            imgElement.alt = mediaData.alt_text || 'Featured post image';
        }

      } catch (error) {
        console.error('Error loading blog post:', error);
        showInitialContent();
      } finally {
        document.querySelector('.alert-content-main1').style.display = 'block';
      }


    }

    loadLatestPost();

}

//});





