var APP = APP || {};

APP.uiControls = (function() {
    function updateDownloadOptions() {
        const qrTextInput = document.getElementById('qrText');
        const downloadOptions = document.getElementById('downloadOptions');
        if (qrTextInput.value.trim()) {
            downloadOptions.style.display = 'flex';
        } else {
            downloadOptions.style.display = 'none';
        }
    }

    function updateQRSize() {
        APP.main.setQRSize(parseInt(document.getElementById('qrSize').value));
        document.getElementById('qrSizeValue').textContent = APP.main.getQRSize();
        APP.qrCodeGenerator.updateQRCode();
    }

    function updateDotsColorType() {
        const colorType = document.getElementById('dotsColorType').value;
        APP.main.setDotsColorType(colorType);
        document.getElementById('dotsSingleColor').style.display = colorType === 'single' ? 'block' : 'none';
        document.getElementById('dotsGradient').style.display = colorType === 'gradient' ? 'block' : 'none';
        document.getElementById('dotsGradientType').style.display = colorType === 'gradient' ? 'block' : 'none';
        document.getElementById('dotsLinearGradientRotation').style.display = colorType === 'gradient' && APP.main.getDotsGradientType() === 'linear' ? 'block' : 'none';
        APP.qrCodeGenerator.updateQRCode();
    }

    function updateBackgroundColorType() {
        const colorType = document.getElementById('backgroundColorType').value;
        APP.main.setBackgroundColorType(colorType);
        document.getElementById('backgroundSingleColor').style.display = colorType === 'single' ? 'block' : 'none';
        document.getElementById('backgroundGradient').style.display = colorType === 'gradient' ? 'block' : 'none';
        document.getElementById('backgroundGradientType').style.display = colorType === 'gradient' ? 'block' : 'none';
        document.getElementById('backgroundLinearGradientRotation').style.display = colorType === 'gradient' && APP.main.getBackgroundGradientType() === 'linear' ? 'block' : 'none';
        APP.qrCodeGenerator.updateQRCode();
    }

    function updateCornersSquareColorType() {
        const colorType = document.getElementById('cornersSquareColorType').value;
        APP.main.setCornersSquareColorType(colorType);
        document.getElementById('cornersSquareSingleColor').style.display = colorType === 'single' ? 'block' : 'none';
        document.getElementById('cornersSquareGradient').style.display = colorType === 'gradient' ? 'block' : 'none';
        document.getElementById('cornersSquareGradientType').style.display = colorType === 'gradient' ? 'block' : 'none';
        document.getElementById('cornersSquareLinearGradientRotation').style.display = colorType === 'gradient' && APP.main.getCornersSquareGradientType() === 'linear' ? 'block' : 'none';
        APP.qrCodeGenerator.updateQRCode();
    }

    function updateCornersDotColorType() {
        const colorType = document.getElementById('cornersDotColorType').value;
        APP.main.setCornersDotColorType(colorType);
        document.getElementById('cornersDotSingleColor').style.display = colorType === 'single' ? 'block' : 'none';
        document.getElementById('cornersDotGradient').style.display = colorType === 'gradient' ? 'block' : 'none';
        document.getElementById('cornersDotGradientType').style.display = colorType === 'gradient' ? 'block' : 'none';
        document.getElementById('cornersDotLinearGradientRotation').style.display = colorType === 'gradient' && APP.main.getCornersDotGradientType() === 'linear' ? 'block' : 'none';
        APP.qrCodeGenerator.updateQRCode();
    }

    function updateDotsGradientType(event) {
        if (event) {
            APP.main.setDotsGradientType(event.target.value);
        }
        document.getElementById('dotsLinearGradientRotation').style.display = 
            APP.main.getDotsColorType() === 'gradient' && APP.main.getDotsGradientType() === 'linear' ? 'flex' : 'none';
        APP.qrCodeGenerator.updateQRCode();
    }

    function updateBackgroundGradientType(event) {
        if (event) {
            APP.main.setBackgroundGradientType(event.target.value);
        }
        document.getElementById('backgroundLinearGradientRotation').style.display = 
            APP.main.getBackgroundColorType() === 'gradient' && APP.main.getBackgroundGradientType() === 'linear' ? 'flex' : 'none';
        APP.qrCodeGenerator.updateQRCode();
    }

    function updateCornersSquareGradientType(event) {
        if (event) {
            APP.main.setCornersSquareGradientType(event.target.value);
        }
        document.getElementById('cornersSquareLinearGradientRotation').style.display = 
            APP.main.getCornersSquareColorType() === 'gradient' && APP.main.getCornersSquareGradientType() === 'linear' ? 'flex' : 'none';
        APP.qrCodeGenerator.updateQRCode();
    }

    function updateCornersDotGradientType(event) {
        if (event) {
            APP.main.setCornersDotGradientType(event.target.value);
        }
        document.getElementById('cornersDotLinearGradientRotation').style.display = 
            APP.main.getCornersDotColorType() === 'gradient' && APP.main.getCornersDotGradientType() === 'linear' ? 'flex' : 'none';
        APP.qrCodeGenerator.updateQRCode();
    }

    function initCollapsibles() {
        const collapsibles = document.querySelectorAll('.collapsible-header');
        collapsibles.forEach(collapsible => {
            collapsible.addEventListener('click', function() {
                this.classList.toggle('active');
                const content = this.nextElementSibling;
                if (content.style.maxHeight) {
                    content.style.maxHeight = null;
                    content.classList.remove('active');
                } else {
                    content.classList.add('active');
                    updateCollapsibleContentSize(content);
                }
            });
        });
    }

    function updateCollapsibleContentSize(content) {
        if (content && content.classList.contains('active')) {
            content.style.maxHeight = 'none';
            const scrollHeight = content.scrollHeight;
            content.style.maxHeight = scrollHeight + 'px';
        }
    }

    function forceReflow(element) {
        element.style.display = 'none';
        element.offsetHeight; // This line forces a reflow
        element.style.display = '';
    }

    return {
        updateDownloadOptions: updateDownloadOptions,
        updateQRSize: updateQRSize,
        updateDotsColorType: updateDotsColorType,
        updateBackgroundColorType: updateBackgroundColorType,
        updateCornersSquareColorType: updateCornersSquareColorType,
        updateCornersDotColorType: updateCornersDotColorType,
        updateDotsGradientType: updateDotsGradientType,
        updateBackgroundGradientType: updateBackgroundGradientType,
        updateCornersSquareGradientType: updateCornersSquareGradientType,
        updateCornersDotGradientType: updateCornersDotGradientType,
        initCollapsibles: initCollapsibles,
        updateCollapsibleContentSize: updateCollapsibleContentSize,
        forceReflow: forceReflow
    };
})();