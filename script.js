document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('drawing-canvas');
    const ctx = canvas.getContext('2d');
    const colorPicker = document.getElementById('color');
    const brushSize = document.getElementById('size');
    const sizeValue = document.getElementById('size-value');
    const clearButton = document.getElementById('clear');
    
    // Set canvas size to match displayed size
    function resizeCanvas() {
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
    }
    
    // Initial resize
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Drawing state
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;
    
    // Update brush size display
    sizeValue.textContent = brushSize.value;
    brushSize.addEventListener('input', () => {
        sizeValue.textContent = brushSize.value;
    });
    
    // Start drawing
    function startDrawing(e) {
        isDrawing = true;
        [lastX, lastY] = getPosition(e);
    }
    
    // Draw
    function draw(e) {
        if (!isDrawing) return;
        
        ctx.strokeStyle = colorPicker.value;
        ctx.lineWidth = brushSize.value;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        const [x, y] = getPosition(e);
        
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.stroke();
        
        [lastX, lastY] = [x, y];
    }
    
    // Stop drawing
    function stopDrawing() {
        isDrawing = false;
    }
    
    // Get position (works for both mouse and touch events)
    function getPosition(e) {
        const rect = canvas.getBoundingClientRect();
        let clientX, clientY;
        
        if (e.touches) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }
        
        return [
            clientX - rect.left,
            clientY - rect.top
        ];
    }
    
    // Clear canvas
    clearButton.addEventListener('click', () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
    
    // Mouse events
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    
    // Touch events
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        startDrawing(e);
    });
    
    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        draw(e);
    });
    
    canvas.addEventListener('touchend', stopDrawing);
});