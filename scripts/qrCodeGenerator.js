var APP = APP || {};

APP.qrCodeGenerator = (function() {
    let qrCode;

    function initQRCode() {
        qrCode = new QRCodeStyling({
            width: APP.main.getQRSize(),
            height: APP.main.getQRSize(),
            margin: APP.main.getQRMargin(),
            imageOptions: {
                crossOrigin: "anonymous",
                margin: 10
            }
        });
        qrCode.append(document.getElementById("qr-code"));
        
        // Apply shape radius to QR code container on initialization
        const shapeRadius = APP.main.getShapeRadius();
        if (shapeRadius > 0) {
            const borderRadiusValue = `${shapeRadius}px`;
            const qrCodeContainer = document.getElementById("qr-code");
            qrCodeContainer.style.borderRadius = borderRadiusValue;
        }
    }

    function updateQRCode() {
        const text = document.getElementById('qrText').value.trim();
        
        if (!text) {
            document.getElementById("qr-code").innerHTML = '';
            document.getElementById('logoMarginContainer').style.display = 'none';
            document.getElementById('logoSizeContainer').style.display = 'none';
            return;
        }

        // Get the shape radius value
        const shapeRadius = APP.main.getShapeRadius();
        
        // Get the selected dots type without overriding due to shape radius
        let dotsType = APP.main.getSelectedDotsType();
        if (dotsType === 'classy-rounded') {
            dotsType = 'rounded';
        }

        let dotsOptions = {
            type: dotsType
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
        
        // Only apply border radius to the container, not override the dot styles
        const applyContainerRadius = shapeRadius > 0;

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
            cornersDotOptions,
            shapeRadius: shapeRadius
        });

        const logoMargin = parseInt(document.getElementById('logoMargin').value);
        const logoSize = parseFloat(document.getElementById('logoSize').value) / 100;

        // Create a new QR code instance with updated options
        const newQrCode = new QRCodeStyling({
            width: APP.main.getQRSize(),
            height: APP.main.getQRSize(),
            margin: APP.main.getQRMargin(),
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

        // Clear the container and append the new QR code
        document.getElementById("qr-code").innerHTML = '';
        newQrCode.append(document.getElementById("qr-code"));
        
        // Apply CSS border-radius to the QR code container if shape radius > 0
        const qrCodeContainer = document.getElementById("qr-code");
        if (applyContainerRadius) {
            const borderRadiusValue = `${shapeRadius}px`;
            qrCodeContainer.style.borderRadius = borderRadiusValue;
            
            // Also apply to the canvas/svg inside
            const qrCanvas = qrCodeContainer.querySelector('canvas, svg');
            if (qrCanvas) {
                qrCanvas.style.borderRadius = borderRadiusValue;
            }
        } else {
            qrCodeContainer.style.borderRadius = '0';
            const qrCanvas = qrCodeContainer.querySelector('canvas, svg');
            if (qrCanvas) {
                qrCanvas.style.borderRadius = '0';
            }
        }
        
        // Update the global qrCode reference
        qrCode = newQrCode;

        document.getElementById('logoMarginContainer').style.display = APP.main.getCurrentLogo() ? 'block' : 'none';
        document.getElementById('logoSizeContainer').style.display = APP.main.getCurrentLogo() ? 'block' : 'none';
        document.getElementById('qrSizeValue').textContent = APP.main.getQRSize();
        document.getElementById('qrMarginValue').textContent = APP.main.getQRMargin();

        // Update the collapsible content size
        APP.uiControls.updateCollapsibleContentSize(document.querySelector('.collapsible-content.active'));
    }

    function generateQRCode(text) {
        const shapeRadius = APP.main.getShapeRadius();
        
        // Get the selected dots type without modifying based on shape radius
        let dotsType = APP.main.getSelectedDotsType();
        if (dotsType === 'classy-rounded') {
            dotsType = 'rounded';
        }
        
        qrCode.update({
            data: text,
            dotsOptions: {
                color: APP.main.getDotsColor(),
                type: dotsType
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
        
        // Apply CSS border-radius to the QR code container if shape radius > 0
        const qrCodeContainer = document.getElementById("qr-code");
        if (shapeRadius > 0) {
            const borderRadiusValue = `${shapeRadius}px`;
            qrCodeContainer.style.borderRadius = borderRadiusValue;
            
            // Also apply to the canvas/svg inside
            const qrCanvas = qrCodeContainer.querySelector('canvas, svg');
            if (qrCanvas) {
                qrCanvas.style.borderRadius = borderRadiusValue;
            }
        } else {
            qrCodeContainer.style.borderRadius = '0';
            const qrCanvas = qrCodeContainer.querySelector('canvas, svg');
            if (qrCanvas) {
                qrCanvas.style.borderRadius = '0';
            }
        }
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