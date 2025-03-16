var APP = APP || {};

APP.bulkOperations = (function() {
    function generateBulkQRCodes() {
        const bulkQRCodesContainer = document.getElementById('bulkQRCodes');
        bulkQRCodesContainer.innerHTML = '';

        console.log("Generating bulk QR codes for", APP.main.getCSVData().length, "records");

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

        APP.main.getCSVData().forEach((text, index) => {
            const qrContainer = document.createElement('div');
            qrContainer.className = 'qr-container';
            
            const qrCode = new QRCodeStyling({
                width: 200,
                height: 200,
                data: text,
                dotsOptions: APP.fileOperations.getDotsOptions(dotsType),
                cornersSquareOptions: APP.fileOperations.getCornersSquareOptions(cornersSquareType),
                cornersDotOptions: APP.fileOperations.getCornersDotOptions(cornersDotType),
                backgroundOptions: APP.fileOperations.getBackgroundOptions(),
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
            
            // Apply CSS border-radius to the QR element if shape radius > 0
            if (shapeRadius > 0) {
                const borderRadiusValue = `${shapeRadius}px`;
                qrElement.style.borderRadius = borderRadiusValue;
                
                // Also apply to the canvas/svg inside
                const qrCanvas = qrElement.querySelector('canvas, svg');
                if (qrCanvas) {
                    qrCanvas.style.borderRadius = borderRadiusValue;
                }
            }

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

        APP.main.getCSVData().forEach((text, index) => {
            const fileName = `qr-code-${index + 1}`;
            const promise = new Promise((resolve) => {
                const tempQrCode = new QRCodeStyling({
                    width: 200,
                    height: 200,
                    data: text,
                    dotsOptions: APP.fileOperations.getDotsOptions(dotsType),
                    cornersSquareOptions: APP.fileOperations.getCornersSquareOptions(cornersSquareType),
                    cornersDotOptions: APP.fileOperations.getCornersDotOptions(cornersDotType),
                    backgroundOptions: APP.fileOperations.getBackgroundOptions(),
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
                            
                            // Add to zip
                            zip.file(`${fileName}.${fileType}`, modifiedBlob);
                            resolve();
                        });
                    });
                } else if (shapeRadius > 0 && (fileType === 'png' || fileType === 'jpeg' || fileType === 'pdf' || fileType === 'tiff')) {
                    // For PNG, JPEG, PDF and TIFF with rounded corners, we need to use canvas
                    APP.fileOperations.getQRCodeCanvas(tempQrCode).then(canvas => {
                        // For PNG, use transparent background
                        if (fileType === 'png') {
                            canvas.toBlob(blob => {
                                zip.file(`${fileName}.${fileType}`, blob);
                                resolve();
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
                            
                            // Convert to blob and add to zip
                            jpegCanvas.toBlob(blob => {
                                zip.file(`${fileName}.${fileType}`, blob);
                                resolve();
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
                            
                            // Get the PDF as blob and add to zip
                            pdf.output('blob').then(blob => {
                                zip.file(`${fileName}.pdf`, blob);
                                resolve();
                            });
                        }
                        // For TIFF, create a TIFF with the canvas
                        else if (fileType === 'tiff') {
                            const ctx = canvas.getContext('2d');
                            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                            
                            // Create a TIFF file
                            const tiffArr = new Uint8Array(UTIF.encodeImage(imageData.data, canvas.width, canvas.height));
                            
                            // Create a Blob from the TIFF array
                            const tiffBlob = new Blob([tiffArr], { type: 'image/tiff' });
                            
                            // Add to zip
                            zip.file(`${fileName}.tiff`, tiffBlob);
                            resolve();
                        }
                    });
                } else {
                    tempQrCode.getRawData(fileType).then(blob => {
                        zip.file(`${fileName}.${fileType}`, blob);
                        resolve();
                    });
                }
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