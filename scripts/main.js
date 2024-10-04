var APP = APP || {};

APP.main = (function() {
    // Global variables
    let qrSize = 300;
    let selectedDotsType = "square";
    let dotsColor = "#000000";
    let qrBackground = "#FFFFFF";
    let dotsColorType = 'single';
    let backgroundColorType = 'single';
    let dotsGradientStart = '#000000';
    let dotsGradientEnd = '#000000';
    let backgroundGradientStart = '#FFFFFF';
    let backgroundGradientEnd = '#FFFFFF';
    let dotsGradientType = 'linear';
    let backgroundGradientType = 'linear';
    let dotsGradientRotation = 0;
    let backgroundGradientRotation = 0;
    let cornersSquareColorType = 'single';
    let cornersSquareColor = '#000000';
    let cornersSquareGradientType = 'linear';
    let cornersSquareGradientStart = '#000000';
    let cornersSquareGradientEnd = '#000000';
    let cornersSquareGradientRotation = 0;
    let cornersDotColorType = 'single';
    let cornersDotColor = '#000000';
    let cornersDotGradientType = 'linear';
    let cornersDotGradientStart = '#000000';
    let cornersDotGradientEnd = '#000000';
    let cornersDotGradientRotation = 0;
    let currentLogo = null;
    let logoMargin = 5;
    let logoSize = 0.4;
    let errorCorrectionLevel = 'M';
    let csvData = [];

    function init() {
        APP.qrCodeGenerator.initQRCode();
        APP.eventHandlers.initEventListeners();
        APP.uiControls.initCollapsibles();
        APP.qrCodeGenerator.updateQRCode();
    }

    document.addEventListener('DOMContentLoaded', init);

    return {
        getQRSize: function() { return qrSize; },
        setQRSize: function(size) { qrSize = size; },
        getSelectedDotsType: function() { return selectedDotsType; },
        setSelectedDotsType: function(type) { selectedDotsType = type; },
        getDotsColor: function() { return dotsColor; },
        setDotsColor: function(color) { dotsColor = color; },
        getQRBackground: function() { return qrBackground; },
        setQRBackground: function(color) { qrBackground = color; },
        getDotsColorType: function() { return dotsColorType; },
        setDotsColorType: function(type) { dotsColorType = type; },
        getBackgroundColorType: function() { return backgroundColorType; },
        setBackgroundColorType: function(type) { backgroundColorType = type; },
        getDotsGradientStart: function() { return dotsGradientStart; },
        setDotsGradientStart: function(color) { dotsGradientStart = color; },
        getDotsGradientEnd: function() { return dotsGradientEnd; },
        setDotsGradientEnd: function(color) { dotsGradientEnd = color; },
        getBackgroundGradientStart: function() { return backgroundGradientStart; },
        setBackgroundGradientStart: function(color) { backgroundGradientStart = color; },
        getBackgroundGradientEnd: function() { return backgroundGradientEnd; },
        setBackgroundGradientEnd: function(color) { backgroundGradientEnd = color; },
        getDotsGradientType: function() { return dotsGradientType; },
        setDotsGradientType: function(type) { dotsGradientType = type; },
        getBackgroundGradientType: function() { return backgroundGradientType; },
        setBackgroundGradientType: function(type) { backgroundGradientType = type; },
        getDotsGradientRotation: function() { return dotsGradientRotation; },
        setDotsGradientRotation: function(rotation) { dotsGradientRotation = rotation; },
        getBackgroundGradientRotation: function() { return backgroundGradientRotation; },
        setBackgroundGradientRotation: function(rotation) { backgroundGradientRotation = rotation; },
        getCornersSquareColorType: function() { return cornersSquareColorType; },
        setCornersSquareColorType: function(type) { cornersSquareColorType = type; },
        getCornersSquareColor: function() { return cornersSquareColor; },
        setCornersSquareColor: function(color) { cornersSquareColor = color; },
        getCornersSquareGradientType: function() { return cornersSquareGradientType; },
        setCornersSquareGradientType: function(type) { cornersSquareGradientType = type; },
        getCornersSquareGradientStart: function() { return cornersSquareGradientStart; },
        setCornersSquareGradientStart: function(color) { cornersSquareGradientStart = color; },
        getCornersSquareGradientEnd: function() { return cornersSquareGradientEnd; },
        setCornersSquareGradientEnd: function(color) { cornersSquareGradientEnd = color; },
        getCornersSquareGradientRotation: function() { return cornersSquareGradientRotation; },
        setCornersSquareGradientRotation: function(rotation) { cornersSquareGradientRotation = rotation; },
        getCornersDotColorType: function() { return cornersDotColorType; },
        setCornersDotColorType: function(type) { cornersDotColorType = type; },
        getCornersDotColor: function() { return cornersDotColor; },
        setCornersDotColor: function(color) { cornersDotColor = color; },
        getCornersDotGradientType: function() { return cornersDotGradientType; },
        setCornersDotGradientType: function(type) { cornersDotGradientType = type; },
        getCornersDotGradientStart: function() { return cornersDotGradientStart; },
        setCornersDotGradientStart: function(color) { cornersDotGradientStart = color; },
        getCornersDotGradientEnd: function() { return cornersDotGradientEnd; },
        setCornersDotGradientEnd: function(color) { cornersDotGradientEnd = color; },
        getCornersDotGradientRotation: function() { return cornersDotGradientRotation; },
        setCornersDotGradientRotation: function(rotation) { cornersDotGradientRotation = rotation; },
        getCurrentLogo: function() { return currentLogo; },
        setCurrentLogo: function(logo) { currentLogo = logo; },
        getLogoMargin: function() { return logoMargin; },
        setLogoMargin: function(margin) { logoMargin = margin; },
        getLogoSize: function() { return logoSize; },
        setLogoSize: function(size) { logoSize = size; },
        getErrorCorrectionLevel: function() { return errorCorrectionLevel; },
        setErrorCorrectionLevel: function(level) { errorCorrectionLevel = level; },
        getCSVData: function() { return csvData; },
        setCSVData: function(data) { csvData = data; }
    };
})();