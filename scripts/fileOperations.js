var APP = APP || {};

APP.fileOperations = (function() {
    function downloadQRCode(fileType) {
        const fileName = "qr-code";
        const text = document.getElementById('qrText').value.trim();
        
        if (!text) {
            alert("Please enter some text or URL for the QR code.");
            return;
        }
        
        // Get the shape radius value
        const shapeRadius = APP.main.getShapeRadius();
        
        // Determine the dots type based on the shape radius
        let dotsType = APP.main.getSelectedDotsType();
        if (shapeRadius > 0) {
            dotsType = "rounded";
        } else if (dotsType === 'classy-rounded') {
            dotsType = 'rounded';
        }
        
        // Determine corner square type
        let cornersSquareType = APP.main.getSelectedDotsType() === 'classy' || APP.main.getSelectedDotsType() === 'classy-rounded' ? 'extra-rounded' : 
                  APP.main.getSelectedDotsType() === 'dots' ? 'dot' : APP.main.getSelectedDotsType();
        
        // If shape radius > 0, use rounded corners
        if (shapeRadius > 0) {
            cornersSquareType = "extra-rounded";
        }
        
        // Determine corner dot type
        let cornersDotType = APP.main.getSelectedDotsType() === 'classy' ? 'dot' : 
                  APP.main.getSelectedDotsType() === 'classy-rounded' ? 'rounded' : 
                  APP.main.getSelectedDotsType() === 'dots' ? 'dot' : APP.main.getSelectedDotsType();
        
        // If shape radius > 0, use rounded corner dots
        if (shapeRadius > 0) {
            cornersDotType = "rounded";
        }
        
        // Create a temporary QR code with the same options for download
        const tempQrCode = new QRCodeStyling({
            width: APP.main.getQRSize(),
            height: APP.main.getQRSize(),
            margin: APP.main.getQRMargin(),
            data: text,
            dotsOptions: getDotsOptions(dotsType),
            cornersSquareOptions: getCornersSquareOptions(cornersSquareType),
            cornersDotOptions: getCornersDotOptions(cornersDotType),
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
        
        // If we're downloading as SVG and shape radius > 0, we need to apply the border radius to the SVG
        if (shapeRadius > 0 && fileType === 'svg') {
            tempQrCode.getRawData('svg').then(blob => {
                // Convert blob to text
                blob.text().then(svgText => {
                    // Add border-radius to the SVG
                    const modifiedSvgText = svgText.replace('<svg', `<svg style="border-radius: ${shapeRadius}px;"`)
                    
                    // Create a new blob with the modified SVG
                    const modifiedBlob = new Blob([modifiedSvgText], {type: "image/svg+xml;charset=utf-8"});
                    
                    // Download the modified SVG
                    downloadBlob(modifiedBlob, `${fileName}.svg`);
                });
            });
        } else if (shapeRadius > 0 && (fileType === 'png' || fileType === 'jpeg' || fileType === 'pdf' || fileType === 'tiff')) {
            // For PNG, JPEG, PDF and TIFF with rounded corners, we need to use canvas
            getQRCodeCanvas(tempQrCode).then(canvas => {
                // For PNG, use transparent background
                if (fileType === 'png') {
                    canvas.toBlob(blob => {
                        downloadBlob(blob, `${fileName}.png`);
                    }, 'image/png');
                } 
                // For JPEG, use white background
                else if (fileType === 'jpeg') {
                    // Create a new canvas with white background
                    const jpegCanvas = document.createElement('canvas');
                    jpegCanvas.width = canvas.width;
                    jpegCanvas.height = canvas.height;
                    const jpegCtx = jpegCanvas.getContext('2d');
                    
                    // Fill with white background
                    jpegCtx.fillStyle = 'white';
                    jpegCtx.fillRect(0, 0, jpegCanvas.width, jpegCanvas.height);
                    
                    // Draw the original canvas on top
                    jpegCtx.drawImage(canvas, 0, 0);
                    
                    // Convert to blob and download
                    jpegCanvas.toBlob(blob => {
                        downloadBlob(blob, `${fileName}.jpeg`);
                    }, 'image/jpeg', 0.9);
                }
                // For PDF, create a PDF with the canvas
                else if (fileType === 'pdf') {
                    const { jsPDF } = window.jspdf;
                    const pdf = new jsPDF();
                    
                    // Convert canvas to image data
                    const imgData = canvas.toDataURL('image/png', 1.0);
                    
                    // Calculate the position to center the QR code on the page
                    const pageWidth = pdf.internal.pageSize.getWidth();
                    const pageHeight = pdf.internal.pageSize.getHeight();
                    const qrSize = Math.min(pageWidth, pageHeight) * 0.8; // 80% of the page size
                    const x = (pageWidth - qrSize) / 2;
                    const y = (pageHeight - qrSize) / 2;
                    
                    // Add the image to the PDF
                    pdf.addImage(imgData, 'PNG', x, y, qrSize, qrSize);
                    
                    // Save the PDF
                    pdf.save(`${fileName}.pdf`);
                }
                // For TIFF, create a TIFF with the canvas
                else if (fileType === 'tiff') {
                    const ctx = canvas.getContext('2d');
                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    
                    // Create a TIFF file
                    const tiffArr = new Uint8Array(UTIF.encodeImage(imageData.data, canvas.width, canvas.height));
                    
                    // Create a Blob from the TIFF array
                    const tiffBlob = new Blob([tiffArr], { type: 'image/tiff' });
                    
                    // Download the TIFF file
                    downloadBlob(tiffBlob, `${fileName}.tiff`);
                }
            });
        } else {
            switch (fileType) {
                case 'png':
                case 'jpeg':
                    tempQrCode.download({ name: fileName, extension: fileType });
                    break;
                case 'svg':
                    downloadSVG(fileName, tempQrCode);
                    break;
                case 'pdf':
                    downloadPDF(fileName, tempQrCode);
                    break;
                case 'tiff':
                    downloadTIFF(fileName, tempQrCode);
                    break;
            }
        }
    }

    function getDotsOptions(dotsType) {
        const options = {
            type: dotsType || (APP.main.getSelectedDotsType() === 'classy-rounded' ? 'rounded' : APP.main.getSelectedDotsType())
        };
        return addColorOptions(options, APP.main.getDotsColorType(), 'qrColor', 'dotsGradientStart', 'dotsGradientEnd', 'dotsGradientTypeSelect', 'dotsGradientRotation');
    }

    function getBackgroundOptions() {
        const options = {};
        return addColorOptions(options, APP.main.getBackgroundColorType(), 'qrBackground', 'backgroundGradientStart', 'backgroundGradientEnd', 'backgroundGradientTypeSelect', 'backgroundGradientRotation');
    }

    function getCornersSquareOptions(cornersSquareType) {
        const options = {
            type: cornersSquareType || (APP.main.getSelectedDotsType() === 'classy' || APP.main.getSelectedDotsType() === 'classy-rounded' ? 'extra-rounded' : 
              APP.main.getSelectedDotsType() === 'dots' ? 'dot' : APP.main.getSelectedDotsType())
        };
        return addColorOptions(options, APP.main.getCornersSquareColorType(), 'cornersSquareColor', 'cornersSquareGradientStart', 'cornersSquareGradientEnd', 'cornersSquareGradientTypeSelect', 'cornersSquareGradientRotation');
    }

    function getCornersDotOptions(cornersDotType) {
        const options = {
            type: cornersDotType || (APP.main.getSelectedDotsType() === 'classy' ? 'dot' : 
              APP.main.getSelectedDotsType() === 'classy-rounded' ? 'rounded' : 
              APP.main.getSelectedDotsType() === 'dots' ? 'dot' : APP.main.getSelectedDotsType())
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

    function getQRCodeCanvas(qrCode) {
        return new Promise((resolve) => {
            qrCode.getRawData('png').then(blob => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext('2d');
                    
                    // Apply rounded corners if needed
                    const shapeRadius = APP.main.getShapeRadius();
                    if (shapeRadius > 0) {
                        // Clear the canvas with transparency
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                        
                        // Create rounded rectangle path
                        ctx.beginPath();
                        ctx.moveTo(shapeRadius, 0);
                        ctx.lineTo(canvas.width - shapeRadius, 0);
                        ctx.quadraticCurveTo(canvas.width, 0, canvas.width, shapeRadius);
                        ctx.lineTo(canvas.width, canvas.height - shapeRadius);
                        ctx.quadraticCurveTo(canvas.width, canvas.height, canvas.width - shapeRadius, canvas.height);
                        ctx.lineTo(shapeRadius, canvas.height);
                        ctx.quadraticCurveTo(0, canvas.height, 0, canvas.height - shapeRadius);
                        ctx.lineTo(0, shapeRadius);
                        ctx.quadraticCurveTo(0, 0, shapeRadius, 0);
                        ctx.closePath();
                        
                        // Save the current state before clipping
                        ctx.save();
                        
                        // Create clipping region
                        ctx.clip();
                        
                        // Draw the image inside the clipping region
                        ctx.drawImage(img, 0, 0);
                        
                        // Restore the context state
                        ctx.restore();
                    } else {
                        // No rounding, just draw the image
                        ctx.drawImage(img, 0, 0);
                    }
                    
                    resolve(canvas);
                };
                img.src = URL.createObjectURL(blob);
            });
        });
    }

    function downloadSVG(fileName, qrCode) {
        getQRCodeCanvas(qrCode).then(canvas => {
            const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            const image = document.createElementNS("http://www.w3.org/2000/svg", "image");
            
            svg.setAttribute("width", canvas.width);
            svg.setAttribute("height", canvas.height);
            svg.setAttribute("viewBox", `0 0 ${canvas.width} ${canvas.height}`);
            
            // Apply rounded corners if needed
            const shapeRadius = APP.main.getShapeRadius();
            if (shapeRadius > 0) {
                svg.setAttribute("style", `border-radius: ${shapeRadius}px;`);
            }
            
            image.setAttribute("width", canvas.width);
            image.setAttribute("height", canvas.height);
            image.setAttribute("href", canvas.toDataURL("image/png"));
            
            svg.appendChild(image);
            
            const svgData = new XMLSerializer().serializeToString(svg);
            const svgBlob = new Blob([svgData], {type: "image/svg+xml;charset=utf-8"});
            downloadBlob(svgBlob, `${fileName}.svg`);
        });
    }

    function downloadPDF(fileName, qrCode) {
        getQRCodeCanvas(qrCode).then(canvas => {
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF();
            
            // Get the shape radius value
            const shapeRadius = APP.main.getShapeRadius();
            
            // Convert canvas to image data
            const imgData = canvas.toDataURL('image/png', 1.0);
            
            // Calculate the position to center the QR code on the page
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const qrSize = Math.min(pageWidth, pageHeight) * 0.8; // 80% of the page size
            const x = (pageWidth - qrSize) / 2;
            const y = (pageHeight - qrSize) / 2;
            
            // Add the image to the PDF
            pdf.addImage(imgData, 'PNG', x, y, qrSize, qrSize);
            
            // Save the PDF
            pdf.save(`${fileName}.pdf`);
        });
    }

    function downloadTIFF(fileName, qrCode) {
        getQRCodeCanvas(qrCode).then(canvas => {
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

    function handleFileSelect(event) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = function(e) {
            APP.main.setCSVData(parseCSV(e.target.result));
            console.log("CSV data loaded:", APP.main.getCSVData());
        };
        reader.readAsText(file);
    }

    function parseCSV(csvContent) {
        const lines = csvContent.split('\n');
        return lines.map(line => line.trim()).filter(line => line);
    }

    function handleLogoUpload(event) {
        const logoFile = event.target.files[0];
        const logoSection = event.target.closest('.collapsible-content');
        if (logoFile) {
            const reader = new FileReader();
            reader.onload = function (e) {
                APP.main.setCurrentLogo(e.target.result);
                APP.qrCodeGenerator.updateQRCode();
                document.getElementById('removeLogo').style.display = 'inline-block';
                document.getElementById('logoMarginContainer').style.display = 'block';
                document.getElementById('logoSizeContainer').style.display = 'block';
                
                APP.uiControls.updateCollapsibleContentSize(logoSection);
            };
            reader.readAsDataURL(logoFile);
        } else {
            APP.main.setCurrentLogo(null);
            APP.qrCodeGenerator.updateQRCode();
            document.getElementById('removeLogo').style.display = 'none';
            document.getElementById('logoMarginContainer').style.display = 'none';
            document.getElementById('logoSizeContainer').style.display = 'none';
            
            APP.uiControls.updateCollapsibleContentSize(logoSection);
        }
    }

    function removeLogo() {
        APP.main.setCurrentLogo(null);
        document.getElementById('qrLogo').value = '';
        document.getElementById('removeLogo').style.display = 'none';
        document.getElementById('logoMarginContainer').style.display = 'none';
        document.getElementById('logoSizeContainer').style.display = 'none';
        APP.qrCodeGenerator.updateQRCode();
        
        APP.uiControls.updateCollapsibleContentSize(document.querySelector('.collapsible-content'));
    }

    return {
        downloadQRCode: downloadQRCode,
        handleFileSelect: handleFileSelect,
        handleLogoUpload: handleLogoUpload,
        removeLogo: removeLogo,
        getDotsOptions: getDotsOptions,
        getBackgroundOptions: getBackgroundOptions,
        getCornersSquareOptions: getCornersSquareOptions,
        getCornersDotOptions: getCornersDotOptions,
        addColorOptions: addColorOptions,
        getQRCodeCanvas: getQRCodeCanvas
    };
})();