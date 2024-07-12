document.addEventListener('DOMContentLoaded', () => {
    const options = document.querySelectorAll('.option button');
    const formSection = document.getElementById('form-section');
    const form = document.getElementById('custom-clothing-form');
    const formResult = document.getElementById('form-result');
    const priceInput = document.getElementById('price');
    const paypalButtonContainer = document.getElementById('paypal-button-container');
    const modal = document.getElementById("mainModal");
    const openModal = () => {
        modal.showModal();
    }
    const closeModal = () => {
        modal.close();
    }
    let selectedPrice = 0;

    options.forEach(option => {
        option.addEventListener('click', () => {
            selectedPrice = option.parentElement.getAttribute('data-price');
            priceInput.value = selectedPrice;
            formSection.style.display = 'block';
            form.scrollIntoView({ behavior: 'smooth' });

            // Limpiar el contenedor de botones de PayPal antes de renderizar uno nuevo
            paypalButtonContainer.innerHTML = '';

            renderPayPalButton(selectedPrice);
        });
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const fullName = formData.get('full-name');
        const email = formData.get('email');
        const phone = formData.get('phone');
        const country = formData.get('country');
        const clothingType = formData.get('clothing-type');
        const description = formData.get('description');
        const price = formData.get('price');

        // Validar que todos los campos estén completos
        if (!fullName || !email || !phone || !country || !clothingType || !description) {
            formResult.innerHTML = `
                <p style="color: red;">Por favor, completa todos los campos del formulario antes de proceder con el pago.</p>
            `;
            return;
        }

        // Enviar el formulario por correo electrónico
        sendEmail(formData);

        // Mostrar el mensaje de confirmación
        formResult.innerHTML = `
            <p>Gracias, ${fullName}. Tu solicitud ha sido enviada.</p>
            <p>Nos pondremos en contacto contigo en <strong>${email}</strong> para discutir los detalles de la ropa personalizada <strong>${clothingType}</strong> con la descripción: <em>${description}</em>.</p>
            <p>Teléfono: <strong>${phone}</strong></p>
            <p>País: <strong>${country}</strong></p>
            <p>Precio: <strong>${price}€</strong></p>
        `;

        form.reset();
        formSection.style.display = 'none';
    });

    function renderPayPalButton(price) {
        paypal.Buttons({
            createOrder: (data, actions) => {
                return actions.order.create({
                    purchase_units: [{
                        amount: {
                            value: price
                        }
                    }]
                });
            },
            onApprove: (data, actions) => {
                return actions.order.capture().then(details => {
                    alert('Pago completado por ' + details.payer.name.given_name);
                    form.submit();
                });
            },
            onError: err => {
                console.error(err);
                alert('Hubo un problema con tu pago. Por favor intenta de nuevo.');
            }
        }).render('#paypal-button-container');
    }

    function sendEmail(formData) {
        emailjs.send('service_aj2d2l3', 'template_u81icmi', {
            fullName: formData.get('full-name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            country: formData.get('country'),
            clothingType: formData.get('clothing-type'),
            description: formData.get('description'),
            price: formData.get('price')
        }, 'EEwWK5S0Ttv2UWpMFUz3Q5cILpVuEnGsAp6Jlj80yzdU9xbKnedOl9QGPUVUjxb4DgkbNImWUYP0bkKD')
        .then((response) => {
            console.log('SUCCESS!', response.status, response.text);
        }, (error) => {
            console.error('FAILED...', error);
        });
    }

});
