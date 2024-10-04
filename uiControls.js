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

    function updateDotsColorType(event) {
        APP.main.setDotsColorType(event.target.value);
        document.getElementById('dotsSingleColor').style.display = APP.main.getDotsColorType() === 'single' ? 'block' : 'none';
        document.getElementById('dotsGradient').style.display = APP.main.getDotsColorType() === 'gradient' ? 'block' : 'none';
        document.getElementById('dotsGradientType').style.display = APP.main.getDotsColorType() === 'gradient' ? 'inline-block' : 'none';
        updateDotsGradientType();
        APP.qrCodeGenerator.updateQRCode();
        updateCollapsibleContentSize(event.target.closest('.collapsible-content'));
    }

    function updateBackgroundColorType(event) {
        APP.main.setBackgroundColorType(event.target.value);
        document.getElementById('backgroundSingleColor').style.display = APP.main.getBackgroundColorType() === 'single' ? 'block' : 'none';
        document.getElementById('backgroundGradient').style.display = APP.main.getBackgroundColorType() === 'gradient' ? 'block' : 'none';
        document.getElementById('backgroundGradientType').style.display = APP.main.getBackgroundColorType() === 'gradient' ? 'inline-block' : 'none';
        updateBackgroundGradientType();
        APP.qrCodeGenerator.updateQRCode();
        updateCollapsibleContentSize(event.target.closest('.collapsible-content'));
    }

    function updateCornersSquareColorType(event) {
        APP.main.setCornersSquareColorType(event.target.value);
        document.getElementById('cornersSquareSingleColor').style.display = APP.main.getCornersSquareColorType() === 'single' ? 'block' : 'none';
        document.getElementById('cornersSquareGradient').style.display = APP.main.getCornersSquareColorType() === 'gradient' ? 'block' : 'none';
        document.getElementById('cornersSquareGradientType').style.display = APP.main.getCornersSquareColorType() === 'gradient' ? 'inline-block' : 'none';
        updateCornersSquareGradientType();
        APP.qrCodeGenerator.updateQRCode();
        updateCollapsibleContentSize(event.target.closest('.collapsible-content'));
    }

    function updateCornersDotColorType(event) {
        APP.main.setCornersDotColorType(event.target.value);
        document.getElementById('cornersDotSingleColor').style.display = APP.main.getCornersDotColorType() === 'single' ? 'block' : 'none';
        document.getElementById('cornersDotGradient').style.display = APP.main.getCornersDotColorType() === 'gradient' ? 'block' : 'none';
        document.getElementById('cornersDotGradientType').style.display = APP.main.getCornersDotColorType() === 'gradient' ? 'inline-block' : 'none';
        updateCornersDotGradientType();
        APP.qrCodeGenerator.updateQRCode();
        updateCollapsibleContentSize(event.target.closest('.collapsible-content'));
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