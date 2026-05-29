/**
 * Premium Upgraded Eid Greeting Card Generator Engine
 * Features: High-res canvas render, touch drag-and-drop, custom letter spacing, outline strokes, 6 themes,
 * and a Web Audio API ambient chime synthesizer.
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

    // Upgrade: Advanced Canvas Styling Controls
    const letterSpacingSlider = document.getElementById('input-letter-spacing');
    const letterSpacingVal = document.getElementById('spacing-val');
    const checkEnableStroke = document.getElementById('check-enable-stroke');
    const strokeControlsRow = document.getElementById('stroke-controls-row');
    const strokeWidthSlider = document.getElementById('input-stroke-width');
    const strokeWidthVal = document.getElementById('stroke-width-val');
    const strokeColorInput = document.getElementById('input-stroke-color');
    const strokeColorHex = document.getElementById('stroke-color-hex');
    const alignButtons = document.querySelectorAll('.btn-align');
    const btnResetCoords = document.getElementById('btn-reset-coords');

    // Upgrade: Navigation Tabs
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    // Upgrade: Atmosphere Audio Controls
    const btnAudioToggle = document.getElementById('btn-audio-toggle');
    const soundWavesIndicator = document.getElementById('sound-waves-indicator');
    const audioVolumeSlider = document.getElementById('input-audio-volume');
    const audioVolumeVal = document.getElementById('audio-volume-val');
    const selectAudioHarmony = document.getElementById('select-audio-harmony');

    // Canvas State & Config
    let currentTemplate = 'tmpl-1';
    let greetingText = greetingSelect.value;
    let nameText = nameInput.value;
    let selectedFont = fontSelect.value;
    let selectedFontSize = parseInt(fontSizeSlider.value, 10);
    let selectedColor = '#D4AF37'; // Default Gold
    
    // Upgraded: Text outline configuration
    let enableStroke = checkEnableStroke.checked;
    let strokeWidth = parseInt(strokeWidthSlider.value, 10);
    let strokeColor = strokeColorInput.value;
    let textLetterSpacing = parseInt(letterSpacingSlider.value, 10);
    let textAlignment = 'center'; // 'left', 'center', 'right'

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

    // ------------------ TAB NAVIGATION EVENT ENGINE ------------------
    tabButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetTab = e.currentTarget.getAttribute('data-tab');
            
            // Toggle active states
            tabButtons.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
            });
            e.currentTarget.classList.add('active');
            e.currentTarget.setAttribute('aria-selected', 'true');

            tabPanels.forEach(panel => {
                if (panel.id === `${targetTab.substring(4)}-panel`) {
                    panel.classList.add('active');
                } else {
                    panel.classList.remove('active');
                }
            });
        });
    });

    // ------------------ UPGRADE: TEXT CONTROLS EVENTS ------------------
    letterSpacingSlider.addEventListener('input', (e) => {
        textLetterSpacing = parseInt(e.target.value, 10);
        letterSpacingVal.textContent = `${textLetterSpacing}px`;
        drawCard();
    });

    checkEnableStroke.addEventListener('change', (e) => {
        enableStroke = e.target.checked;
        if (enableStroke) {
            strokeControlsRow.classList.remove('hidden');
        } else {
            strokeControlsRow.classList.add('hidden');
        }
        drawCard();
    });

    strokeWidthSlider.addEventListener('input', (e) => {
        strokeWidth = parseInt(e.target.value, 10);
        strokeWidthVal.textContent = `${strokeWidth}px`;
        drawCard();
    });

    strokeColorInput.addEventListener('input', (e) => {
        strokeColor = e.target.value;
        strokeColorHex.textContent = strokeColor.toUpperCase();
        drawCard();
    });

    alignButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            alignButtons.forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
            textAlignment = e.currentTarget.getAttribute('data-align');
            drawCard();
        });
    });

    btnResetCoords.addEventListener('click', () => {
        textState.greeting.x = 600;
        textState.greeting.y = 540;
        textState.name.x = 600;
        textState.name.y = 720;
        
        textAlignment = 'center';
        alignButtons.forEach(b => {
            if (b.getAttribute('data-align') === 'center') b.classList.add('active');
            else b.classList.remove('active');
        });
        
        drawCard();
    });

    // ------------------ BASE FORM CONTROL EVENTS ------------------
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

    function adjustDefaultsForTemplate(tmpl) {
        if (tmpl === 'tmpl-1') { // Royal Night
            selectedColor = '#D4AF37';
            strokeColor = '#000000';
            enableStroke = true;
            fontSelect.value = 'Cinzel';
            selectedFont = 'Cinzel';
        } else if (tmpl === 'tmpl-2') { // Emerald Grace
            selectedColor = '#FFFFFF';
            strokeColor = '#021a11';
            enableStroke = true;
            fontSelect.value = 'Amiri';
            selectedFont = 'Amiri';
        } else if (tmpl === 'tmpl-3') { // Sunset Gold
            selectedColor = '#FFFFFF';
            strokeColor = '#0f0514';
            enableStroke = true;
            fontSelect.value = 'Playfair Display';
            selectedFont = 'Playfair Display';
        } else if (tmpl === 'tmpl-4') { // Pastel Rose
            selectedColor = '#2d1822';
            enableStroke = false;
            fontSelect.value = 'Montserrat';
            selectedFont = 'Montserrat';
        } else if (tmpl === 'tmpl-5') { // Royal Purple
            selectedColor = '#D4AF37';
            strokeColor = '#0c0414';
            enableStroke = true;
            fontSelect.value = 'Reem Kufi';
            selectedFont = 'Reem Kufi';
        } else if (tmpl === 'tmpl-6') { // Ivory Gold
            selectedColor = '#665326';
            strokeColor = '#ffffff';
            enableStroke = true;
            fontSelect.value = 'Cinzel';
            selectedFont = 'Cinzel';
        }
        
        // Sync control elements
        customColorInput.value = selectedColor;
        strokeColorInput.value = strokeColor;
        strokeColorHex.textContent = strokeColor.toUpperCase();
        checkEnableStroke.checked = enableStroke;
        
        if (enableStroke) {
            strokeControlsRow.classList.remove('hidden');
        } else {
            strokeControlsRow.classList.add('hidden');
        }

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
        ctx.arc(x, y, radius, -Math.PI * 0.45, Math.PI * 0.75, false);
        ctx.arc(x + radius * 0.45, y - radius * 0.1, radius * 0.9, Math.PI * 0.68, -Math.PI * 0.4, true);
        ctx.closePath();
        
        ctx.fillStyle = color;
        ctx.fill();
        ctx.restore();
    }

    // Helper: Draw elegant lantern
    function drawLantern(x, y, width, height, color) {
        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = 2.5;
        ctx.fillStyle = color;
        
        ctx.beginPath();
        ctx.moveTo(x, y - height * 0.5);
        ctx.lineTo(x, y - height * 0.35);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(x - width * 0.25, y - height * 0.35);
        ctx.lineTo(x + width * 0.25, y - height * 0.35);
        ctx.lineTo(x + width * 0.1, y - height * 0.22);
        ctx.lineTo(x - width * 0.1, y - height * 0.22);
        ctx.closePath();
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(x - width * 0.35, y - height * 0.22);
        ctx.lineTo(x + width * 0.35, y - height * 0.22);
        ctx.lineTo(x + width * 0.5, y + height * 0.1);
        ctx.lineTo(x + width * 0.25, y + height * 0.22);
        ctx.lineTo(x - width * 0.25, y + height * 0.22);
        ctx.lineTo(x - width * 0.5, y + height * 0.1);
        ctx.closePath();
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(x, y - height * 0.05, width * 0.15, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 230, 150, 0.8)';
        ctx.shadowColor = 'rgba(255, 200, 100, 1)';
        ctx.shadowBlur = 20;
        ctx.fill();

        ctx.fillStyle = color;
        ctx.shadowBlur = 0;
        
        ctx.beginPath();
        ctx.moveTo(x - width * 0.35, y - height * 0.22);
        ctx.quadraticCurveTo(x, y + height * 0.1, x - width * 0.25, y + height * 0.22);
        ctx.moveTo(x + width * 0.35, y - height * 0.22);
        ctx.quadraticCurveTo(x, y + height * 0.1, x + width * 0.25, y + height * 0.22);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x - width * 0.25, y + height * 0.22);
        ctx.lineTo(x + width * 0.25, y + height * 0.22);
        ctx.lineTo(x + width * 0.15, y + height * 0.32);
        ctx.lineTo(x - width * 0.15, y + height * 0.32);
        ctx.closePath();
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(x, y + height * 0.32);
        ctx.lineTo(x, y + height * 0.42);
        ctx.arc(x, y + height * 0.45, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        ctx.restore();
    }

    // Main Draw Engine (renders all 6 templates)
    function drawCard() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();

        // ------------------ TEMPLATE RENDERS ------------------
        if (currentTemplate === 'tmpl-1') {
            // Royal Night
            const bgGrad = ctx.createRadialGradient(600, 600, 100, 600, 600, 800);
            bgGrad.addColorStop(0, '#0d132e');
            bgGrad.addColorStop(0.5, '#070b1e');
            bgGrad.addColorStop(1, '#020308');
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

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

            drawCrescentMoon(600, 320, 140, '#ffd700', 'rgba(212, 175, 55, 0.5)');
            drawLantern(220, 380, 70, 140, '#d4af37');
            drawLantern(980, 380, 70, 140, '#d4af37');
            drawLantern(380, 250, 45, 90, '#b8860b');
            drawLantern(820, 250, 45, 90, '#b8860b');

            ctx.strokeStyle = '#d4af37';
            ctx.lineWidth = 6;
            ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);
            ctx.strokeStyle = 'rgba(212, 175, 55, 0.3)';
            ctx.lineWidth = 1.5;
            ctx.strokeRect(52, 52, canvas.width - 104, canvas.height - 104);

            drawStar(40, 40, 8, 20, 8, '#d4af37');
            drawStar(1160, 40, 8, 20, 8, '#d4af37');
            drawStar(40, 1160, 8, 20, 8, '#d4af37');
            drawStar(1160, 1160, 8, 20, 8, '#d4af37');

        } else if (currentTemplate === 'tmpl-2') {
            // Emerald Grace
            const bgGrad = ctx.createRadialGradient(600, 600, 100, 600, 600, 850);
            bgGrad.addColorStop(0, '#0b3f27');
            bgGrad.addColorStop(0.6, '#042718');
            bgGrad.addColorStop(1, '#01120a');
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

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

            drawLantern(600, 240, 90, 180, '#ffd700');

            drawStar(150, 150, 4, 12, 4, 'rgba(255, 255, 255, 0.8)');
            drawStar(1050, 150, 4, 12, 4, 'rgba(255, 255, 255, 0.8)');
            drawStar(150, 1050, 4, 12, 4, 'rgba(255, 255, 255, 0.8)');
            drawStar(1050, 1050, 4, 12, 4, 'rgba(255, 255, 255, 0.8)');

            ctx.strokeStyle = '#d4af37';
            ctx.lineWidth = 5;
            ctx.strokeRect(50, 50, canvas.width - 100, canvas.height - 100);

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
            // Sunset Gold
            const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
            bgGrad.addColorStop(0, '#1a052e');
            bgGrad.addColorStop(0.35, '#5c134f');
            bgGrad.addColorStop(0.7, '#c96a26');
            bgGrad.addColorStop(1, '#ffc045');
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

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

            drawCrescentMoon(950, 200, 100, '#fff5cc', 'rgba(255, 200, 100, 0.4)');

            ctx.save();
            ctx.fillStyle = '#0f0514';
            ctx.shadowColor = '#000000';
            ctx.shadowBlur = 20;

            ctx.beginPath();
            ctx.rect(0, 1040, canvas.width, 160);
            
            ctx.moveTo(600, 1040);
            ctx.bezierCurveTo(500, 1040, 520, 880, 600, 880);
            ctx.bezierCurveTo(680, 880, 700, 1040, 600, 1040);
            
            ctx.moveTo(600, 880);
            ctx.lineTo(600, 850);
            ctx.arc(600, 846, 4, 0, Math.PI*2);
            
            ctx.rect(150, 700, 45, 340);
            ctx.moveTo(172, 700);
            ctx.lineTo(150, 660);
            ctx.lineTo(195, 660);
            ctx.closePath();
            
            ctx.rect(1005, 700, 45, 340);
            ctx.moveTo(1027, 700);
            ctx.lineTo(1005, 660);
            ctx.lineTo(1050, 660);
            ctx.closePath();

            ctx.fill();
            ctx.restore();

            drawLantern(172, 300, 50, 100, 'rgba(255, 215, 0, 0.85)');
            drawLantern(1027, 300, 50, 100, 'rgba(255, 215, 0, 0.85)');

        } else if (currentTemplate === 'tmpl-4') {
            // Pastel Rose
            const bgGrad = ctx.createRadialGradient(600, 600, 100, 600, 600, 850);
            bgGrad.addColorStop(0, '#f9ecec');
            bgGrad.addColorStop(0.6, '#e2c2c6');
            bgGrad.addColorStop(1, '#c09ca3');
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

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

            ctx.save();
            ctx.strokeStyle = '#663f48';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.arc(600, 360, 110, -Math.PI * 0.35, Math.PI * 0.7, false);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(600, 290);
            ctx.lineTo(600, 340);
            ctx.strokeStyle = '#663f48';
            ctx.lineWidth = 2;
            ctx.stroke();
            drawStar(600, 345, 5, 12, 5, '#663f48');
            ctx.restore();

            ctx.strokeStyle = '#663f48';
            ctx.lineWidth = 3;
            ctx.strokeRect(60, 60, canvas.width - 120, canvas.height - 120);

        } else if (currentTemplate === 'tmpl-5') {
            // Upgrade: Royal Purple Theme
            const bgGrad = ctx.createRadialGradient(600, 600, 50, 600, 600, 800);
            bgGrad.addColorStop(0, '#2e0854'); // Rich deep violet
            bgGrad.addColorStop(0.5, '#17032d'); // Dark grape purple
            bgGrad.addColorStop(1, '#05000a'); // Velvet black
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Glowing backgrounds lines representing vector mosque dome arches
            ctx.save();
            ctx.strokeStyle = 'rgba(168, 85, 247, 0.2)';
            ctx.lineWidth = 2;
            ctx.shadowColor = '#a855f7';
            ctx.shadowBlur = 15;
            for (let r = 200; r <= 800; r += 150) {
                ctx.beginPath();
                ctx.arc(600, 1200, r, Math.PI, 0, false);
                ctx.stroke();
            }
            ctx.restore();

            // Glowing golden background stars
            ctx.save();
            ctx.shadowColor = '#ffd700';
            ctx.shadowBlur = 8;
            drawStar(150, 250, 5, 10, 4, '#ffd700');
            drawStar(1050, 250, 5, 10, 4, '#ffd700');
            drawStar(300, 120, 4, 8, 3, 'rgba(255,255,255,0.7)');
            drawStar(900, 120, 4, 8, 3, 'rgba(255,255,255,0.7)');
            drawStar(600, 450, 4, 6, 2, 'rgba(255,255,255,0.5)');
            ctx.restore();

            // Large crescent moon with purple-to-gold inner glow
            drawCrescentMoon(600, 260, 120, '#ffd700', 'rgba(168, 85, 247, 0.5)');

            // Elegant hanging lanterns in gold/purple
            drawLantern(300, 360, 55, 110, '#ffd700');
            drawLantern(900, 360, 55, 110, '#ffd700');

            // Intricate border
            ctx.strokeStyle = '#d4af37';
            ctx.lineWidth = 4;
            ctx.strokeRect(50, 50, canvas.width - 100, canvas.height - 100);
            
            ctx.strokeStyle = 'rgba(168, 85, 247, 0.4)';
            ctx.lineWidth = 1.5;
            ctx.strokeRect(62, 62, canvas.width - 124, canvas.height - 124);

            drawStar(50, 50, 8, 16, 7, '#ffd700');
            drawStar(1150, 50, 8, 16, 7, '#ffd700');
            drawStar(50, 1150, 8, 16, 7, '#ffd700');
            drawStar(1150, 1150, 8, 16, 7, '#ffd700');

        } else if (currentTemplate === 'tmpl-6') {
            // Upgrade: Ivory Gold Theme (High-end Elegant Minimalist)
            const bgGrad = ctx.createRadialGradient(600, 600, 100, 600, 600, 800);
            bgGrad.addColorStop(0, '#fdfbf7'); // Pure warm cream
            bgGrad.addColorStop(0.6, '#f3ebd9'); // Soft ivory
            bgGrad.addColorStop(1, '#dfd3bc'); // Muted luxury gold beige
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Overlapping elegant golden circle line textures in background
            ctx.save();
            ctx.strokeStyle = 'rgba(212, 175, 55, 0.15)';
            ctx.lineWidth = 1.5;
            for (let d = 100; d <= 700; d += 150) {
                ctx.beginPath();
                ctx.arc(150, 150, d, 0, Math.PI * 2);
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(1050, 150, d, 0, Math.PI * 2);
                ctx.stroke();
            }
            ctx.restore();

            // Minimalist vector crescent moon and star
            ctx.save();
            ctx.strokeStyle = '#c0a368';
            ctx.lineWidth = 3.5;
            ctx.beginPath();
            ctx.arc(600, 300, 100, -Math.PI * 0.4, Math.PI * 0.7, false);
            ctx.stroke();
            
            // Floating delicate stars
            drawStar(600, 240, 5, 8, 3, '#c0a368');
            drawStar(250, 250, 4, 10, 4, 'rgba(192, 163, 104, 0.5)');
            drawStar(950, 250, 4, 10, 4, 'rgba(192, 163, 104, 0.5)');
            ctx.restore();

            // Delicate gold floral-like borders
            ctx.strokeStyle = '#c0a368';
            ctx.lineWidth = 3;
            ctx.strokeRect(55, 55, canvas.width - 110, canvas.height - 110);
            ctx.lineWidth = 1;
            ctx.strokeRect(65, 65, canvas.width - 130, canvas.height - 130);

            // Small corner stars
            drawStar(55, 55, 4, 10, 4, '#c0a368');
            drawStar(1145, 55, 4, 10, 4, '#c0a368');
            drawStar(55, 1145, 4, 10, 4, '#c0a368');
            drawStar(1145, 1145, 4, 10, 4, '#c0a368');
        }

        // ------------------ TYPOGRAPHY RENDERING ------------------
        
        ctx.textBaseline = 'middle';
        
        // 1. Setup Letter Spacing (Upgrade: Native browser support mapping)
        ctx.letterSpacing = `${textLetterSpacing}px`;

        // 2. Setup Alignment
        ctx.textAlign = textAlignment;

        // RENDER GREETING TEXT
        ctx.save();
        const gFontVal = getFontString(Math.floor(selectedFontSize * textState.greeting.fontSizeMultiplier), selectedFont);
        ctx.font = gFontVal;
        
        // Add default visual text shadows
        if (currentTemplate === 'tmpl-6') {
            ctx.shadowColor = 'rgba(0, 0, 0, 0.08)';
            ctx.shadowBlur = 6;
            ctx.shadowOffsetX = 1;
            ctx.shadowOffsetY = 1;
        } else {
            ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
            ctx.shadowBlur = 12;
            ctx.shadowOffsetX = 3;
            ctx.shadowOffsetY = 3;
        }

        // Measure text metrics
        const gMetrics = ctx.measureText(textState.greeting.text);
        textState.greeting.width = gMetrics.width;
        textState.greeting.height = selectedFontSize * textState.greeting.fontSizeMultiplier;

        // Draw outline (Stroke) if enabled (Upgrade: legibility helper)
        if (enableStroke) {
            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = strokeWidth;
            ctx.lineJoin = 'round';
            ctx.strokeText(textState.greeting.text, textState.greeting.x, textState.greeting.y);
        }

        // Fill text
        ctx.fillStyle = selectedColor;
        ctx.fillText(textState.greeting.text, textState.greeting.x, textState.greeting.y);
        ctx.restore();

        // RENDER NAME TEXT
        ctx.save();
        const nFontVal = getFontString(Math.floor(selectedFontSize * textState.name.fontSizeMultiplier), selectedFont);
        ctx.font = nFontVal;
        
        if (currentTemplate === 'tmpl-6') {
            ctx.shadowColor = 'rgba(0, 0, 0, 0.08)';
            ctx.shadowBlur = 6;
            ctx.shadowOffsetX = 1;
            ctx.shadowOffsetY = 1;
        } else {
            ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
            ctx.shadowBlur = 12;
            ctx.shadowOffsetX = 3;
            ctx.shadowOffsetY = 3;
        }

        const nMetrics = ctx.measureText(textState.name.text);
        textState.name.width = nMetrics.width;
        textState.name.height = selectedFontSize * textState.name.fontSizeMultiplier;

        // Draw outline (Stroke) if enabled
        if (enableStroke) {
            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = strokeWidth;
            ctx.lineJoin = 'round';
            ctx.strokeText(textState.name.text, textState.name.x, textState.name.y);
        }

        // Fill text
        if (currentTemplate === 'tmpl-6') {
            ctx.fillStyle = '#4c3917'; // Elegant contrasting dark bronze for ivory theme
        } else {
            ctx.fillStyle = '#ffffff'; // White contrasting name for darker backgrounds
        }
        ctx.fillText(textState.name.text, textState.name.x, textState.name.y);
        ctx.restore();

        // Upgrade: Draw subtle visual bounding boxes when dragging to guide user!
        if (activeDragElement) {
            ctx.save();
            const elem = textState[activeDragElement];
            ctx.strokeStyle = 'rgba(212, 175, 55, 0.6)';
            ctx.lineWidth = 2;
            ctx.setLineDash([6, 6]);
            
            let boxX = elem.x;
            const halfW = elem.width / 2;
            const halfH = elem.height / 2;
            
            // Adjust box coordinates relative to alignment
            if (textAlignment === 'left') {
                ctx.strokeRect(boxX - 10, elem.y - halfH - 10, elem.width + 20, elem.height + 20);
            } else if (textAlignment === 'right') {
                ctx.strokeRect(boxX - elem.width - 10, elem.y - halfH - 10, elem.width + 20, elem.height + 20);
            } else { // Center
                ctx.strokeRect(boxX - halfW - 10, elem.y - halfH - 10, elem.width + 20, elem.height + 20);
            }
            ctx.restore();
        }

        ctx.restore();
    }

    // ------------------ INTERACTIVE DRAG & DROP ENGINE ------------------

    function getCanvasCoordinates(e) {
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        
        return {
            x: (clientX - rect.left) * (canvas.width / rect.width),
            y: (clientY - rect.top) * (canvas.height / rect.height)
        };
    }

    function isInsideBoundingBox(clickX, clickY, element) {
        const halfWidth = element.width / 2;
        const halfHeight = element.height / 2;
        
        let minX, maxX;
        
        // Alignment-aware click bounding boxes calculation
        if (textAlignment === 'left') {
            minX = element.x - 20;
            maxX = element.x + element.width + 20;
        } else if (textAlignment === 'right') {
            minX = element.x - element.width - 20;
            maxX = element.x + 20;
        } else { // center
            minX = element.x - halfWidth - 20;
            maxX = element.x + halfWidth + 20;
        }

        const minY = element.y - halfHeight - 20;
        const maxY = element.y + halfHeight + 20;
        
        return (clickX >= minX && clickX <= maxX && clickY >= minY && clickY <= maxY);
    }

    function handleStart(e) {
        const coords = getCanvasCoordinates(e);
        
        if (isInsideBoundingBox(coords.x, coords.y, textState.name)) {
            activeDragElement = 'name';
            dragOffset.x = coords.x - textState.name.x;
            dragOffset.y = coords.y - textState.name.y;
            canvas.style.cursor = 'grabbing';
            if (e.cancelable) e.preventDefault();
            drawCard(); // Force draw boundary indicators
        } else if (isInsideBoundingBox(coords.x, coords.y, textState.greeting)) {
            activeDragElement = 'greeting';
            dragOffset.x = coords.x - textState.greeting.x;
            dragOffset.y = coords.y - textState.greeting.y;
            canvas.style.cursor = 'grabbing';
            if (e.cancelable) e.preventDefault();
            drawCard();
        }
    }

    function handleMove(e) {
        if (!activeDragElement) {
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
        
        let targetX = coords.x - dragOffset.x;
        let targetY = coords.y - dragOffset.y;
        
        // Clamp bounds to prevent elements dragging completely off canvas
        element.x = Math.max(80, Math.min(canvas.width - 80, targetX));
        element.y = Math.max(80, Math.min(canvas.height - 80, targetY));

        drawCard();
        if (e.cancelable) e.preventDefault();
    }

    function handleEnd(e) {
        if (activeDragElement) {
            activeDragElement = null;
            canvas.style.cursor = 'grab';
            drawCard(); // Redraw to clear active border boundaries
        }
    }

    canvas.addEventListener('mousedown', handleStart);
    canvas.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleEnd);

    canvas.addEventListener('touchstart', handleStart, { passive: false });
    canvas.addEventListener('touchmove', handleMove, { passive: false });
    window.addEventListener('touchend', handleEnd);

    // ------------------ IMAGE GENERATION & DOWNLOAD ------------------

    function triggerDownload() {
        drawCard(); // Re-render clean file (no dragging boxes)
        const dataURL = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        const safeName = nameText.trim().replace(/[^a-z0-9]/gi, '_').toLowerCase();
        link.download = `eid_greeting_${safeName || 'card'}.png`;
        link.href = dataURL;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    btnDownload.addEventListener('click', triggerDownload);
    btnDownloadMobile.addEventListener('click', triggerDownload);

    // ------------------ WEB AUDIO API SYNTHESIZER ------------------
    let audioCtx = null;
    let mainVolumeNode = null;
    let audioTimer = null;
    let isPlayingAudio = false;

    // Pentatonic scale note frequencies (Ney / peaceful scales)
    const SCALES = {
        ney: [220.00, 246.94, 293.66, 329.63, 392.00, 440.00, 493.88, 587.33, 659.25], // Pentatonic Minor scale
        oud: [146.83, 164.81, 185.00, 196.00, 220.00, 233.08, 277.18, 293.66, 329.63], // Minor Phrygian scale
        ambient: [110.00, 164.81, 220.00, 277.18, 329.63, 440.00, 554.37, 659.25] // Warm Maj chords
    };

    function initAudio() {
        // Initialize standard AudioContext
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContextClass();
        
        // Master Gain Node for volume adjustment
        mainVolumeNode = audioCtx.createGain();
        mainVolumeNode.gain.setValueAtTime(parseFloat(audioVolumeSlider.value) / 200, audioCtx.currentTime); // Soft base volume
        
        // Warm spacious Delay/Feedback effect loop
        const delayNode = audioCtx.createDelay(1.5);
        const feedbackNode = audioCtx.createGain();
        
        delayNode.delayTime.setValueAtTime(0.6, audioCtx.currentTime); // 600ms delay echo
        feedbackNode.gain.setValueAtTime(0.4, audioCtx.currentTime); // 40% feedback decay

        // Connect nodes delay loop: sound -> delay -> gain feedback -> delay -> master
        delayNode.connect(feedbackNode);
        feedbackNode.connect(delayNode);
        
        // Connect delays and main node to speakers
        delayNode.connect(mainVolumeNode);
        mainVolumeNode.connect(audioCtx.destination);
    }

    function playSoftChime() {
        if (!audioCtx || audioCtx.state === 'suspended') return;

        const harmonyType = selectAudioHarmony.value;
        const notes = SCALES[harmonyType];
        
        // Pick random note from scale
        const frequency = notes[Math.floor(Math.random() * notes.length)];
        
        const osc = audioCtx.createOscillator();
        const noteGain = audioCtx.createGain();
        
        // Peaceful warm sound shape: Sine or Triangle wave
        osc.type = harmonyType === 'oud' ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);
        
        // Envelop styling: instant attack, long peaceful delay decay
        noteGain.gain.setValueAtTime(0, audioCtx.currentTime);
        noteGain.gain.linearRampToValueAtTime(0.25, audioCtx.currentTime + 0.05); // Rapid swell
        noteGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 2.5); // 2.5 second long decay echo
        
        osc.connect(noteGain);
        
        // Connect to both dry master node and wet delay node
        noteGain.connect(mainVolumeNode);
        
        // Delay loop connection (to make it spacious)
        const delayInputNode = audioCtx.destination; 
        noteGain.connect(mainVolumeNode); // Route to main delay node
        
        osc.start(audioCtx.currentTime);
        osc.stop(audioCtx.currentTime + 2.6);
    }

    // Peaceful backing continuous background pad synthesizer
    let padOsc1 = null;
    let padOsc2 = null;
    let padGain = null;

    function startBackgroundAmbientPad() {
        if (!audioCtx) return;

        padGain = audioCtx.createGain();
        padGain.gain.setValueAtTime(0, audioCtx.currentTime);
        padGain.gain.linearRampToValueAtTime(0.06, audioCtx.currentTime + 2.0); // Slow fade-in

        padOsc1 = audioCtx.createOscillator();
        padOsc2 = audioCtx.createOscillator();

        padOsc1.type = 'sine';
        padOsc2.type = 'sine';

        // Detuned root low frequencies to create warmth (A2 & A2 detuned)
        padOsc1.frequency.setValueAtTime(110.00, audioCtx.currentTime); 
        padOsc2.frequency.setValueAtTime(110.40, audioCtx.currentTime); // Mellow beat frequency

        padOsc1.connect(padGain);
        padOsc2.connect(padGain);
        padGain.connect(mainVolumeNode);

        padOsc1.start();
        padOsc2.start();
    }

    function stopBackgroundAmbientPad() {
        if (padGain) {
            try {
                padGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.5);
                setTimeout(() => {
                    if (padOsc1) padOsc1.stop();
                    if (padOsc2) padOsc2.stop();
                }, 600);
            } catch (e) {}
        }
    }

    function toggleAudio() {
        if (!audioCtx) {
            initAudio();
        }

        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        if (isPlayingAudio) {
            // Stop sound
            isPlayingAudio = false;
            btnAudioToggle.querySelector('.play-icon').classList.remove('hidden');
            btnAudioToggle.querySelector('.pause-icon').classList.add('hidden');
            soundWavesIndicator.classList.remove('active');
            
            clearInterval(audioTimer);
            stopBackgroundAmbientPad();
        } else {
            // Play sound
            isPlayingAudio = true;
            btnAudioToggle.querySelector('.play-icon').classList.add('hidden');
            btnAudioToggle.querySelector('.pause-icon').classList.remove('hidden');
            soundWavesIndicator.classList.add('active');
            
            startBackgroundAmbientPad();
            
            // Initial chime notes
            playSoftChime();
            setTimeout(playSoftChime, 800);
            
            // Loop note scheduler (play chimes every 1.5s to 3s dynamically!)
            audioTimer = setInterval(() => {
                playSoftChime();
                if (Math.random() > 0.6) {
                    setTimeout(playSoftChime, 600); // Occasional chord triggers
                }
            }, 1800);
        }
    }

    btnAudioToggle.addEventListener('click', toggleAudio);

    audioVolumeSlider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        audioVolumeVal.textContent = `${val}%`;
        
        if (mainVolumeNode && audioCtx) {
            // Gain level adjustment
            mainVolumeNode.gain.linearRampToValueAtTime(val / 200, audioCtx.currentTime + 0.1);
        }
    });

    // ------------------ INITIALIZATION AND START ------------------
    if (document.fonts) {
        document.fonts.ready.then(() => {
            drawCard();
        });
    } else {
        setTimeout(drawCard, 500);
    }

    window.addEventListener('load', drawCard);
});
