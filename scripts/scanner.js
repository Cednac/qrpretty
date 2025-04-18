var APP = APP || {};

APP.scanner = (function() {
    // Variables for different scanner modes
    let video = null;
    let canvasElement = null;
    let canvas = null;
    let loadingMessage = null;
    let currentStream = null;
    let scanning = false;
    let cameraFacingMode = 'environment'; // Start with back camera
    let hasFlash = false;
    let flashOn = false;
    let activeTab = 'camera';
    
    // Initialize the scanner functionality
    function init() {
        // DOM elements
        video = document.getElementById('video');
        canvasElement = document.createElement('canvas');
        canvas = canvasElement.getContext('2d');
        
        // Scanner tab buttons
        const startCameraBtn = document.getElementById('startCameraBtn');
        const uploadImageBtn = document.getElementById('uploadImageBtn');
        const pasteImageBtn = document.getElementById('pasteImageBtn');
        
        // Camera control buttons
        const switchCameraBtn = document.getElementById('switchCameraBtn');
        const toggleFlashBtn = document.getElementById('toggleFlashBtn');
        
        // Image upload elements
        const dropzone = document.getElementById('dropzone');
        const qrImageUpload = document.getElementById('qrImageUpload');
        const scanAnotherBtn = document.getElementById('scan-another-btn');
        
        // Paste image elements
        const pasteArea = document.getElementById('paste-area');
        const scanAnotherPasteBtn = document.getElementById('scan-another-paste-btn');
        
        // Result action buttons
        const copyBtn = document.getElementById('copy-btn');
        const openBtn = document.getElementById('open-btn');
        const generateQrBtn = document.getElementById('generate-qr-btn');
        
        // Event listeners for scanner tabs
        startCameraBtn.addEventListener('click', () => switchTab('camera'));
        uploadImageBtn.addEventListener('click', () => switchTab('image'));
        pasteImageBtn.addEventListener('click', () => switchTab('paste'));
        
        // Camera control event listeners
        switchCameraBtn.addEventListener('click', switchCamera);
        toggleFlashBtn.addEventListener('click', toggleFlash);
        
        // Image upload event listeners
        dropzone.addEventListener('click', () => qrImageUpload.click());
        qrImageUpload.addEventListener('change', handleFileSelect);
        scanAnotherBtn.addEventListener('click', resetImageUpload);
        
        // Setup drag and drop
        dropzone.addEventListener('dragover', handleDragOver);
        dropzone.addEventListener('dragleave', handleDragLeave);
        dropzone.addEventListener('drop', handleDrop);
        
        // Paste image event listeners
        document.addEventListener('paste', handlePaste);
        scanAnotherPasteBtn.addEventListener('click', resetPasteImage);
        
        // Result action event listeners
        copyBtn.addEventListener('click', copyToClipboard);
        openBtn.addEventListener('click', openURL);
        generateQrBtn.addEventListener('click', generateQR);
        
        // Start with camera scanner by default
        switchTab('camera');
    }
    
    // Switch between scanner tabs (camera, image upload, paste)
    function switchTab(tab) {
        // Update active tab
        activeTab = tab;
        
        // Update tab button states
        document.getElementById('startCameraBtn').classList.toggle('active', tab === 'camera');
        document.getElementById('uploadImageBtn').classList.toggle('active', tab === 'image');
        document.getElementById('pasteImageBtn').classList.toggle('active', tab === 'paste');
        
        // Show/hide containers
        document.getElementById('camera-container').style.display = tab === 'camera' ? 'block' : 'none';
        document.getElementById('image-container').style.display = tab === 'image' ? 'block' : 'none';
        document.getElementById('paste-container').style.display = tab === 'paste' ? 'block' : 'none';
        
        // Hide result if switching tabs
        document.getElementById('result-container').style.display = 'none';
        
        // Start or stop camera based on tab
        if (tab === 'camera') {
            startCamera();
        } else {
            stopCamera();
        }
    }
    
    // Start the camera with selected facing mode
    function startCamera() {
        if (currentStream) {
            stopCamera();
        }
        
        // Check for camera support
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            const constraints = {
                video: {
                    facingMode: cameraFacingMode,
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            };
            
            navigator.mediaDevices.getUserMedia(constraints)
                .then(function(stream) {
                    currentStream = stream;
                    video.srcObject = stream;
                    video.play();
                    
                    // Check if flash is available
                    checkFlashAvailability(stream);
                    
                    // Start scanning for QR codes
                    scanning = true;
                    requestAnimationFrame(tick);
                })
                .catch(function(error) {
                    console.error('Error accessing the camera:', error);
                    alert('Unable to access the camera: ' + error.message);
                });
        } else {
            console.error('getUserMedia is not supported in this browser');
            alert('Sorry, your browser does not support accessing the camera.');
        }
    }
    
    // Stop the camera stream
    function stopCamera() {
        scanning = false;
        if (currentStream) {
            currentStream.getTracks().forEach(track => {
                track.stop();
            });
            currentStream = null;
        }
    }
    
    // Switch between front and back camera
    function switchCamera() {
        cameraFacingMode = cameraFacingMode === 'environment' ? 'user' : 'environment';
        startCamera();
    }
    
    // Check if flash is available on the device camera
    function checkFlashAvailability(stream) {
        const tracks = stream.getVideoTracks();
        if (tracks.length > 0) {
            const capabilities = tracks[0].getCapabilities();
            hasFlash = capabilities && 'torch' in capabilities;
            document.getElementById('toggleFlashBtn').style.display = hasFlash ? 'block' : 'none';
        }
    }
    
    // Toggle flash/torch on the device camera
    function toggleFlash() {
        if (!hasFlash || !currentStream) return;
        
        const tracks = currentStream.getVideoTracks();
        if (tracks.length > 0) {
            flashOn = !flashOn;
            tracks[0].applyConstraints({
                advanced: [{ torch: flashOn }]
            });
            document.getElementById('toggleFlashBtn').innerHTML = 
                flashOn ? '<i class="fas fa-bolt"></i> Off' : '<i class="fas fa-bolt"></i>';
        }
    }
    
    // Main scanning loop for camera
    function tick() {
        if (!scanning) return;
        
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
            // Draw video frame to canvas
            canvasElement.height = video.videoHeight;
            canvasElement.width = video.videoWidth;
            canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
            
            // Get image data for QR code scanning
            const imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
            
            // Attempt to decode QR code
            const code = jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: "dontInvert",
            });
            
            if (code) {
                // QR code found
                scanning = false;
                handleSuccessfulScan(code.data);
            }
        }
        
        // Continue scanning
        if (scanning) {
            requestAnimationFrame(tick);
        }
    }
    
    // Handle file selection for image upload
    function handleFileSelect(event) {
        const file = event.target.files[0];
        if (file) {
            processImageFile(file);
        }
    }
    
    // Handle drag over event for drag and drop
    function handleDragOver(event) {
        event.preventDefault();
        event.stopPropagation();
        document.getElementById('dropzone').classList.add('dragover');
    }
    
    // Handle drag leave event for drag and drop
    function handleDragLeave(event) {
        event.preventDefault();
        event.stopPropagation();
        document.getElementById('dropzone').classList.remove('dragover');
    }
    
    // Handle drop event for drag and drop
    function handleDrop(event) {
        event.preventDefault();
        event.stopPropagation();
        document.getElementById('dropzone').classList.remove('dragover');
        
        const dataTransfer = event.dataTransfer;
        if (dataTransfer.items) {
            for (let i = 0; i < dataTransfer.items.length; i++) {
                if (dataTransfer.items[i].kind === 'file') {
                    const file = dataTransfer.items[i].getAsFile();
                    processImageFile(file);
                    break;
                }
            }
        } else {
            if (dataTransfer.files.length > 0) {
                processImageFile(dataTransfer.files[0]);
            }
        }
    }
    
    // Handle paste event for clipboard images
    function handlePaste(event) {
        if (activeTab !== 'paste') return;
        
        const clipboardData = event.clipboardData || window.clipboardData;
        const items = clipboardData.items;
        
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                const blob = items[i].getAsFile();
                const url = URL.createObjectURL(blob);
                
                // Show the pasted image
                document.getElementById('paste-area').style.display = 'none';
                document.getElementById('paste-preview').style.display = 'block';
                document.getElementById('paste-preview-img').src = url;
                
                // Process the image for QR scanning
                const img = new Image();
                img.onload = function() {
                    scanImageForQR(img);
                };
                img.src = url;
                break;
            }
        }
    }
    
    // Process an image file for QR code scanning
    function processImageFile(file) {
        if (!file || !file.type.match('image.*')) {
            alert('Please select an image file');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(event) {
            // Show the uploaded image
            document.getElementById('dropzone').style.display = 'none';
            document.getElementById('image-preview').style.display = 'block';
            document.getElementById('preview-img').src = event.target.result;
            
            // Process the image for QR scanning
            const img = new Image();
            img.onload = function() {
                scanImageForQR(img);
            };
            img.src = event.target.result;
        };
        
        reader.readAsDataURL(file);
    }
    
    // Reset the image upload area
    function resetImageUpload() {
        document.getElementById('dropzone').style.display = 'block';
        document.getElementById('image-preview').style.display = 'none';
        document.getElementById('result-container').style.display = 'none';
        document.getElementById('qrImageUpload').value = '';
    }
    
    // Reset the paste image area
    function resetPasteImage() {
        document.getElementById('paste-area').style.display = 'block';
        document.getElementById('paste-preview').style.display = 'none';
        document.getElementById('result-container').style.display = 'none';
    }
    
    // Scan an image for QR code
    function scanImageForQR(img) {
        // Create a canvas element to draw the image
        const tempCanvas = document.createElement('canvas');
        const tempContext = tempCanvas.getContext('2d');
        
        // Set canvas dimensions to match image
        tempCanvas.width = img.width;
        tempCanvas.height = img.height;
        
        // Draw image to canvas
        tempContext.drawImage(img, 0, 0, img.width, img.height);
        
        // Get image data for QR code scanning
        const imageData = tempContext.getImageData(0, 0, img.width, img.height);
        
        // Attempt to decode QR code
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "dontInvert",
        });
        
        if (code) {
            // QR code found
            handleSuccessfulScan(code.data);
        } else {
            alert('No QR code found in the image. Please try another image.');
        }
    }
    
    // Handle successful QR code scan
    function handleSuccessfulScan(data) {
        // Display the scan result
        document.getElementById('result-container').style.display = 'block';
        document.getElementById('scanned-text').value = data;
        
        // Enable/disable open URL button based on whether result is a URL
        const isUrl = isValidUrl(data);
        document.getElementById('open-btn').disabled = !isUrl;
    }
    
    // Copy scan result to clipboard
    function copyToClipboard() {
        const scannedText = document.getElementById('scanned-text');
        scannedText.select();
        document.execCommand('copy');
        alert('Copied to clipboard!');
    }
    
    // Open URL if scan result is a valid URL
    function openURL() {
        const data = document.getElementById('scanned-text').value;
        if (isValidUrl(data)) {
            window.open(data, '_blank');
        }
    }
    
    // Navigate to QR code generator with scanned text
    function generateQR() {
        const data = document.getElementById('scanned-text').value;
        window.location.href = `index.html?text=${encodeURIComponent(data)}`;
    }
    
    // Check if a string is a valid URL
    function isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }
    
    // Public API
    return {
        init: init
    };
})();

// Initialize scanner when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    APP.scanner.init();
}); 