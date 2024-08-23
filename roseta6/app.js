document.addEventListener('DOMContentLoaded', function() {
    const currentPath = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-links a');

    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });

    const imageGallery = [
        { id: 'A1', src: 'path/to/image3.jpg' },
        { id: 'B2', src: 'path/to/image2.jpg' },
    ];

    let collageCode = '';
    const orderButton = document.getElementById('orderButton');

    function updateCollageCode(imageId, position, orientation) {
        collageCode += `${imageId}-${position}-${orientation}_`;
        document.getElementById('collageCode').textContent = collageCode;

        // Enable the "Proceed to Checkout" button if the collage code is valid
        if (collageCode.length > 0) {
            orderButton.disabled = false;
        }
    }

    document.querySelectorAll('.template-slot').forEach((slot, index) => {
        slot.addEventListener('click', function() {
            const selectedImageId = 'A1'; // Replace with actual image selection logic
            const orientation = 'R90'; // Replace with actual orientation logic

            updateCollageCode(selectedImageId, index + 1, orientation);

            const selectedImage = imageGallery.find(img => img.id === selectedImageId);
            if (selectedImage) {
                slot.style.backgroundImage = `url(${selectedImage.src})`;
                slot.style.backgroundSize = 'cover';
            }
        });
    });
fetch('tiles.json')
    .then(response => response.json())
    .then(tiles => {
        tiles.forEach(tile => {
            const tileElement = document.createElement('div');
            tileElement.className = 'tile';
            tileElement.style.backgroundImage = `url(${tile.src})`;
            tileElement.dataset.id = tile.id;
            tileElement.addEventListener('click', function() {
                const position = 1; // This should be the selected slot's position
                const orientation = 'R90'; // This should be based on user input
                updateCollageCode(tile.id, position, orientation);
            });
            imageGallery.appendChild(tileElement);
        });
    })
    .catch(error => console.error('Error loading tiles:', error));

    const checkoutForm = document.getElementById('checkoutForm');
    const serviceID = 'service_z8blkjs';
    const templateID = 'template_muokur4';

    orderButton.addEventListener('click', function() {
        checkoutForm.submit();
    });

    checkoutForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const codeField = document.createElement('input');
        codeField.type = 'hidden';
        codeField.name = 'collage_code';
        codeField.value = collageCode;
        this.appendChild(codeField);

        const templateParams = {
            user_name: document.getElementById('name').value,
            user_address: document.getElementById('address').value,
            user_city: document.getElementById('city').value,
            user_state: document.getElementById('state').value,
            user_zip: document.getElementById('zip').value,
            user_email: document.getElementById('email').value,
            collage_code: collageCode,
        };

        emailjs.send(serviceID, templateID, templateParams)
            .then(function(response) {
                console.log('SUCCESS!', response.status, response.text);
                alert('Email sent successfully!');
            }, function(error) {
                console.error('FAILED...', error);
                alert(`Failed to send email: ${error.text}`);
            });

        this.submit();
    });

    const paypalButton = document.getElementById('paypalButton');
    const testButton = document.getElementById('testButton');

    if (paypalButton) {
        paypalButton.addEventListener('click', function() {
            console.log('PayPal button clicked.');
            checkoutForm.requestSubmit(); // Simulates form submission to send the email
            window.location.href = 'https://www.paypal.com/ncp/payment/F2AG3LYLVNGYL';
        });
    }

    if (testButton) {
        testButton.addEventListener('click', function() {
            console.log('Test button clicked.');
            checkoutForm.requestSubmit(); // Simulates form submission to send the email
            alert('Test order processed. No payment was made.');
        });
    }
});
