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
        const qrSizeSlider = document.getElementById('qrSize');
        const qrSizeInput = document.getElementById('qrSizeInput');
        const newSize = parseInt(qrSizeInput.value);

        if (newSize >= 50 && newSize <= 3000) {
            APP.main.setQRSize(newSize);
            qrSizeSlider.value = newSize;
            document.getElementById('qrSizeValue').textContent = newSize;
            APP.qrCodeGenerator.updateQRCode();
        }
    }

    function updateQRMargin() {
        const qrMarginSlider = document.getElementById('qrMargin');
        const qrMarginInput = document.getElementById('qrMarginInput');
        const newMargin = parseInt(qrMarginInput.value);

        if (newMargin >= 0 && newMargin <= 50) {
            APP.main.setQRMargin(newMargin);
            qrMarginSlider.value = newMargin;
            document.getElementById('qrMarginValue').textContent = newMargin;
            APP.qrCodeGenerator.updateQRCode();
        }
    }

    function updateDotsColorType() {
        const colorType = document.getElementById('dotsColorType').value;
        APP.main.setDotsColorType(colorType);
        document.getElementById('dotsSingleColor').style.display = colorType === 'single' ? 'flex' : 'none';
        document.getElementById('dotsGradient').style.display = colorType === 'gradient' ? 'flex' : 'none';
        document.getElementById('dotsGradientType').style.display = colorType === 'gradient' ? 'flex' : 'none';
        document.getElementById('dotsLinearGradientRotation').style.display = colorType === 'gradient' && APP.main.getDotsGradientType() === 'linear' ? 'flex' : 'none';
        APP.qrCodeGenerator.updateQRCode();
    }

    function updateBackgroundColorType() {
        const colorType = document.getElementById('backgroundColorType').value;
        APP.main.setBackgroundColorType(colorType);
        document.getElementById('backgroundSingleColor').style.display = colorType === 'single' ? 'flex' : 'none';
        document.getElementById('backgroundGradient').style.display = colorType === 'gradient' ? 'flex' : 'none';
        document.getElementById('backgroundGradientType').style.display = colorType === 'gradient' ? 'flex' : 'none';
        document.getElementById('backgroundLinearGradientRotation').style.display = colorType === 'gradient' ? 'flex' : 'none';
        APP.qrCodeGenerator.updateQRCode();
    }

    function updateCornersSquareColorType() {
        const colorType = document.getElementById('cornersSquareColorType').value;
        APP.main.setCornersSquareColorType(colorType);
        document.getElementById('cornersSquareSingleColor').style.display = colorType === 'single' ? 'flex' : 'none';
        document.getElementById('cornersSquareGradient').style.display = colorType === 'gradient' ? 'flex' : 'none';
        document.getElementById('cornersSquareGradientType').style.display = colorType === 'gradient' ? 'flex' : 'none';
        document.getElementById('cornersSquareLinearGradientRotation').style.display = colorType === 'gradient' ? 'flex' : 'none';
        APP.qrCodeGenerator.updateQRCode();
    }

    function updateCornersDotColorType() {
        const colorType = document.getElementById('cornersDotColorType').value;
        APP.main.setCornersDotColorType(colorType);
        document.getElementById('cornersDotSingleColor').style.display = colorType === 'single' ? 'flex' : 'none';
        document.getElementById('cornersDotGradient').style.display = colorType === 'gradient' ? 'flex' : 'none';
        document.getElementById('cornersDotGradientType').style.display = colorType === 'gradient' ? 'flex' : 'none';
        document.getElementById('cornersDotLinearGradientRotation').style.display = colorType === 'gradient' ? 'flex' : 'none';
        APP.qrCodeGenerator.updateQRCode();
    }

    function updateDotsGradientType(event) {
        if (event) {
            APP.main.setDotsGradientType(event.target.value);
        }
        document.getElementById('dotsLinearGradientRotation').style.display = 
            APP.main.getDotsColorType() === 'gradient' ? 'flex' : 'none';
        APP.qrCodeGenerator.updateQRCode();
    }

    function updateBackgroundGradientType(event) {
        if (event) {
            APP.main.setBackgroundGradientType(event.target.value);
        }
        document.getElementById('backgroundLinearGradientRotation').style.display = 
            APP.main.getBackgroundColorType() === 'gradient' ? 'flex' : 'none';
        APP.qrCodeGenerator.updateQRCode();
    }

    function updateCornersSquareGradientType(event) {
        if (event) {
            APP.main.setCornersSquareGradientType(event.target.value);
        }
        document.getElementById('cornersSquareLinearGradientRotation').style.display = 
            APP.main.getCornersSquareColorType() === 'gradient' ? 'flex' : 'none';
        APP.qrCodeGenerator.updateQRCode();
    }

    function updateCornersDotGradientType(event) {
        if (event) {
            APP.main.setCornersDotGradientType(event.target.value);
        }
        document.getElementById('cornersDotLinearGradientRotation').style.display = 
            APP.main.getCornersDotColorType() === 'gradient' ? 'flex' : 'none';
        APP.qrCodeGenerator.updateQRCode();
    }

    function updateCollapsibleContentSize(content) {
        if (!content) return;
        
        if (content.classList.contains('active')) {
            // For expanded state, set to scrollHeight
            const height = content.scrollHeight;
            content.style.maxHeight = height + 'px';
        } else {
            // For collapsed state, set to 0
            content.style.maxHeight = null;
        }
    }

    function observeContentChanges() {
        let isUpdating = false;
        
        // Create a mutation observer to watch for changes in collapsible content
        const observer = new MutationObserver((mutations) => {
            if (isUpdating) return; // Prevent recursive updates
            
            isUpdating = true;
            setTimeout(() => {
                // Find all active collapsibles and update their height
                document.querySelectorAll('.collapsible-content.active').forEach(content => {
                    const currentHeight = content.scrollHeight;
                    content.style.maxHeight = currentHeight + 'px';
                });
                isUpdating = false;
            }, 50);
        });
        
        // Observe all collapsible content elements
        document.querySelectorAll('.collapsible-content').forEach(content => {
            observer.observe(content, { 
                childList: true,
                subtree: true,
                attributes: false, // Only watch for content changes, not attribute changes
                characterData: true
            });
        });
        
        return observer;
    }

    function initCollapsibles() {
        const collapsibles = document.querySelectorAll('.collapsible-header');
        
        // Simple click handler without animation complexity
        collapsibles.forEach(header => {
            header.addEventListener('click', function() {
                // Toggle the active class on the header
                this.classList.toggle('active');
                
                // Get the content panel
                const content = this.nextElementSibling;
                
                // Toggle the active class on the content
                const isActive = content.classList.toggle('active');
                
                // Update height based on state
                if (isActive) {
                    content.style.maxHeight = content.scrollHeight + 'px';
                } else {
                    content.style.maxHeight = null;
                }
            });
        });
        
        // Add global resize event handler with debounce
        let resizeTimeout;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(function() {
                document.querySelectorAll('.collapsible-content.active').forEach(content => {
                    content.style.maxHeight = content.scrollHeight + 'px';
                });
            }, 100);
        });
        
        // Initialize shape radius value in UI
        const shapeRadius = APP.main.getShapeRadius();
        document.getElementById('shapeRadius').value = shapeRadius;
        document.getElementById('shapeRadiusValue').textContent = shapeRadius;
    }

    function forceReflow(element) {
        element.style.display = 'none';
        element.offsetHeight; // This line forces a reflow
        element.style.display = '';
    }

    return {
        updateDownloadOptions: updateDownloadOptions,
        updateQRSize: updateQRSize,
        updateQRMargin: updateQRMargin,
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
        observeContentChanges: observeContentChanges,
        forceReflow: forceReflow
    };
})();