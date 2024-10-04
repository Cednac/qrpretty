var APP = APP || {};

APP.eventHandlers = (function() {
    function initEventListeners() {
        // QR Code text input
        document.getElementById('qrText').addEventListener('input', debounce(APP.qrCodeGenerator.updateQRCode, 300));
        document.getElementById('qrText').addEventListener('input', APP.uiControls.updateDownloadOptions);

        // QR Code size
        document.getElementById('qrSize').addEventListener('input', APP.uiControls.updateQRSize);

        // Dots style
        document.getElementById('sharpOption').addEventListener('click', () => updateDotsStyle('square'));
        document.getElementById('roundedOption').addEventListener('click', () => updateDotsStyle('rounded'));
        document.getElementById('dotsOption').addEventListener('click', () => updateDotsStyle('dots'));
        document.getElementById('classyOption').addEventListener('click', () => updateDotsStyle('classy'));
        document.getElementById('classy-roundedOption').addEventListener('click', () => updateDotsStyle('classy-rounded'));
        document.getElementById('extra-roundedOption').addEventListener('click', () => updateDotsStyle('extra-rounded'));

        // Color types and gradients
        document.getElementById('dotsColorType').addEventListener('change', function(event) {
            APP.main.setDotsColorType(event.target.value);
            APP.qrCodeGenerator.updateQRCode();
        });
        document.getElementById('backgroundColorType').addEventListener('change', APP.uiControls.updateBackgroundColorType);
        document.getElementById('cornersSquareColorType').addEventListener('change', APP.uiControls.updateCornersSquareColorType);
        document.getElementById('cornersDotColorType').addEventListener('change', APP.uiControls.updateCornersDotColorType);

        document.getElementById('dotsGradientTypeSelect').addEventListener('change', APP.uiControls.updateDotsGradientType);
        document.getElementById('backgroundGradientTypeSelect').addEventListener('change', APP.uiControls.updateBackgroundGradientType);
        document.getElementById('cornersSquareGradientTypeSelect').addEventListener('change', APP.uiControls.updateCornersSquareGradientType);
        document.getElementById('cornersDotGradientTypeSelect').addEventListener('change', APP.uiControls.updateCornersDotGradientType);

        // Color inputs
        document.getElementById('qrColor').addEventListener('input', APP.qrCodeGenerator.updateQRCode);
        document.getElementById('qrBackground').addEventListener('input', APP.qrCodeGenerator.updateQRCode);
        document.getElementById('cornersSquareColor').addEventListener('input', APP.qrCodeGenerator.updateQRCode);
        document.getElementById('cornersDotColor').addEventListener('input', APP.qrCodeGenerator.updateQRCode);

        document.getElementById('dotsGradientStart').addEventListener('input', APP.qrCodeGenerator.updateQRCode);
        document.getElementById('dotsGradientEnd').addEventListener('input', APP.qrCodeGenerator.updateQRCode);
        document.getElementById('backgroundGradientStart').addEventListener('input', APP.qrCodeGenerator.updateQRCode);
        document.getElementById('backgroundGradientEnd').addEventListener('input', APP.qrCodeGenerator.updateQRCode);
        document.getElementById('cornersSquareGradientStart').addEventListener('input', APP.qrCodeGenerator.updateQRCode);
        document.getElementById('cornersSquareGradientEnd').addEventListener('input', APP.qrCodeGenerator.updateQRCode);
        document.getElementById('cornersDotGradientStart').addEventListener('input', APP.qrCodeGenerator.updateQRCode);
        document.getElementById('cornersDotGradientEnd').addEventListener('input', APP.qrCodeGenerator.updateQRCode);

        document.getElementById('dotsGradientRotation').addEventListener('input', APP.qrCodeGenerator.updateQRCode);
        document.getElementById('backgroundGradientRotation').addEventListener('input', APP.qrCodeGenerator.updateQRCode);
        document.getElementById('cornersSquareGradientRotation').addEventListener('input', APP.qrCodeGenerator.updateQRCode);
        document.getElementById('cornersDotGradientRotation').addEventListener('input', APP.qrCodeGenerator.updateQRCode);

        // Logo
        document.getElementById('qrLogo').addEventListener('change', APP.fileOperations.handleLogoUpload);
        document.getElementById('removeLogo').addEventListener('click', APP.fileOperations.removeLogo);
        document.getElementById('logoMargin').addEventListener('input', APP.qrCodeGenerator.updateQRCode);
        document.getElementById('logoSize').addEventListener('input', APP.qrCodeGenerator.updateQRCode);

        // Error correction level
        document.getElementById('errorCorrectionLevel').addEventListener('change', (event) => {
            APP.main.setErrorCorrectionLevel(event.target.value);
            APP.qrCodeGenerator.updateQRCode();
        });

        // Download
        document.getElementById('downloadQR').addEventListener('click', () => {
            const fileType = document.getElementById('fileType').value;
            APP.fileOperations.downloadQRCode(fileType);
        });

        // Bulk operations
        document.getElementById('csvFile').addEventListener('change', APP.fileOperations.handleFileSelect);
        document.getElementById('generateBulkQR').addEventListener('click', APP.bulkOperations.generateBulkQRCodes);
        document.getElementById('downloadBulkQR').addEventListener('click', APP.bulkOperations.downloadBulkQRCodes);
    }

    function debounce(func, delay) {
        let timeoutId;
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    }

    function updateDotsStyle(style) {
        APP.main.setSelectedDotsType(style);
        document.querySelectorAll('#dotsPicker div').forEach(el => el.classList.remove('selected'));
        document.getElementById(`${style}Option`).classList.add('selected');
        APP.qrCodeGenerator.updateQRCode();
    }

    return {
        initEventListeners: initEventListeners
    };
})();