var APP = APP || {};

APP.randomStyle = (function() {
    function generateRandomStyle() {
        // Generate random dot style
        const dotStyles = ['square', 'rounded', 'extra-rounded', 'classy', 'classy-rounded', 'dots'];
        const randomDotStyle = dotStyles[Math.floor(Math.random() * dotStyles.length)];
        
        // Set random dot style
        APP.main.setSelectedDotsType(randomDotStyle);
        document.querySelectorAll('#dotsPicker div').forEach(el => el.classList.remove('selected'));
        document.getElementById(`${randomDotStyle}Option`).classList.add('selected');
        
        // Generate random colors
        const randomColor = () => '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
        
        // Set random dot color
        const newDotsColor = randomColor();
        APP.main.setDotsColor(newDotsColor);
        document.getElementById('qrColor').value = newDotsColor;
        
        // Set random background color
        const newBgColor = randomColor();
        APP.main.setQRBackground(newBgColor);
        document.getElementById('qrBackground').value = newBgColor;
        
        // Set random corners square color
        const newCornersSquareColor = randomColor();
        APP.main.setCornersSquareColor(newCornersSquareColor);
        document.getElementById('cornersSquareColor').value = newCornersSquareColor;
        
        // Set random corners dot color
        const newCornersDotColor = randomColor();
        APP.main.setCornersDotColor(newCornersDotColor);
        document.getElementById('cornersDotColor').value = newCornersDotColor;
        
        // Randomly choose between single color and gradient
        const colorTypes = ['single', 'gradient'];
        
        // Dots color type
        const newDotsColorType = colorTypes[Math.floor(Math.random() * colorTypes.length)];
        APP.main.setDotsColorType(newDotsColorType);
        document.getElementById('dotsColorType').value = newDotsColorType;
        
        if (newDotsColorType === 'gradient') {
            const newDotsGradientStart = randomColor();
            const newDotsGradientEnd = randomColor();
            APP.main.setDotsGradientStart(newDotsGradientStart);
            APP.main.setDotsGradientEnd(newDotsGradientEnd);
            document.getElementById('dotsGradientStart').value = newDotsGradientStart;
            document.getElementById('dotsGradientEnd').value = newDotsGradientEnd;
            
            // Show gradient controls
            document.getElementById('dotsSingleColor').style.display = 'none';
            document.getElementById('dotsGradient').style.display = 'flex';
            document.getElementById('dotsGradientType').style.display = 'flex';
            
            // Random gradient type
            const newDotsGradientType = Math.random() > 0.5 ? 'linear' : 'radial';
            APP.main.setDotsGradientType(newDotsGradientType);
            document.getElementById('dotsGradientTypeSelect').value = newDotsGradientType;
            
            if (newDotsGradientType === 'linear') {
                document.getElementById('dotsLinearGradientRotation').style.display = 'flex';
                const newDotsGradientRotation = Math.floor(Math.random() * 360);
                APP.main.setDotsGradientRotation(newDotsGradientRotation);
                document.getElementById('dotsGradientRotation').value = newDotsGradientRotation;
            } else {
                document.getElementById('dotsLinearGradientRotation').style.display = 'none';
            }
        } else {
            // Show single color controls
            document.getElementById('dotsSingleColor').style.display = 'flex';
            document.getElementById('dotsGradient').style.display = 'none';
            document.getElementById('dotsGradientType').style.display = 'none';
            document.getElementById('dotsLinearGradientRotation').style.display = 'none';
        }
        
        // Set random shape radius
        const randomShapeRadius = Math.floor(Math.random() * 50);
        APP.main.setShapeRadius(randomShapeRadius);
        document.getElementById('shapeRadius').value = randomShapeRadius;
        document.getElementById('shapeRadiusValue').textContent = randomShapeRadius;
        console.log("Random shape radius set to:", randomShapeRadius);
        
        // Update QR code with new random style
        APP.qrCodeGenerator.updateQRCode();
    }

    return {
        generateRandomStyle: generateRandomStyle
    };
})(); 