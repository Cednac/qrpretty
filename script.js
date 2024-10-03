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

// Define downloadButton at the top of your script
const downloadButton = document.getElementById('downloadQR');

// Remove the 'generateQR' button event listener and add this:
document.getElementById('qrText').addEventListener('input', debounce(updateQRCode, 300));

// Add these new functions:
function updateQRCode() {
    const text = document.getElementById('qrText').value.trim();
    
    if (!text) {
        document.getElementById("qr-code").innerHTML = '';
        downloadButton.style.display = 'none';
        logoMarginContainer.style.display = 'none';
        return;
    }

    generateQRCode(text);
    downloadButton.style.display = 'inline-block';
    logoMarginContainer.style.display = currentLogo ? 'block' : 'none';
}

function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

function generateQRCode(text) {
    qrCode.update({
        data: text,
        dotsOptions: {
            color: qrColor,
            type: selectedCornerType
        },
        backgroundOptions: {
            color: qrBackground,
        },
        imageOptions: {
            crossOrigin: "anonymous",
            margin: logoMargin,
            imageSize: 0.4,
            hideBackgroundDots: true,
        },
        image: currentLogo
    });

    qrCode.append(document.getElementById("qr-code"));
}

// Modify these existing event listeners:
document.getElementById('removeLogo').addEventListener('click', () => {
    currentLogo = null;
    document.getElementById('qrLogo').value = '';
    document.getElementById('removeLogo').style.display = 'none';
    logoMarginContainer.style.display = 'none';
    updateQRCode();
});

document.getElementById('qrLogo').addEventListener('change', (event) => {
    const logoFile = event.target.files[0];
    if (logoFile) {
        const reader = new FileReader();
        reader.onload = function (event) {
            currentLogo = event.target.result;
            updateQRCode();
            document.getElementById('removeLogo').style.display = 'inline-block';
            logoMarginContainer.style.display = 'block';
        };
        reader.readAsDataURL(logoFile);
    } else {
        currentLogo = null;
        updateQRCode();
        document.getElementById('removeLogo').style.display = 'none';
        logoMarginContainer.style.display = 'none';
    }
});

// Update these event listeners to use updateQRCode:
logoMarginSlider.addEventListener('change', updateQRCode);
document.getElementById('qrColor').addEventListener('change', updateQRCode);
document.getElementById('qrBackground').addEventListener('change', updateQRCode);
document.getElementById('sharpOption').addEventListener('click', () => {
    selectedCornerType = "square";
    selectOption('sharpOption');
    updateQRCode();
});
document.getElementById('roundedOption').addEventListener('click', () => {
    selectedCornerType = "extra-rounded";
    selectOption('roundedOption');
    updateQRCode();
});

// Add this to update QR code when slider changes
logoMarginSlider.addEventListener('change', updateQRCode);

// Add this new event listener for the download button
downloadButton.addEventListener('click', () => {
    qrCode.download({ name: "qr-code", extension: "png" });
});

// Add this to update QR code when color changes
document.getElementById('qrColor').addEventListener('change', updateQRCode);

// Add this to update QR code when background color changes
document.getElementById('qrBackground').addEventListener('change', updateQRCode);
