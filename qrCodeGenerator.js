var APP = APP || {};

APP.qrCodeGenerator = (function() {
    let qrCode;

    function initQRCode() {
        qrCode = new QRCodeStyling({
            width: APP.main.getQRSize(),
            height: APP.main.getQRSize(),
            imageOptions: {
                crossOrigin: "anonymous",
                margin: 10
            }
        });
        qrCode.append(document.getElementById("qr-code"));
    }

    function updateQRCode() {
        const text = document.getElementById('qrText').value.trim();
        
        if (!text) {
            document.getElementById("qr-code").innerHTML = '';
            document.getElementById('logoMarginContainer').style.display = 'none';
            document.getElementById('logoSizeContainer').style.display = 'none';
            return;
        }

        let dotsOptions = {
            type: APP.main.getSelectedDotsType() === 'classy-rounded' ? 'rounded' : APP.main.getSelectedDotsType()
        };

        if (APP.main.getDotsColorType() === 'single') {
            dotsOptions.color = APP.main.getDotsColor();
        } else {
            dotsOptions.gradient = {
                type: APP.main.getDotsGradientType(),
                rotation: APP.main.getDotsGradientType() === 'linear' ? parseInt(document.getElementById('dotsGradientRotation').value) : 0,
                colorStops: [
                    { offset: 0, color: document.getElementById('dotsGradientStart').value },
                    { offset: 1, color: document.getElementById('dotsGradientEnd').value }
                ]
            };
        }

        let backgroundOptions = {};

        if (APP.main.getBackgroundColorType() === 'single') {
            backgroundOptions.color = APP.main.getQRBackground();
        } else {
            backgroundOptions.gradient = {
                type: APP.main.getBackgroundGradientType(),
                rotation: APP.main.getBackgroundGradientType() === 'linear' ? parseInt(document.getElementById('backgroundGradientRotation').value) : 0,
                colorStops: [
                    { offset: 0, color: document.getElementById('backgroundGradientStart').value },
                    { offset: 1, color: document.getElementById('backgroundGradientEnd').value }
                ]
            };
        }

        let cornersSquareOptions = {
            type: APP.main.getSelectedDotsType() === 'classy' || APP.main.getSelectedDotsType() === 'classy-rounded' ? 'extra-rounded' : 
                  APP.main.getSelectedDotsType() === 'dots' ? 'dot' : APP.main.getSelectedDotsType()
        };

        if (APP.main.getCornersSquareColorType() === 'single') {
            cornersSquareOptions.color = document.getElementById('cornersSquareColor').value;
        } else {
            cornersSquareOptions.gradient = {
                type: APP.main.getCornersSquareGradientType(),
                rotation: APP.main.getCornersSquareGradientType() === 'linear' ? parseInt(document.getElementById('cornersSquareGradientRotation').value) : 0,
                colorStops: [
                    { offset: 0, color: document.getElementById('cornersSquareGradientStart').value },
                    { offset: 1, color: document.getElementById('cornersSquareGradientEnd').value }
                ]
            };
        }

        let cornersDotOptions = {
            type: APP.main.getSelectedDotsType() === 'classy' ? 'dot' : 
                  APP.main.getSelectedDotsType() === 'classy-rounded' ? 'rounded' : 
                  APP.main.getSelectedDotsType() === 'dots' ? 'dot' : APP.main.getSelectedDotsType()
        };

        if (APP.main.getCornersDotColorType() === 'single') {
            cornersDotOptions.color = document.getElementById('cornersDotColor').value;
        } else {
            cornersDotOptions.gradient = {
                type: APP.main.getCornersDotGradientType(),
                rotation: APP.main.getCornersDotGradientType() === 'linear' ? parseInt(document.getElementById('cornersDotGradientRotation').value) : 0,
                colorStops: [
                    { offset: 0, color: document.getElementById('cornersDotGradientStart').value },
                    { offset: 1, color: document.getElementById('cornersDotGradientEnd').value }
                ]
            };
        }

        qrCode.update({
            width: APP.main.getQRSize(),
            height: APP.main.getQRSize(),
            data: text,
            dotsOptions: dotsOptions,
            cornersSquareOptions: cornersSquareOptions,
            cornersDotOptions: cornersDotOptions,
            backgroundOptions: backgroundOptions,
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

        document.getElementById('logoMarginContainer').style.display = APP.main.getCurrentLogo() ? 'block' : 'none';
        document.getElementById('logoSizeContainer').style.display = APP.main.getCurrentLogo() ? 'block' : 'none';
        document.getElementById('qrSizeValue').textContent = APP.main.getQRSize();

        // Update the collapsible content size
        APP.uiControls.updateCollapsibleContentSize(document.querySelector('.collapsible-content.active'));
    }

    function generateQRCode(text) {
        qrCode.update({
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
            image: APP.main.getCurrentLogo()
        });
    }

    function getQRCodeInstance() {
        return qrCode;
    }

    return {
        initQRCode: initQRCode,
        updateQRCode: updateQRCode,
        generateQRCode: generateQRCode,
        getQRCodeInstance: getQRCodeInstance
    };
})();