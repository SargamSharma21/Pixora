const currentUser = localStorage.getItem("logged_in_user");

if (!currentUser) {
    window.location.href = "login.html";
}

const container = document.querySelector(".container");
const colorButton = document.getElementById("color-input");
const gridButton = document.getElementById("submit-grid");
const gridWidth = document.getElementById("width-range");
const gridHeight = document.getElementById("height-range");
const eraseBtn = document.getElementById("erase-btn");
const paintBtn = document.getElementById("paint-btn");
const widthValue = document.getElementById("width-value");
const heightValue = document.getElementById("height-value");
const clearBtn = document.getElementById("clear-btn");
const titleInput = document.getElementById("artwork-title");
const userDisplay = document.getElementById("user-display");
const saveDraftBtn = document.getElementById("save-draft-btn");


// Canvas setup
const canvas = document.getElementById("pixel-canvas");
const ctx = canvas.getContext("2d");


// Application state
let artworkTitle = "";
let rows = 16;
let cols = 16;
let draw = false;
let erase = false;
let currentDraftId = null;

const CELL_SIZE = 20;


// Store pixel colors
let matrix = [];


// Create the pixel grid
function createGrid(r, c, savedGrid = null) {

    rows = parseInt(r);
    cols = parseInt(c);

    canvas.width = cols * CELL_SIZE;
    canvas.height = rows * CELL_SIZE;

    if (
        savedGrid &&
        savedGrid.length === rows &&
        savedGrid[0].length === cols
    ) {

        matrix = savedGrid;

    } else {

        matrix = Array.from(
            { length: rows },
            () => Array(cols).fill("transparent")
        );
    }

    renderCanvas();
}


// Render canvas
function renderCanvas() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    for (let i = 0; i < rows; i++) {

        for (let j = 0; j < cols; j++) {

            const x = j * CELL_SIZE;
            const y = i * CELL_SIZE;

            const color = matrix[i][j];

            // Draw pixel
            if (color !== "transparent") {

                ctx.fillStyle = color;

                ctx.fillRect(
                    x,
                    y,
                    CELL_SIZE,
                    CELL_SIZE
                );
            }

            // Draw grid
            ctx.strokeStyle = "#ddd";
            ctx.lineWidth = 1;

            ctx.strokeRect(
                x,
                y,
                CELL_SIZE,
                CELL_SIZE
            );
        }
    }
}


// Convert mouse position into grid coordinates
function getCellFromCoordinates(e) {

    const rect = canvas.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const col = Math.floor(x / CELL_SIZE);
    const row = Math.floor(y / CELL_SIZE);

    return {
        row,
        col
    };
}


// Paint a pixel
function paintCell(e) {

    const { row, col } =
        getCellFromCoordinates(e);

    if (
        row >= 0 &&
        row < rows &&
        col >= 0 &&
        col < cols
    ) {

        const targetColor =
            erase
                ? "transparent"
                : colorButton.value;

        matrix[row][col] = targetColor;

        renderCanvas();
    }
}


// Mouse painting
canvas.addEventListener("mousedown", (e) => {

    draw = true;

    paintCell(e);

});


canvas.addEventListener("mousemove", (e) => {

    if (!draw) return;

    paintCell(e);

});


window.addEventListener("mouseup", () => {

    draw = false;

});


// Create grid
gridButton.addEventListener("click", () => {

    createGrid(
        gridHeight.value,
        gridWidth.value
    );

    console.log("Artwork:", artworkTitle);

});


// Width display
gridWidth.addEventListener("input", () => {

    widthValue.innerText =
        gridWidth.value < 10
            ? `0${gridWidth.value}`
            : gridWidth.value;

});


// Height display
gridHeight.addEventListener("input", () => {

    heightValue.innerText =
        gridHeight.value < 10
            ? `0${gridHeight.value}`
            : gridHeight.value;

});


// Erase mode
eraseBtn.addEventListener("click", () => {

    erase = true;

    eraseBtn.classList.add("selected");
    paintBtn.classList.remove("selected");

});


// Paint mode
paintBtn.addEventListener("click", () => {

    erase = false;

    paintBtn.classList.add("selected");
    eraseBtn.classList.remove("selected");

});


// Clear grid
clearBtn.addEventListener("click", () => {

    matrix = Array.from(
        { length: rows },
        () => Array(cols).fill("transparent")
    );

    renderCanvas();

});


// Artwork title
titleInput.addEventListener("input", () => {

    if (titleInput.value.length > 50) {

        titleInput.value =
            titleInput.value.substring(0, 50);
    }

    artworkTitle =
        titleInput.value.trim();

});


// Display logged-in user
if (currentUser) {

    userDisplay.innerText =
        `Welcome, ${currentUser}`;

}


// Save draft
saveDraftBtn.addEventListener("click", () => {

    const title =
        titleInput.value.trim() || "Untitled Draft";

    let drafts =
        JSON.parse(
            localStorage.getItem("pixel_drafts")
        ) || [];


    // Update existing draft
    if (currentDraftId) {

        const draftIndex =
            drafts.findIndex(
                draft =>
                    draft.id === currentDraftId &&
                    draft.owner === currentUser
            );


        if (draftIndex !== -1) {

            drafts[draftIndex].title = title;
            drafts[draftIndex].rows = rows;
            drafts[draftIndex].cols = cols;
            drafts[draftIndex].matrix = matrix;

            localStorage.setItem(
                "pixel_drafts",
                JSON.stringify(drafts)
            );

            alert("Draft updated!");

            return;
        }
    }


    // Create new draft
    const draftData = {

        id: Date.now().toString(),

        owner: currentUser,

        title: title,

        rows: rows,

        cols: cols,

        matrix: matrix
    };


    drafts.push(draftData);

    localStorage.setItem(
        "pixel_drafts",
        JSON.stringify(drafts)
    );

    currentDraftId =
        draftData.id;

    alert("Draft saved!");

});
// Load initial grid or saved draft
window.addEventListener("load", () => {

    const urlParams =
        new URLSearchParams(
            window.location.search
        );

    const draftId =
        urlParams.get("draftId");


    // No draft selected
    if (!draftId) {

        createGrid(16, 16);

        return;
    }


    // Get saved drafts
    const drafts =
        JSON.parse(
            localStorage.getItem("pixel_drafts")
        ) || [];


    // Find current user's draft
    const draft =
        drafts.find(
            d =>
                d.id === draftId &&
                d.owner === currentUser
        );


    // Draft not found
    if (!draft) {

        createGrid(16, 16);

        return;
    }


    // Restore draft
    currentDraftId =
        draft.id;

    titleInput.value =
        draft.title;

    artworkTitle =
        draft.title;


    gridWidth.value =
        draft.cols;

    gridHeight.value =
        draft.rows;


    widthValue.innerText =
        draft.cols < 10
            ? `0${draft.cols}`
            : draft.cols;

    heightValue.innerText =
        draft.rows < 10
            ? `0${draft.rows}`
            : draft.rows;


    createGrid(
        draft.rows,
        draft.cols,
        draft.matrix
    );

});


paintBtn.classList.add("selected");