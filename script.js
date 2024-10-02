const qrCode = new QRCodeStyling({
    width: 280, // Increased from 250 to 280
    height: 280, // Increased from 250 to 280
    imageOptions: {
        crossOrigin: "anonymous",
        margin: 10
    }
});

let selectedCornerType = "square"; // Default is sharp (square)
let qrColor = "#000000"; // Default color is black
let qrBackground = "#FFFFFF"; // Default background is white

// Add event listeners for corner selection
document.getElementById('sharpOption').addEventListener('click', () => {
    selectedCornerType = "square";
    selectOption('sharpOption');
});

document.getElementById('roundedOption').addEventListener('click', () => {
    selectedCornerType = "extra-rounded";
    selectOption('roundedOption');
});

// Add event listener for color selection
document.getElementById('qrColor').addEventListener('input', (event) => {
    qrColor = event.target.value;
});

// Add event listener for background color selection
document.getElementById('qrBackground').addEventListener('input', (event) => {
    qrBackground = event.target.value;
});

function selectOption(selectedId) {
    document.getElementById('sharpOption').classList.remove('selected');
    document.getElementById('roundedOption').classList.remove('selected');
    document.getElementById(selectedId).classList.add('selected');
}

let currentLogo = null;
let logoMargin = 5; // Default value

const logoMarginSlider = document.getElementById('logoMargin');
const logoMarginValue = document.getElementById('logoMarginValue');
const logoMarginContainer = document.getElementById('logoMarginContainer');

logoMarginSlider.addEventListener('input', (event) => {
    logoMargin = parseInt(event.target.value);
    logoMarginValue.textContent = logoMargin;
});

const downloadButton = document.getElementById('downloadQR');

document.getElementById('generateQR').addEventListener('click', () => {
    const text = document.getElementById('qrText').value.trim();
    
    if (!text) {
        alert('Please enter some text or URL before generating the QR code.');
        return;
    }

    const logoFile = document.getElementById('qrLogo').files[0];

    if (logoFile) {
        const reader = new FileReader();
        reader.onload = function (event) {
            currentLogo = event.target.result;
            generateQRCode(text, currentLogo);
            document.getElementById('removeLogo').style.display = 'inline-block'; // Changed from 'inline' to 'inline-block'
            logoMarginContainer.style.display = 'block';
            downloadButton.style.display = 'inline-block'; // Show download button
        };
        reader.readAsDataURL(logoFile);
    } else {
        generateQRCode(text, currentLogo);
        downloadButton.style.display = 'inline-block'; // Show download button
    }
});

document.getElementById('removeLogo').addEventListener('click', () => {
    currentLogo = null;
    document.getElementById('qrLogo').value = '';
    document.getElementById('removeLogo').style.display = 'none';
    logoMarginContainer.style.display = 'none';
    const text = document.getElementById('qrText').value;
    generateQRCode(text, null);
});

function generateQRCode(text, logo) {
    qrCode.update({
        data: text,
        qrOptions: {
            errorCorrectionLevel: "H"
        },
        dotsOptions: {
            color: qrColor,
            type: selectedCornerType // Apply the selected type to both dots and corners
        },
        cornersSquareOptions: {
            type: selectedCornerType, // Sharp or rounded for corners
            color: qrColor
        },
        cornersDotOptions: {
            type: selectedCornerType, // Sharp or rounded for corner dots
            color: qrColor
        },
        backgroundOptions: {
            color: qrBackground,
        },
        image: logo,
        imageOptions: {
            crossOrigin: "anonymous",
            margin: logoMargin, // Use the user-defined margin
            imageSize: 0.3 // This sets the logo size to 30% of the QR code size
        }
    });
    qrCode.append(document.getElementById("qr-code"));
    downloadButton.style.display = 'inline-block'; // Show download button
}

// Add this to update QR code when slider changes
logoMarginSlider.addEventListener('change', () => {
    const text = document.getElementById('qrText').value;
    generateQRCode(text, currentLogo);
});

// Add this new event listener for the download button
downloadButton.addEventListener('click', () => {
    qrCode.download({ name: "qr-code", extension: "png" });
});

// Add this to update QR code when color changes
document.getElementById('qrColor').addEventListener('change', () => {
    const text = document.getElementById('qrText').value;
    generateQRCode(text, currentLogo);
});

// Add this to update QR code when background color changes
document.getElementById('qrBackground').addEventListener('change', () => {
    const text = document.getElementById('qrText').value;
    generateQRCode(text, currentLogo);
});
