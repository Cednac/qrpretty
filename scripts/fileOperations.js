var APP = APP || {};

APP.fileOperations = (function() {
    function downloadQRCode(fileType) {
        const fileName = "qr-code";
        const text = document.getElementById('qrText').value.trim();
        
        if (!text) {
            alert("Please enter some text or URL for the QR code.");
            return;
        }
        
        switch (fileType) {
            case 'png':
            case 'jpeg':
                APP.qrCodeGenerator.getQRCodeInstance().download({ name: fileName, extension: fileType });
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
            APP.qrCodeGenerator.getQRCodeInstance().getRawData('png').then(blob => {
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
        removeLogo: removeLogo
    };
})();