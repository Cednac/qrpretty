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

        let backgroundOptions = {};
        let cornersSquareOptions = {
            type: APP.main.getSelectedDotsType() === 'classy' || APP.main.getSelectedDotsType() === 'classy-rounded' ? 'extra-rounded' : 
                  APP.main.getSelectedDotsType() === 'dots' ? 'dot' : APP.main.getSelectedDotsType()
        };
        let cornersDotOptions = {
            type: APP.main.getSelectedDotsType() === 'classy' ? 'dot' : 
                  APP.main.getSelectedDotsType() === 'classy-rounded' ? 'rounded' : 
                  APP.main.getSelectedDotsType() === 'dots' ? 'dot' : APP.main.getSelectedDotsType()
        };

        const updateColorOptions = (options, colorType, singleColorId, gradientStartId, gradientEndId, gradientTypeId, gradientRotationId) => {
            options.color = undefined;
            options.gradient = undefined;

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
        };

        updateColorOptions(dotsOptions, APP.main.getDotsColorType(), 'qrColor', 'dotsGradientStart', 'dotsGradientEnd', 'dotsGradientTypeSelect', 'dotsGradientRotation');
        updateColorOptions(backgroundOptions, APP.main.getBackgroundColorType(), 'qrBackground', 'backgroundGradientStart', 'backgroundGradientEnd', 'backgroundGradientTypeSelect', 'backgroundGradientRotation');
        updateColorOptions(cornersSquareOptions, APP.main.getCornersSquareColorType(), 'cornersSquareColor', 'cornersSquareGradientStart', 'cornersSquareGradientEnd', 'cornersSquareGradientTypeSelect', 'cornersSquareGradientRotation');
        updateColorOptions(cornersDotOptions, APP.main.getCornersDotColorType(), 'cornersDotColor', 'cornersDotGradientStart', 'cornersDotGradientEnd', 'cornersDotGradientTypeSelect', 'cornersDotGradientRotation');

        console.log('Updating QR Code with options:', {
            dotsOptions,
            backgroundOptions,
            cornersSquareOptions,
            cornersDotOptions
        });

        const logoMargin = parseInt(document.getElementById('logoMargin').value);
        const logoSize = parseFloat(document.getElementById('logoSize').value) / 100;

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
                margin: logoMargin,
                imageSize: logoSize,
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