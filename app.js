/**
 * Premium Eid Greeting Card Generator Engine
 * Features: High-resolution rendering, responsive drag & drop, custom vector assets, typography control
 */

document.addEventListener('DOMContentLoaded', () => {
    // Canvas & Context Setup
    const canvas = document.getElementById('greetingCanvas');
    const ctx = canvas.getContext('2d');

    // UI Control Elements
    const nameInput = document.getElementById('input-name');
    const greetingSelect = document.getElementById('select-greeting-preset');
    const customGreetingWrapper = document.getElementById('custom-greeting-wrapper');
    const customGreetingInput = document.getElementById('input-custom-greeting');
    const fontSelect = document.getElementById('select-font');
    const fontSizeSlider = document.getElementById('input-font-size');
    const fontSizeVal = document.getElementById('size-val');
    const colorButtons = document.querySelectorAll('.color-btn');
    const customColorInput = document.getElementById('input-custom-color');
    const templateButtons = document.querySelectorAll('.template-btn');
    const btnDownload = document.getElementById('btn-download');
    const btnDownloadMobile = document.getElementById('btn-download-mobile');

    // Canvas State & Config
    let currentTemplate = 'tmpl-1';
    let greetingText = greetingSelect.value;
    let nameText = nameInput.value;
    let selectedFont = fontSelect.value;
    let selectedFontSize = parseInt(fontSizeSlider.value, 10);
    let selectedColor = '#D4AF37'; // Default Premium Gold

    // Text positions (in 1200x1200px canvas coordinates)
    let textState = {
        greeting: {
            text: '',
            x: 600,
            y: 540,
            fontSizeMultiplier: 1.2,
            isDragging: false,
            width: 0,
            height: 0
        },
        name: {
            text: '',
            x: 600,
            y: 720,
            fontSizeMultiplier: 1.5,
            isDragging: false,
            width: 0,
            height: 0
        }
    };

    // Drag-and-drop state
    let activeDragElement = null;
    let dragOffset = { x: 0, y: 0 };

    // Initialize Card Text Values
    updateTextContent();

    // Event Listeners for Controls
    nameInput.addEventListener('input', (e) => {
        nameText = e.target.value;
        updateTextContent();
        drawCard();
    });

    greetingSelect.addEventListener('change', (e) => {
        if (e.target.value === 'custom') {
            customGreetingWrapper.classList.remove('hidden');
            greetingText = customGreetingInput.value;
        } else {
            customGreetingWrapper.classList.add('hidden');
            // Extract display phrase from selection (remove Arabic text translation from preset value for card representation)
            const selectedText = e.target.options[e.target.selectedIndex].text;
            greetingText = selectedText.split(' (')[0];
        }
        updateTextContent();
        drawCard();
    });

    customGreetingInput.addEventListener('input', (e) => {
        greetingText = e.target.value;
        updateTextContent();
        drawCard();
    });

    fontSelect.addEventListener('change', (e) => {
        selectedFont = e.target.value;
        drawCard();
    });

    fontSizeSlider.addEventListener('input', (e) => {
        selectedFontSize = parseInt(e.target.value, 10);
        fontSizeVal.textContent = `${selectedFontSize}px`;
        drawCard();
    });

    // Theme color buttons
    colorButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            colorButtons.forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
            selectedColor = e.currentTarget.getAttribute('data-color');
            customColorInput.value = selectedColor;
            drawCard();
        });
    });

    // Custom Color Picker input
    customColorInput.addEventListener('input', (e) => {
        colorButtons.forEach(b => b.classList.remove('active'));
        selectedColor = e.target.value;
        drawCard();
    });

    // Template Selector buttons
    templateButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            templateButtons.forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
            currentTemplate = e.currentTarget.getAttribute('data-template');
            
            // Set dynamic default styling per template
            adjustDefaultsForTemplate(currentTemplate);
            drawCard();
        });
    });

    // Adjust fonts and colors based on template for instant premium match
    function adjustDefaultsForTemplate(tmpl) {
        if (tmpl === 'tmpl-1') { // Royal Night
            selectedColor = '#D4AF37';
            fontSelect.value = 'Cinzel';
            selectedFont = 'Cinzel';
        } else if (tmpl === 'tmpl-2') { // Emerald Grace
            selectedColor = '#FFFFFF';
            fontSelect.value = 'Amiri';
            selectedFont = 'Amiri';
        } else if (tmpl === 'tmpl-3') { // Sunset Gold
            selectedColor = '#FFFFFF';
            fontSelect.value = 'Playfair Display';
            selectedFont = 'Playfair Display';
        } else if (tmpl === 'tmpl-4') { // Pastel Rose
            selectedColor = '#2d1822';
            fontSelect.value = 'Montserrat';
            selectedFont = 'Montserrat';
        }
        
        // Sync control elements
        customColorInput.value = selectedColor;
        colorButtons.forEach(b => {
            if (b.getAttribute('data-color') === selectedColor) {
                b.classList.add('active');
            } else {
                b.classList.remove('active');
            }
        });
    }

    function updateTextContent() {
        textState.name.text = nameText.trim() ? nameText.trim() : "Your Name";
        textState.greeting.text = greetingText.trim() ? greetingText.trim() : "Eid Mubarak";
    }

    // High-DPI text resolution adjustment
    function getFontString(fontSize, font) {
        return `bold ${fontSize}px '${font}', 'Amiri', 'Montserrat', serif`;
    }

    // Helper: Draw Star
    function drawStar(cx, cy, spikes, outerRadius, innerRadius, color) {
        let rot = Math.PI / 2 * 3;
        let x = cx;
        let y = cy;
        let step = Math.PI / spikes;

        ctx.beginPath();
        ctx.moveTo(cx, cy - outerRadius);
        for (let i = 0; i < spikes; i++) {
            x = cx + Math.cos(rot) * outerRadius;
            y = cy + Math.sin(rot) * outerRadius;
            ctx.lineTo(x, y);
            rot += step;

            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            ctx.lineTo(x, y);
            rot += step;
        }
        ctx.lineTo(cx, cy - outerRadius);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
    }

    // Helper: Draw Crescent Moon
    function drawCrescentMoon(x, y, radius, color, glowColor) {
        ctx.save();
        if (glowColor) {
            ctx.shadowColor = glowColor;
            ctx.shadowBlur = 30;
        }
        
        ctx.beginPath();
        // Outer arc
        ctx.arc(x, y, radius, -Math.PI * 0.45, Math.PI * 0.75, false);
        // Inner arc to create a crescent moon shape
        ctx.arc(x + radius * 0.45, y - radius * 0.1, radius * 0.9, Math.PI * 0.68, -Math.PI * 0.4, true);
        ctx.closePath();
        
        ctx.fillStyle = color;
        ctx.fill();
        ctx.restore();
    }

    // Helper: Draw Elegant Islamic Hanging Lantern
    function drawLantern(x, y, width, height, color) {
        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = 2.5;
        ctx.fillStyle = color;
        
        // 1. Hanging wire
        ctx.beginPath();
        ctx.moveTo(x, y - height * 0.5);
        ctx.lineTo(x, y - height * 0.35);
        ctx.stroke();
        
        // 2. Lantern cap
        ctx.beginPath();
        ctx.moveTo(x - width * 0.25, y - height * 0.35);
        ctx.lineTo(x + width * 0.25, y - height * 0.35);
        ctx.lineTo(x + width * 0.1, y - height * 0.22);
        ctx.lineTo(x - width * 0.1, y - height * 0.22);
        ctx.closePath();
        ctx.fill();
        
        // 3. Lantern glass frame (middle body)
        ctx.beginPath();
        ctx.moveTo(x - width * 0.35, y - height * 0.22);
        ctx.lineTo(x + width * 0.35, y - height * 0.22);
        ctx.lineTo(x + width * 0.5, y + height * 0.1);
        ctx.lineTo(x + width * 0.25, y + height * 0.22);
        ctx.lineTo(x - width * 0.25, y + height * 0.22);
        ctx.lineTo(x - width * 0.5, y + height * 0.1);
        ctx.closePath();
        ctx.stroke();

        // Inner glowing candle/wick representation
        ctx.beginPath();
        ctx.arc(x, y - height * 0.05, width * 0.15, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 230, 150, 0.8)';
        ctx.shadowColor = 'rgba(255, 200, 100, 1)';
        ctx.shadowBlur = 20;
        ctx.fill();

        // Restore drawing color
        ctx.fillStyle = color;
        ctx.shadowBlur = 0;
        
        // Grid lines inside the lantern body
        ctx.beginPath();
        ctx.moveTo(x - width * 0.35, y - height * 0.22);
        ctx.quadraticCurveTo(x, y + height * 0.1, x - width * 0.25, y + height * 0.22);
        ctx.moveTo(x + width * 0.35, y - height * 0.22);
        ctx.quadraticCurveTo(x, y + height * 0.1, x + width * 0.25, y + height * 0.22);
        ctx.stroke();

        // 4. Lantern base cap
        ctx.beginPath();
        ctx.moveTo(x - width * 0.25, y + height * 0.22);
        ctx.lineTo(x + width * 0.25, y + height * 0.22);
        ctx.lineTo(x + width * 0.15, y + height * 0.32);
        ctx.lineTo(x - width * 0.15, y + height * 0.32);
        ctx.closePath();
        ctx.fill();
        
        // 5. Hanging tassel bottom
        ctx.beginPath();
        ctx.moveTo(x, y + height * 0.32);
        ctx.lineTo(x, y + height * 0.42);
        ctx.arc(x, y + height * 0.45, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        ctx.restore();
    }

    // Main Draw Engine
    function drawCard() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();

        // ------------------ TEMPLATE RENDER ENGINE ------------------
        if (currentTemplate === 'tmpl-1') {
            // Royal Night - Deep Indigo / Gold Splendor
            const bgGrad = ctx.createRadialGradient(600, 600, 100, 600, 600, 800);
            bgGrad.addColorStop(0, '#0d132e');
            bgGrad.addColorStop(0.5, '#070b1e');
            bgGrad.addColorStop(1, '#020308');
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Glowing background stars
            ctx.save();
            ctx.shadowColor = '#ffffff';
            ctx.shadowBlur = 10;
            drawStar(200, 180, 4, 12, 4, 'rgba(255, 255, 255, 0.9)');
            drawStar(1050, 220, 4, 18, 6, 'rgba(255, 245, 200, 0.9)');
            drawStar(900, 120, 4, 8, 3, 'rgba(255, 255, 255, 0.7)');
            drawStar(350, 880, 4, 14, 5, 'rgba(255, 255, 255, 0.8)');
            drawStar(150, 480, 4, 10, 3, 'rgba(255, 255, 255, 0.5)');
            drawStar(1080, 850, 4, 15, 5, 'rgba(255, 255, 255, 0.8)');
            ctx.restore();

            // Large crescent moon in center-top
            drawCrescentMoon(600, 320, 140, '#ffd700', 'rgba(212, 175, 55, 0.5)');

            // Elegant hanging lanterns
            drawLantern(220, 380, 70, 140, '#d4af37');
            drawLantern(980, 380, 70, 140, '#d4af37');
            drawLantern(380, 250, 45, 90, '#b8860b');
            drawLantern(820, 250, 45, 90, '#b8860b');

            // Intricate gold border
            ctx.strokeStyle = '#d4af37';
            ctx.lineWidth = 6;
            ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);
            ctx.strokeStyle = 'rgba(212, 175, 55, 0.3)';
            ctx.lineWidth = 1.5;
            ctx.strokeRect(52, 52, canvas.width - 104, canvas.height - 104);

            // Border corner design (glowing stars)
            drawStar(40, 40, 8, 20, 8, '#d4af37');
            drawStar(1160, 40, 8, 20, 8, '#d4af37');
            drawStar(40, 1160, 8, 20, 8, '#d4af37');
            drawStar(1160, 1160, 8, 20, 8, '#d4af37');

        } else if (currentTemplate === 'tmpl-2') {
            // Emerald Grace - Deep Rich Emerald / Gold Mandala
            const bgGrad = ctx.createRadialGradient(600, 600, 100, 600, 600, 850);
            bgGrad.addColorStop(0, '#0b3f27');
            bgGrad.addColorStop(0.6, '#042718');
            bgGrad.addColorStop(1, '#01120a');
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Large geometric Mandala in the center background
            ctx.save();
            ctx.translate(600, 340);
            ctx.strokeStyle = 'rgba(212, 175, 55, 0.18)';
            ctx.lineWidth = 2;
            for (let i = 0; i < 16; i++) {
                ctx.rotate(Math.PI / 8);
                ctx.strokeRect(-180, -180, 360, 360);
                ctx.beginPath();
                ctx.arc(0, 0, 180, 0, Math.PI * 2);
                ctx.stroke();
            }
            ctx.restore();

            // Elegant hanging lantern in the center of mandala
            drawLantern(600, 240, 90, 180, '#ffd700');

            // Floating stars
            drawStar(150, 150, 4, 12, 4, 'rgba(255, 255, 255, 0.8)');
            drawStar(1050, 150, 4, 12, 4, 'rgba(255, 255, 255, 0.8)');
            drawStar(150, 1050, 4, 12, 4, 'rgba(255, 255, 255, 0.8)');
            drawStar(1050, 1050, 4, 12, 4, 'rgba(255, 255, 255, 0.8)');

            // Elegant Golden Filigree Border Corners
            ctx.strokeStyle = '#d4af37';
            ctx.lineWidth = 5;
            ctx.strokeRect(50, 50, canvas.width - 100, canvas.height - 100);

            // Corner embellishments
            const designCorner = (x, y, rotate) => {
                ctx.save();
                ctx.translate(x, y);
                ctx.rotate(rotate);
                ctx.fillStyle = '#d4af37';
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(80, 0);
                ctx.lineTo(80, 10);
                ctx.lineTo(10, 80);
                ctx.lineTo(0, 80);
                ctx.closePath();
                ctx.fill();
                ctx.restore();
            };

            designCorner(50, 50, 0);
            designCorner(1150, 50, Math.PI / 2);
            designCorner(1150, 1150, Math.PI);
            designCorner(50, 1150, -Math.PI / 2);

        } else if (currentTemplate === 'tmpl-3') {
            // Sunset Gold - Silhouette mosque & sky gradient
            const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
            bgGrad.addColorStop(0, '#1a052e'); // Deep Purple
            bgGrad.addColorStop(0.35, '#5c134f'); // Magenta Sunset
            bgGrad.addColorStop(0.7, '#c96a26'); // Warm Orange
            bgGrad.addColorStop(1, '#ffc045'); // Golden glow bottom
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw floating warm particle light circles
            ctx.save();
            for (let i = 0; i < 25; i++) {
                ctx.beginPath();
                let x = Math.sin(i * 123) * 600 + 600;
                let y = Math.cos(i * 456) * 500 + 400;
                let size = (Math.sin(i) + 1.5) * 8;
                ctx.arc(x, y, size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 230, 160, ${0.15 + (i % 5) * 0.05})`;
                ctx.shadowColor = '#ffc045';
                ctx.shadowBlur = size * 1.5;
                ctx.fill();
            }
            ctx.restore();

            // Crescent Moon
            drawCrescentMoon(950, 200, 100, '#fff5cc', 'rgba(255, 200, 100, 0.4)');

            // Mosque dome silhouette at bottom
            ctx.save();
            ctx.fillStyle = '#0f0514'; // Near black silhouette
            ctx.shadowColor = '#000000';
            ctx.shadowBlur = 20;

            ctx.beginPath();
            // Main ground base
            ctx.rect(0, 1040, canvas.width, 160);
            
            // Central dome
            ctx.moveTo(600, 1040);
            ctx.bezierCurveTo(500, 1040, 520, 880, 600, 880);
            ctx.bezierCurveTo(680, 880, 700, 1040, 600, 1040);
            
            // Dome tip
            ctx.moveTo(600, 880);
            ctx.lineTo(600, 850);
            ctx.arc(600, 846, 4, 0, Math.PI*2);
            
            // Side Minaret Left
            ctx.rect(150, 700, 45, 340);
            ctx.moveTo(172, 700);
            ctx.lineTo(150, 660);
            ctx.lineTo(195, 660);
            ctx.closePath();
            
            // Side Minaret Right
            ctx.rect(1005, 700, 45, 340);
            ctx.moveTo(1027, 700);
            ctx.lineTo(1005, 660);
            ctx.lineTo(1050, 660);
            ctx.closePath();

            ctx.fill();
            ctx.restore();

            // Hanging lanterns in corners
            drawLantern(172, 300, 50, 100, 'rgba(255, 215, 0, 0.85)');
            drawLantern(1027, 300, 50, 100, 'rgba(255, 215, 0, 0.85)');

        } else if (currentTemplate === 'tmpl-4') {
            // Pastel Rose - Minimalist Pastel Chic
            const bgGrad = ctx.createRadialGradient(600, 600, 100, 600, 600, 850);
            bgGrad.addColorStop(0, '#f9ecec'); // Creamy peach rose
            bgGrad.addColorStop(0.6, '#e2c2c6'); // Dusy rose
            bgGrad.addColorStop(1, '#c09ca3'); // Warm mauve gray
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Fine modern golden line art mandala
            ctx.save();
            ctx.strokeStyle = 'rgba(102, 63, 72, 0.12)';
            ctx.lineWidth = 1.5;
            ctx.translate(600, 360);
            for (let i = 0; i < 24; i++) {
                ctx.rotate(Math.PI / 12);
                ctx.beginPath();
                ctx.ellipse(0, 0, 220, 80, 0, 0, Math.PI * 2);
                ctx.stroke();
            }
            ctx.restore();

            // Modern, minimalist line crescent
            ctx.save();
            ctx.strokeStyle = '#663f48';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.arc(600, 360, 110, -Math.PI * 0.35, Math.PI * 0.7, false);
            ctx.stroke();
            
            // Little hanging star in the center
            ctx.beginPath();
            ctx.moveTo(600, 290);
            ctx.lineTo(600, 340);
            ctx.strokeStyle = '#663f48';
            ctx.lineWidth = 2;
            ctx.stroke();
            drawStar(600, 345, 5, 12, 5, '#663f48');
            ctx.restore();

            // Sleek minimalist border
            ctx.strokeStyle = '#663f48';
            ctx.lineWidth = 3;
            ctx.strokeRect(60, 60, canvas.width - 120, canvas.height - 120);
        }

        // ------------------ TYPOGRAPHY OVERLAY ------------------
        
        // RENDER GREETING TEXT
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        const gFontVal = getFontString(Math.floor(selectedFontSize * textState.greeting.fontSizeMultiplier), selectedFont);
        ctx.font = gFontVal;
        
        // Set context values to compute metrics
        ctx.fillStyle = selectedColor;
        
        // Add exquisite shadows for standard high legibility
        if (currentTemplate === 'tmpl-4') {
            ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
            ctx.shadowBlur = 5;
            ctx.shadowOffsetX = 1;
            ctx.shadowOffsetY = 1;
        } else {
            ctx.shadowColor = 'rgba(0, 0, 0, 0.75)';
            ctx.shadowBlur = 15;
            ctx.shadowOffsetX = 3;
            ctx.shadowOffsetY = 3;
        }

        // Measure text for bounding box calculations
        const gMetrics = ctx.measureText(textState.greeting.text);
        textState.greeting.width = gMetrics.width;
        // Approximation of height based on font size
        textState.greeting.height = selectedFontSize * textState.greeting.fontSizeMultiplier;

        // Draw Greeting Text
        ctx.fillText(textState.greeting.text, textState.greeting.x, textState.greeting.y);

        // RENDER NAME TEXT
        const nFontVal = getFontString(Math.floor(selectedFontSize * textState.name.fontSizeMultiplier), selectedFont);
        ctx.font = nFontVal;
        
        if (currentTemplate === 'tmpl-4') {
            ctx.fillStyle = '#3a2026'; // Match minimalist palette dark rose
        } else {
            ctx.fillStyle = '#ffffff'; // Contrast white for other templates
        }

        // Measure Name text
        const nMetrics = ctx.measureText(textState.name.text);
        textState.name.width = nMetrics.width;
        textState.name.height = selectedFontSize * textState.name.fontSizeMultiplier;

        // Draw Name Text
        ctx.fillText(textState.name.text, textState.name.x, textState.name.y);

        ctx.restore();
    }

    // ------------------ INTERACTIVE DRAG & DROP ENGINE ------------------

    // Coordinates conversion relative to layout scales
    function getCanvasCoordinates(e) {
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        
        // Return 1:1 scale coordinates corresponding to 1200x1200px actual canvas size
        return {
            x: (clientX - rect.left) * (canvas.width / rect.width),
            y: (clientY - rect.top) * (canvas.height / rect.height)
        };
    }

    // Checking if click coordinates land inside a text bounding box
    function isInsideBoundingBox(clickX, clickY, element) {
        const halfWidth = element.width / 2;
        const halfHeight = element.height / 2;
        
        return (
            clickX >= element.x - halfWidth - 20 &&  // 20px padding buffer for touch ease
            clickX <= element.x + halfWidth + 20 &&
            clickY >= element.y - halfHeight - 20 &&
            clickY <= element.y + halfHeight + 20
        );
    }

    function handleStart(e) {
        const coords = getCanvasCoordinates(e);
        
        // Prioritize Name selection if text boxes overlap
        if (isInsideBoundingBox(coords.x, coords.y, textState.name)) {
            activeDragElement = 'name';
            dragOffset.x = coords.x - textState.name.x;
            dragOffset.y = coords.y - textState.name.y;
            canvas.style.cursor = 'grabbing';
            if (e.cancelable) e.preventDefault();
        } else if (isInsideBoundingBox(coords.x, coords.y, textState.greeting)) {
            activeDragElement = 'greeting';
            dragOffset.x = coords.x - textState.greeting.x;
            dragOffset.y = coords.y - textState.greeting.y;
            canvas.style.cursor = 'grabbing';
            if (e.cancelable) e.preventDefault();
        }
    }

    function handleMove(e) {
        if (!activeDragElement) {
            // Hover cursor styling check
            const coords = getCanvasCoordinates(e);
            if (isInsideBoundingBox(coords.x, coords.y, textState.name) || 
                isInsideBoundingBox(coords.x, coords.y, textState.greeting)) {
                canvas.style.cursor = 'pointer';
            } else {
                canvas.style.cursor = 'grab';
            }
            return;
        }

        const coords = getCanvasCoordinates(e);
        const element = textState[activeDragElement];
        
        // Update positions with drag bounds constraint (keeps text within canvas bounds)
        let targetX = coords.x - dragOffset.x;
        let targetY = coords.y - dragOffset.y;
        
        // Clamp bounds to prevent dragging elements entirely out of sight
        element.x = Math.max(80, Math.min(canvas.width - 80, targetX));
        element.y = Math.max(80, Math.min(canvas.height - 80, targetY));

        drawCard();
        if (e.cancelable) e.preventDefault();
    }

    function handleEnd(e) {
        if (activeDragElement) {
            activeDragElement = null;
            canvas.style.cursor = 'grab';
        }
    }

    // Attach Event Listeners for Interaction (Mouse + Mobile Touch)
    canvas.addEventListener('mousedown', handleStart);
    canvas.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleEnd);

    canvas.addEventListener('touchstart', handleStart, { passive: false });
    canvas.addEventListener('touchmove', handleMove, { passive: false });
    window.addEventListener('touchend', handleEnd);

    // ------------------ IMAGE GENERATION & DOWNLOAD ------------------

    function triggerDownload() {
        // Redraw at highest resolution before generating blob
        drawCard();

        // Create temporary anchor to trigger file download
        const dataURL = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        
        // Beautify filename by removing spaces
        const safeName = nameText.trim().replace(/[^a-z0-9]/gi, '_').toLowerCase();
        link.download = `eid_greeting_${safeName || 'card'}.png`;
        link.href = dataURL;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    btnDownload.addEventListener('click', triggerDownload);
    btnDownloadMobile.addEventListener('click', triggerDownload);

    // Initial Drawing triggered once fonts are loaded to prevent fallback render
    if (document.fonts) {
        document.fonts.ready.then(() => {
            drawCard();
        });
    } else {
        // Fallback delay if api not supported
        setTimeout(drawCard, 500);
    }

    // Force redraw on window load to ensure all layouts scale correctly
    window.addEventListener('load', drawCard);
});
