var APP = APP || {};

APP.bulkOperations = (function() {
    function generateBulkQRCodes() {
        const bulkQRCodesContainer = document.getElementById('bulkQRCodes');
        bulkQRCodesContainer.innerHTML = '';

        console.log("Generating bulk QR codes for", APP.main.getCSVData().length, "records");

        APP.main.getCSVData().forEach((text, index) => {
            const qrContainer = document.createElement('div');
            qrContainer.className = 'qr-container';
            
            const qrCode = new QRCodeStyling({
                width: 200,
                height: 200,
                data: text,
                dotsOptions: getDotsOptions(),
                cornersSquareOptions: getCornersSquareOptions(),
                cornersDotOptions: getCornersDotOptions(),
                backgroundOptions: getBackgroundOptions(),
                imageOptions: {
                    crossOrigin: "anonymous",
                    margin: APP.main.getLogoMargin(),
                    imageSize: APP.main.getLogoSize(),
                    hideBackgroundDots: true,
                },
                image: APP.main.getCurrentLogo(),
                qrOptions: {
                    errorCorrectionLevel: APP.main.getErrorCorrectionLevel()
                }
            });

            const qrElement = document.createElement('div');
            qrCode.append(qrElement);

            const textElement = document.createElement('p');
            textElement.textContent = text;

            qrContainer.appendChild(qrElement);
            qrContainer.appendChild(textElement);
            bulkQRCodesContainer.appendChild(qrContainer);

            console.log("Generated QR code for:", text);
        });

        APP.uiControls.updateCollapsibleContentSize(document.getElementById('bulkQRCodes').closest('.collapsible-content'));
    }

    function getDotsOptions() {
        const options = {
            type: APP.main.getSelectedDotsType() === 'classy-rounded' ? 'rounded' : APP.main.getSelectedDotsType()
        };
        return addColorOptions(options, APP.main.getDotsColorType(), 'qrColor', 'dotsGradientStart', 'dotsGradientEnd', 'dotsGradientTypeSelect', 'dotsGradientRotation');
    }

    function getBackgroundOptions() {
        const options = {};
        return addColorOptions(options, APP.main.getBackgroundColorType(), 'qrBackground', 'backgroundGradientStart', 'backgroundGradientEnd', 'backgroundGradientTypeSelect', 'backgroundGradientRotation');
    }

    function getCornersSquareOptions() {
        const options = {
            type: APP.main.getSelectedDotsType() === 'classy' || APP.main.getSelectedDotsType() === 'classy-rounded' ? 'extra-rounded' : 
              APP.main.getSelectedDotsType() === 'dots' ? 'dot' : APP.main.getSelectedDotsType()
        };
        return addColorOptions(options, APP.main.getCornersSquareColorType(), 'cornersSquareColor', 'cornersSquareGradientStart', 'cornersSquareGradientEnd', 'cornersSquareGradientTypeSelect', 'cornersSquareGradientRotation');
    }

    function getCornersDotOptions() {
        const options = {
            type: APP.main.getSelectedDotsType() === 'classy' ? 'dot' : 
              APP.main.getSelectedDotsType() === 'classy-rounded' ? 'rounded' : 
              APP.main.getSelectedDotsType() === 'dots' ? 'dot' : APP.main.getSelectedDotsType()
        };
        return addColorOptions(options, APP.main.getCornersDotColorType(), 'cornersDotColor', 'cornersDotGradientStart', 'cornersDotGradientEnd', 'cornersDotGradientTypeSelect', 'cornersDotGradientRotation');
    }

    function addColorOptions(options, colorType, singleColorId, gradientStartId, gradientEndId, gradientTypeId, gradientRotationId) {
        if (colorType === 'single') {
            options.color = document.getElementById(singleColorId).value;
        } else {
            options.gradient = {
                type: document.getElementById(gradientTypeId).value,
                rotation: document.getElementById(gradientTypeId).value === 'linear' ? parseInt(document.getElementById(gradientRotationId).value) : 0,
                colorStops: [
                    { offset: 0, color: document.getElementById(gradientStartId).value },
                    { offset: 1, color: document.getElementById(gradientEndId).value }
                ]
            };
        }
        return options;
    }

    function downloadBulkQRCodes() {
        const fileType = document.getElementById('bulkFileType').value;
        const zip = new JSZip();
        const promises = [];

        APP.main.getCSVData().forEach((text, index) => {
            const fileName = `qr-code-${index + 1}`;
            const promise = new Promise((resolve) => {
                const tempQrCode = new QRCodeStyling({
                    width: 200,
                    height: 200,
                    data: text,
                    dotsOptions: getDotsOptions(),
                    cornersSquareOptions: getCornersSquareOptions(),
                    cornersDotOptions: getCornersDotOptions(),
                    backgroundOptions: getBackgroundOptions(),
                    imageOptions: {
                        crossOrigin: "anonymous",
                        margin: APP.main.getLogoMargin(),
                        imageSize: APP.main.getLogoSize(),
                        hideBackgroundDots: true,
                    },
                    image: APP.main.getCurrentLogo(),
                    qrOptions: {
                        errorCorrectionLevel: APP.main.getErrorCorrectionLevel()
                    }
                });

                tempQrCode.getRawData(fileType).then(blob => {
                    zip.file(`${fileName}.${fileType}`, blob);
                    resolve();
                });
            });
            promises.push(promise);
        });

        Promise.all(promises).then(() => {
            zip.generateAsync({type:"blob"}).then(function(content) {
                const link = document.createElement('a');
                link.href = URL.createObjectURL(content);
                link.download = `bulk-qr-codes.zip`;
                link.click();
                URL.revokeObjectURL(link.href);
            });
        });
    }

    return {
        generateBulkQRCodes: generateBulkQRCodes,
        downloadBulkQRCodes: downloadBulkQRCodes
    };
})();