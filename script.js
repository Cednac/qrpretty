let qrSize = 300; // Default size

const qrCode = new QRCodeStyling({
    width: qrSize,
    height: qrSize,
    imageOptions: {
        crossOrigin: "anonymous",
        margin: 10
    }
});

let selectedDotsType = "square"; // Default is square dots
let dotsColor = "#000000"; // Changed from qrColor to dotsColor
let qrBackground = "#FFFFFF"; // Default background is white

let dotsColorType = 'single';
let backgroundColorType = 'single';
let dotsGradientStart = '#000000';
let dotsGradientEnd = '#000000';
let backgroundGradientStart = '#FFFFFF';
let backgroundGradientEnd = '#FFFFFF';

// Add these new variables
let dotsGradientType = 'linear';
let backgroundGradientType = 'linear';
let dotsGradientRotation = 0;
let backgroundGradientRotation = 0;

// Add these new variables at the top of your script
let cornersSquareColorType = 'single';
let cornersSquareColor = '#000000';
let cornersSquareGradientType = 'linear';
let cornersSquareGradientStart = '#000000';
let cornersSquareGradientEnd = '#000000';
let cornersSquareGradientRotation = 0;

// Add these new variables at the top of your script
let cornersDotColorType = 'single';
let cornersDotColor = '#000000';
let cornersDotGradientType = 'linear';
let cornersDotGradientStart = '#000000';
let cornersDotGradientEnd = '#000000';
let cornersDotGradientRotation = 0;

// Add event listeners for corner selection
document.getElementById('sharpOption').addEventListener('click', () => {
    selectedDotsType = "square";
    selectOption('sharpOption');
    updateQRCode();
});

document.getElementById('roundedOption').addEventListener('click', () => {
    selectedDotsType = "rounded";
    selectOption('roundedOption');
    updateQRCode();
});

document.getElementById('dotsOption').addEventListener('click', () => {
    selectedDotsType = "dots";
    selectOption('dotsOption');
    updateQRCode();
});

document.getElementById('classyOption').addEventListener('click', () => {
    selectedDotsType = "classy";
    selectOption('classyOption');
    updateQRCode();
});

document.getElementById('classy-roundedOption').addEventListener('click', () => {
    selectedDotsType = "classy-rounded";
    selectOption('classy-roundedOption');
    updateQRCode();
});

document.getElementById('extra-roundedOption').addEventListener('click', () => {
    selectedDotsType = "extra-rounded";
    selectOption('extra-roundedOption');
    updateQRCode();
});

// Add event listener for color selection
document.getElementById('qrColor').addEventListener('input', (event) => {
    dotsColor = event.target.value;
    updateQRCode();
});

// Add event listener for background color selection
document.getElementById('qrBackground').addEventListener('input', (event) => {
    qrBackground = event.target.value;
});

function selectOption(selectedId) {
    document.getElementById('sharpOption').classList.remove('selected');
    document.getElementById('roundedOption').classList.remove('selected');
    document.getElementById('dotsOption').classList.remove('selected');
    document.getElementById('classyOption').classList.remove('selected');
    document.getElementById('classy-roundedOption').classList.remove('selected');
    document.getElementById('extra-roundedOption').classList.remove('selected');
    document.getElementById(selectedId).classList.add('selected');
}

let currentLogo = null;
let logoMargin = 5; // Default value
let logoSize = 0.4; // Default value (40% of QR code size)

const logoMarginSlider = document.getElementById('logoMargin');
const logoMarginValue = document.getElementById('logoMarginValue');
const logoMarginContainer = document.getElementById('logoMarginContainer');
const logoSizeSlider = document.getElementById('logoSize');
const logoSizeValue = document.getElementById('logoSizeValue');
const logoSizeContainer = document.getElementById('logoSizeContainer');

logoMarginSlider.addEventListener('input', (event) => {
    logoMargin = parseInt(event.target.value);
    logoMarginValue.textContent = logoMargin;
});

logoSizeSlider.addEventListener('input', (event) => {
    logoSize = parseInt(event.target.value) / 100;
    logoSizeValue.textContent = event.target.value;
    updateQRCode(); // Add this line to update QR code in real-time
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
        logoMarginContainer.style.display = 'none';
        logoSizeContainer.style.display = 'none';
        return;
    }

    let dotsOptions = {
        type: selectedDotsType === 'classy-rounded' ? 'rounded' : selectedDotsType
    };

    if (dotsColorType === 'single') {
        dotsOptions.color = dotsColor;
    } else {
        dotsOptions.gradient = {
            type: dotsGradientType,
            rotation: dotsGradientType === 'linear' ? parseInt(document.getElementById('dotsGradientRotation').value) : 0,
            colorStops: [
                { offset: 0, color: document.getElementById('dotsGradientStart').value },
                { offset: 1, color: document.getElementById('dotsGradientEnd').value }
            ]
        };
    }

    let backgroundOptions = {};

    if (backgroundColorType === 'single') {
        backgroundOptions.color = qrBackground;
    } else {
        backgroundOptions.gradient = {
            type: backgroundGradientType,
            rotation: backgroundGradientType === 'linear' ? parseInt(document.getElementById('backgroundGradientRotation').value) : 0,
            colorStops: [
                { offset: 0, color: document.getElementById('backgroundGradientStart').value },
                { offset: 1, color: document.getElementById('backgroundGradientEnd').value }
            ]
        };
    }

    let cornersSquareOptions = {
        type: selectedDotsType === 'classy' || selectedDotsType === 'classy-rounded' ? 'extra-rounded' : 
              selectedDotsType === 'dots' ? 'dot' : selectedDotsType
    };

    if (cornersSquareColorType === 'single') {
        cornersSquareOptions.color = document.getElementById('cornersSquareColor').value;
    } else {
        cornersSquareOptions.gradient = {
            type: cornersSquareGradientType,
            rotation: cornersSquareGradientType === 'linear' ? parseInt(document.getElementById('cornersSquareGradientRotation').value) : 0,
            colorStops: [
                { offset: 0, color: document.getElementById('cornersSquareGradientStart').value },
                { offset: 1, color: document.getElementById('cornersSquareGradientEnd').value }
            ]
        };
    }

    let cornersDotOptions = {
        type: selectedDotsType === 'classy' ? 'dot' : 
              selectedDotsType === 'classy-rounded' ? 'rounded' : 
              selectedDotsType === 'dots' ? 'dot' : selectedDotsType
    };

    if (cornersDotColorType === 'single') {
        cornersDotOptions.color = document.getElementById('cornersDotColor').value;
    } else {
        cornersDotOptions.gradient = {
            type: cornersDotGradientType,
            rotation: cornersDotGradientType === 'linear' ? parseInt(document.getElementById('cornersDotGradientRotation').value) : 0,
            colorStops: [
                { offset: 0, color: document.getElementById('cornersDotGradientStart').value },
                { offset: 1, color: document.getElementById('cornersDotGradientEnd').value }
            ]
        };
    }

    qrCode.update({
        width: qrSize,
        height: qrSize,
        data: text,
        dotsOptions: dotsOptions,
        cornersSquareOptions: cornersSquareOptions,
        cornersDotOptions: cornersDotOptions,
        backgroundOptions: backgroundOptions,
        imageOptions: {
            crossOrigin: "anonymous",
            margin: logoMargin,
            imageSize: logoSize,
            hideBackgroundDots: true,
        },
        image: currentLogo
    });

    logoMarginContainer.style.display = currentLogo ? 'block' : 'none';
    logoSizeContainer.style.display = currentLogo ? 'block' : 'none';
    document.getElementById('qrSizeValue').textContent = qrSize;
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
            color: dotsColor, // Changed from qrColor to dotsColor
            type: selectedDotsType
        },
        backgroundOptions: {
            color: qrBackground,
        },
        imageOptions: {
            crossOrigin: "anonymous",
            margin: logoMargin,
            imageSize: logoSize,
            hideBackgroundDots: true,
        },
        image: currentLogo
    });

    // Remove this line to prevent duplicate QR codes
    // qrCode.append(document.getElementById("qr-code"));
}

// Add this function to initialize the QR code
function initQRCode() {
    qrCode.append(document.getElementById("qr-code"));
}

// Call this function once when the page loads
initQRCode();

// Modify these existing event listeners:
document.getElementById('removeLogo').addEventListener('click', () => {
    currentLogo = null;
    document.getElementById('qrLogo').value = '';
    document.getElementById('removeLogo').style.display = 'none';
    logoMarginContainer.style.display = 'none';
    logoSizeContainer.style.display = 'none';
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
            logoSizeContainer.style.display = 'block';
        };
        reader.readAsDataURL(logoFile);
    } else {
        currentLogo = null;
        updateQRCode();
        document.getElementById('removeLogo').style.display = 'none';
        logoMarginContainer.style.display = 'none';
        logoSizeContainer.style.display = 'none';
    }
});

// Update these event listeners to use 'input' instead of 'change'
logoMarginSlider.addEventListener('input', updateQRCode);
logoSizeSlider.addEventListener('input', updateQRCode);

// Remove or comment out these lines as they're now redundant
// logoMarginSlider.addEventListener('change', updateQRCode);
// logoSizeSlider.addEventListener('change', updateQRCode);

// Add this to update QR code when slider changes
logoMarginSlider.addEventListener('change', updateQRCode);

// Add this new event listener for the download button
downloadButton.addEventListener('click', () => {
    const fileType = document.getElementById('fileType').value;
    downloadQRCode(fileType);
});

// Add this to update QR code when color changes
document.getElementById('qrColor').addEventListener('change', updateQRCode);

// Add this to update QR code when background color changes
document.getElementById('qrBackground').addEventListener('change', updateQRCode);

// Add this new function to handle different file type downloads
function downloadQRCode(fileType) {
    const fileName = "qr-code";
    
    switch (fileType) {
        case 'png':
        case 'jpeg':
            qrCode.download({ name: fileName, extension: fileType });
            break;
        case 'svg':
            downloadSVG(fileName);
            break;
        case 'pdf':
            downloadPDF(fileName);
            break;
        case 'tiff':
            downloadTIFF(fileName);
            break;
    }
}

function getQRCodeCanvas() {
    return new Promise((resolve) => {
        qrCode.getRawData('png').then(blob => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                resolve(canvas);
            };
            img.src = URL.createObjectURL(blob);
        });
    });
}

function downloadSVG(fileName) {
    getQRCodeCanvas().then(canvas => {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        const image = document.createElementNS("http://www.w3.org/2000/svg", "image");
        
        svg.setAttribute("width", canvas.width);
        svg.setAttribute("height", canvas.height);
        svg.setAttribute("viewBox", `0 0 ${canvas.width} ${canvas.height}`);
        
        image.setAttribute("width", canvas.width);
        image.setAttribute("height", canvas.height);
        image.setAttribute("href", canvas.toDataURL("image/png"));
        
        svg.appendChild(image);
        
        const svgData = new XMLSerializer().serializeToString(svg);
        const svgBlob = new Blob([svgData], {type: "image/svg+xml;charset=utf-8"});
        downloadBlob(svgBlob, `${fileName}.svg`);
    });
}

function downloadPDF(fileName) {
    getQRCodeCanvas().then(canvas => {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF();
        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        pdf.addImage(imgData, 'JPEG', 0, 0, 210, 210);
        pdf.save(`${fileName}.pdf`);
    });
}

function downloadTIFF(fileName) {
    getQRCodeCanvas().then(canvas => {
        const ctx = canvas.getContext('2d');
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
        // Create a TIFF file
        const tiffArr = new Uint8Array(UTIF.encodeImage(imageData.data, canvas.width, canvas.height));
        
        // Create a Blob from the TIFF array
        const tiffBlob = new Blob([tiffArr], { type: 'image/tiff' });
        
        // Download the TIFF file
        downloadBlob(tiffBlob, `${fileName}.tiff`);
    });
}

function downloadBlob(blob, fileName) {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(link.href);
}

// Function to convert PNG to TIFF (you'll need to implement this)
function convertToTIFF(pngBlob) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            
            const tiffData = UTIF.encodeImage(imageData.data, canvas.width, canvas.height);
            const tiffBlob = new Blob([tiffData.buffer], { type: 'image/tiff' });
            resolve(tiffBlob);
        };
        img.onerror = reject;
        img.src = URL.createObjectURL(pngBlob);
    });
}

// Add this at the beginning of your script
const downloadOptions = document.getElementById('downloadOptions');
const qrTextInput = document.getElementById('qrText');

// Add this function to your script
function updateDownloadOptions() {
    if (qrTextInput.value.trim()) {
        downloadOptions.style.display = 'flex';
    } else {
        downloadOptions.style.display = 'none';
    }
}

// Add this event listener
qrTextInput.addEventListener('input', updateDownloadOptions);

// Call this function initially to set the correct state
updateDownloadOptions();

// Update the updateQRSize function
function updateQRSize() {
    qrSize = parseInt(document.getElementById('qrSize').value);
    document.getElementById('qrSizeValue').textContent = qrSize;
    qrCode.update({
        width: qrSize,
        height: qrSize
    });
    updateQRCode();
}

// Add event listener for size input
document.getElementById('qrSize').addEventListener('input', updateQRSize);

// Add these new event listeners
document.getElementById('dotsColorType').addEventListener('change', updateDotsColorType);
document.getElementById('backgroundColorType').addEventListener('change', updateBackgroundColorType);
document.getElementById('dotsGradientStart').addEventListener('input', updateQRCode);
document.getElementById('dotsGradientEnd').addEventListener('input', updateQRCode);
document.getElementById('backgroundGradientStart').addEventListener('input', updateQRCode);
document.getElementById('backgroundGradientEnd').addEventListener('input', updateQRCode);

function updateDotsColorType(event) {
    dotsColorType = event.target.value;
    document.getElementById('dotsSingleColor').style.display = dotsColorType === 'single' ? 'block' : 'none';
    document.getElementById('dotsGradient').style.display = dotsColorType === 'gradient' ? 'block' : 'none';
    document.getElementById('dotsGradientType').style.display = dotsColorType === 'gradient' ? 'inline-block' : 'none';
    updateDotsGradientType({ target: { value: dotsGradientType } });
    updateQRCode();
}

function updateBackgroundColorType(event) {
    backgroundColorType = event.target.value;
    document.getElementById('backgroundSingleColor').style.display = backgroundColorType === 'single' ? 'block' : 'none';
    document.getElementById('backgroundGradient').style.display = backgroundColorType === 'gradient' ? 'block' : 'none';
    document.getElementById('backgroundGradientType').style.display = backgroundColorType === 'gradient' ? 'inline-block' : 'none';
    updateBackgroundGradientType({ target: { value: backgroundGradientType } });
    updateQRCode();
}

// Add these new event listeners
document.getElementById('dotsGradientType').addEventListener('change', updateDotsGradientType);
document.getElementById('backgroundGradientType').addEventListener('change', updateBackgroundGradientType);
document.getElementById('dotsGradientRotation').addEventListener('input', updateQRCode);
document.getElementById('backgroundGradientRotation').addEventListener('input', updateQRCode);

// Add these new functions
function updateDotsGradientType(event) {
    dotsGradientType = event.target.value;
    document.getElementById('dotsLinearGradientRotation').style.display = dotsGradientType === 'linear' ? 'block' : 'none';
    updateQRCode();
}

function updateBackgroundGradientType(event) {
    backgroundGradientType = event.target.value;
    document.getElementById('backgroundLinearGradientRotation').style.display = backgroundGradientType === 'linear' ? 'block' : 'none';
    updateQRCode();
}

// Add these new event listeners
document.getElementById('cornersSquareColorType').addEventListener('change', updateCornersSquareColorType);
document.getElementById('cornersSquareColor').addEventListener('input', updateQRCode);
document.getElementById('cornersSquareGradientType').addEventListener('change', updateCornersSquareGradientType);
document.getElementById('cornersSquareGradientStart').addEventListener('input', updateQRCode);
document.getElementById('cornersSquareGradientEnd').addEventListener('input', updateQRCode);
document.getElementById('cornersSquareGradientRotation').addEventListener('input', updateQRCode);

// Add these new functions
function updateCornersSquareColorType(event) {
    cornersSquareColorType = event.target.value;
    document.getElementById('cornersSquareSingleColor').style.display = cornersSquareColorType === 'single' ? 'block' : 'none';
    document.getElementById('cornersSquareGradient').style.display = cornersSquareColorType === 'gradient' ? 'block' : 'none';
    document.getElementById('cornersSquareGradientType').style.display = cornersSquareColorType === 'gradient' ? 'inline-block' : 'none';
    updateCornersSquareGradientType({ target: { value: cornersSquareGradientType } });
    updateQRCode();
}

function updateCornersSquareGradientType(event) {
    cornersSquareGradientType = event.target.value;
    document.getElementById('cornersSquareLinearGradientRotation').style.display = cornersSquareGradientType === 'linear' ? 'block' : 'none';
    updateQRCode();
}

// Add these new event listeners
document.getElementById('cornersDotColorType').addEventListener('change', updateCornersDotColorType);
document.getElementById('cornersDotColor').addEventListener('input', updateQRCode);
document.getElementById('cornersDotGradientType').addEventListener('change', updateCornersDotGradientType);
document.getElementById('cornersDotGradientStart').addEventListener('input', updateQRCode);
document.getElementById('cornersDotGradientEnd').addEventListener('input', updateQRCode);
document.getElementById('cornersDotGradientRotation').addEventListener('input', updateQRCode);

// Add these new functions
function updateCornersDotColorType(event) {
    cornersDotColorType = event.target.value;
    document.getElementById('cornersDotSingleColor').style.display = cornersDotColorType === 'single' ? 'block' : 'none';
    document.getElementById('cornersDotGradient').style.display = cornersDotColorType === 'gradient' ? 'block' : 'none';
    document.getElementById('cornersDotGradientType').style.display = cornersDotColorType === 'gradient' ? 'inline-block' : 'none';
    updateCornersDotGradientType({ target: { value: cornersDotGradientType } });
    updateQRCode();
}

function updateCornersDotGradientType(event) {
    cornersDotGradientType = event.target.value;
    document.getElementById('cornersDotLinearGradientRotation').style.display = cornersDotGradientType === 'linear' ? 'block' : 'none';
    updateQRCode();
}

// Add this at the beginning of your script
const collapsibles = document.querySelectorAll('.collapsible-header');

// Add this function to your script
function initCollapsibles() {
    collapsibles.forEach(collapsible => {
        collapsible.addEventListener('click', function() {
            this.classList.toggle('active');
            const content = this.nextElementSibling;
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
                content.classList.remove('active');
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
                content.classList.add('active');
            }
        });
    });
}

// Call this function when the page loads
document.addEventListener('DOMContentLoaded', initCollapsibles);