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
                dotsOptions: {
                    color: APP.main.getDotsColor(),
                    type: APP.main.getSelectedDotsType()
                },
                backgroundOptions: {
                    color: APP.main.getQRBackground(),
                },
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
                    dotsOptions: {
                        color: APP.main.getDotsColor(),
                        type: APP.main.getSelectedDotsType()
                    },
                    backgroundOptions: {
                        color: APP.main.getQRBackground(),
                    },
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