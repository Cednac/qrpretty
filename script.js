const qrCode = new QRCodeStyling({
    width: 280, // Increased from 250 to 280
    height: 280, // Increased from 250 to 280
    imageOptions: {
        crossOrigin: "anonymous",
        margin: 10
    }
});

let selectedCornerType = "square"; // Default is sharp (square)

// Add event listeners for corner selection
document.getElementById('sharpOption').addEventListener('click', () => {
    selectedCornerType = "square";
    selectOption('sharpOption');
});

document.getElementById('roundedOption').addEventListener('click', () => {
    selectedCornerType = "extra-rounded";
    selectOption('roundedOption');
});

function selectOption(selectedId) {
    document.getElementById('sharpOption').classList.remove('selected');
    document.getElementById('roundedOption').classList.remove('selected');
    document.getElementById(selectedId).classList.add('selected');
}

let currentLogo = null;

document.getElementById('generateQR').addEventListener('click', () => {
    const text = document.getElementById('qrText').value;
    const logoFile = document.getElementById('qrLogo').files[0];

    if (logoFile) {
        const reader = new FileReader();
        reader.onload = function (event) {
            currentLogo = event.target.result;
            generateQRCode(text, currentLogo);
            document.getElementById('removeLogo').style.display = 'inline-block';
        };
        reader.readAsDataURL(logoFile);
    } else {
        generateQRCode(text, currentLogo);
    }
});

document.getElementById('removeLogo').addEventListener('click', () => {
    currentLogo = null;
    document.getElementById('qrLogo').value = '';
    document.getElementById('removeLogo').style.display = 'none';
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
            color: "#000",
            type: selectedCornerType // Apply the selected type to both dots and corners
        },
        cornersSquareOptions: {
            type: selectedCornerType, // Sharp or rounded for corners
            color: "#000"
        },
        cornersDotOptions: {
            type: selectedCornerType, // Sharp or rounded for corner dots
            color: "#000"
        },
        image: logo,
        imageOptions: {
            margin: 10,
            crossOrigin: "anonymous"
        }
    });
    qrCode.append(document.getElementById("qr-code"));
}
