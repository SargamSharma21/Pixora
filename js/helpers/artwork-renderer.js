function renderArtworkCanvas(canvas, artwork, cellSize) {
    const context = canvas.getContext("2d");

    canvas.width = artwork.cols * cellSize;
    canvas.height = artwork.rows * cellSize;

    for (let row = 0; row < artwork.rows; row++) {
        for (let col = 0; col < artwork.cols; col++) {
            const color = artwork.matrix[row][col];

            if (color && color !== "transparent") {
                context.fillStyle = color;
                context.fillRect(
                    col * cellSize,
                    row * cellSize,
                    cellSize,
                    cellSize
                );
            }

            context.strokeStyle = "#ddd";
            context.lineWidth = 1;
            context.strokeRect(
                col * cellSize,
                row * cellSize,
                cellSize,
                cellSize
            );
        }
    }
}