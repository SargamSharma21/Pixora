/* =====================================================
   SESSION
===================================================== */

const currentUser =
    localStorage.getItem("logged_in_user");


if (!currentUser) {

    window.location.href = "login.html";

}


/* =====================================================
   UI ELEMENTS
===================================================== */

const container =
    document.querySelector(".container");

const canvas =
    document.getElementById("pixel-canvas");

const ctx =
    canvas.getContext("2d");


const colorButton =
    document.getElementById("color-input");

const gridButton =
    document.getElementById("submit-grid");

const clearGridButton =
    document.getElementById("clear-grid");

const gridWidth =
    document.getElementById("width-range");

const gridHeight =
    document.getElementById("height-range");

const widthValue =
    document.getElementById("width-value");

const heightValue =
    document.getElementById("height-value");

const eraseBtn =
    document.getElementById("erase-btn");

const paintBtn =
    document.getElementById("paint-btn");

const titleInput =
    document.getElementById("artwork-title");

const userDisplay =
    document.getElementById("user-display");

const saveDraftBtn =
    document.getElementById("save-draft-btn");

const postArtBtn =
    document.getElementById("post-art-btn");

const downloadBtn =
    document.getElementById("download-png-btn");

const shareBtn =
    document.getElementById("share-art-btn");

const fetchPaletteBtn =
    document.getElementById("fetch-palette-btn");

const paletteContainer =
    document.getElementById("palette-container");

const paletteStatus =
    document.getElementById("palette-status");

const logoutBtn =
    document.getElementById("logout-btn");

const pixelSizeRange =
    document.getElementById("pixel-size-range");

const pixelSizeValue =
    document.getElementById("pixel-size-value");

/* =====================================================
   APPLICATION STATE
===================================================== */

let rows = 16;

let cols = 16;

let draw = false;

let erase = false;

let currentDraftId = null;

let CELL_SIZE = 20;

const LABEL_SIZE = 30;

let matrix = [];


/* =====================================================
   USER DISPLAY
===================================================== */

if (userDisplay && currentUser) {

    userDisplay.innerText =
        `Welcome, ${currentUser}`;

}


/* =====================================================
   LOGOUT
===================================================== */

logoutBtn.addEventListener("click", () => {

    localStorage.removeItem(
        "logged_in_user"
    );

    window.location.href =
        "login.html";

});


/* =====================================================
   CREATE GRID
===================================================== */

function updateCanvasSize() {
    canvas.width =
        cols * CELL_SIZE + LABEL_SIZE;

    canvas.height =
        rows * CELL_SIZE + LABEL_SIZE;
}
function createGrid(r, c, savedGrid = null) {

    rows = parseInt(r);
    cols = parseInt(c);
    updateCanvasSize();

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


/* =====================================================
   RENDER CANVAS
===================================================== */

function renderCanvas() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    /*
        White canvas background
    */

    ctx.fillStyle = "#ffffff";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    /*
        Text settings
    */

    ctx.fillStyle = "#000";

    ctx.font = "bold 11px monospace";

    ctx.textAlign = "center";

    ctx.textBaseline = "middle";


    /*
        Draw column numbers
    */

    for (let j = 0; j < cols; j++) {

        const x =
            LABEL_SIZE +
            j * CELL_SIZE +
            CELL_SIZE / 2;

        const y =
            LABEL_SIZE / 2;

        ctx.fillText(
            j + 1,
            x,
            y
        );
    }


    /*
        Draw row numbers
    */

    for (let i = 0; i < rows; i++) {

        const x =
            LABEL_SIZE / 2;

        const y =
            LABEL_SIZE +
            i * CELL_SIZE +
            CELL_SIZE / 2;

        ctx.fillText(
            i + 1,
            x,
            y
        );
    }


    /*
        Draw pixels + grid
    */

    for (let i = 0; i < rows; i++) {

        for (let j = 0; j < cols; j++) {

            const x =
                LABEL_SIZE +
                j * CELL_SIZE;

            const y =
                LABEL_SIZE +
                i * CELL_SIZE;

            const color =
                matrix[i][j];


            /*
                Draw colored pixel
            */

            if (color !== "transparent") {

                ctx.fillStyle = color;

                ctx.fillRect(
                    x,
                    y,
                    CELL_SIZE,
                    CELL_SIZE
                );
            }


            /*
                Draw grid
            */

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


    /*
        Draw border around actual pixel grid
    */

    ctx.strokeStyle = "#000";

    ctx.lineWidth = 2;

    ctx.strokeRect(
        LABEL_SIZE,
        LABEL_SIZE,
        cols * CELL_SIZE,
        rows * CELL_SIZE
    );
}

/* =====================================================
   COORDINATES
===================================================== */

function getCellFromCoordinates(e) {

    const rect =
        canvas.getBoundingClientRect();


    /*
        Convert mouse position from
        displayed canvas size to
        actual canvas coordinates.
    */

    const scaleX =
        canvas.width / rect.width;

    const scaleY =
        canvas.height / rect.height;


    const x =
        (e.clientX - rect.left) * scaleX;

    const y =
        (e.clientY - rect.top) * scaleY;


    /*
        Ignore the row/column label area
    */

    if (
        x < LABEL_SIZE ||
        y < LABEL_SIZE
    ) {

        return {
            row: -1,
            col: -1
        };
    }


    const col =
        Math.floor(
            (x - LABEL_SIZE) / CELL_SIZE
        );

    const row =
        Math.floor(
            (y - LABEL_SIZE) / CELL_SIZE
        );


    return {
        row,
        col
    };
}


/* =====================================================
   PAINT CELL
===================================================== */

function paintCell(e) {

    const {
        row,
        col
    } =
        getCellFromCoordinates(e);


    if (
        row < 0 ||
        row >= rows ||
        col < 0 ||
        col >= cols
    ) {

        return;

    }


    const targetColor =
        erase
            ? "transparent"
            : colorButton.value;


    matrix[row][col] =
        targetColor;


    renderCanvas();

}


/* =====================================================
   MOUSE DRAWING
===================================================== */

canvas.addEventListener(
    "mousedown",
    (e) => {

        draw = true;

        paintCell(e);

    }
);


canvas.addEventListener(
    "mousemove",
    (e) => {

        if (!draw) {

            return;

        }

        paintCell(e);

    }
);


window.addEventListener(
    "mouseup",
    () => {

        draw = false;

    }
);


/* =====================================================
   TOUCH DRAWING
===================================================== */

function getCellFromTouch(e) {

    const rect = canvas.getBoundingClientRect();

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const touch = e.touches[0];

    const x =
        (touch.clientX - rect.left) * scaleX;

    const y =
        (touch.clientY - rect.top) * scaleY;

    // Ignore row/column label area
    if (
        x < LABEL_SIZE ||
        y < LABEL_SIZE
    ) {
        return {
            row: -1,
            col: -1
        };
    }

    const col =
        Math.floor(
            (x - LABEL_SIZE) / CELL_SIZE
        );

    const row =
        Math.floor(
            (y - LABEL_SIZE) / CELL_SIZE
        );

    return {
        row,
        col
    };
}


function handleTouchPaint(e) {

    if (!draw) {

        return;

    }


    e.preventDefault();


    const {
        row,
        col
    } =
        getCellFromTouch(e);


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


        matrix[row][col] =
            targetColor;


        renderCanvas();

    }

}


canvas.addEventListener(
    "touchstart",
    (e) => {

        draw = true;

        handleTouchPaint(e);

    },
    {
        passive: false
    }
);


canvas.addEventListener(
    "touchmove",
    handleTouchPaint,
    {
        passive: false
    }
);


window.addEventListener(
    "touchend",
    () => {

        draw = false;

    }
);


/* =====================================================
   CREATE GRID BUTTON
===================================================== */

gridButton.addEventListener(
    "click",
    () => {

        createGrid(
            gridHeight.value,
            gridWidth.value
        );

    }
);


/* =====================================================
   CLEAR GRID
===================================================== */

clearGridButton.addEventListener(
    "click",
    () => {

        matrix = Array.from(
            { length: rows },
            () =>
                Array(cols).fill(
                    "transparent"
                )
        );

        renderCanvas();

    }
);


/* =====================================================
   PAINT / ERASE
===================================================== */

paintBtn.addEventListener(
    "click",
    () => {

        erase = false;

        paintBtn.classList.add(
            "selectedEditControl"
        );

        eraseBtn.classList.remove(
            "selectedEditControl"
        );

    }
);


eraseBtn.addEventListener(
    "click",
    () => {

        erase = true;

        eraseBtn.classList.add(
            "selectedEditControl"
        );

        paintBtn.classList.remove(
            "selectedEditControl"
        );

    }
);


/* =====================================================
   SLIDERS
===================================================== */

gridWidth.addEventListener(
    "input",
    () => {

        widthValue.innerText =
            gridWidth.value;

    }
);


gridHeight.addEventListener(
    "input",
    () => {

        heightValue.innerText =
            gridHeight.value;

    }
);

pixelSizeRange.addEventListener("input", () => {

    CELL_SIZE = parseInt(pixelSizeRange.value);

    pixelSizeValue.innerText =
        `${CELL_SIZE}px`;

    updateCanvasSize();

    renderCanvas();
});


/* =====================================================
   TITLE
===================================================== */

titleInput.addEventListener(
    "input",
    () => {

        if (
            titleInput.value.length > 50
        ) {

            titleInput.value =
                titleInput.value.substring(
                    0,
                    50
                );

        }

    }
);


/* =====================================================
   GET MATRIX
===================================================== */

function getGridMatrix() {

    return matrix;

}


/* =====================================================
   SAVE DRAFT
===================================================== */

saveDraftBtn.addEventListener(
    "click",
    () => {

        const title =
            titleInput.value.trim() ||
            "Untitled Draft";


        let drafts =
            JSON.parse(
                localStorage.getItem(
                    "pixel_drafts"
                )
            ) || [];


        const draftData = {

            id:
                currentDraftId ||
                Date.now().toString(),

            owner:
                currentUser,

            title:
                title,

            rows:
                rows,

            cols:
                cols,

            pixelSize: CELL_SIZE,

            matrix:
                getGridMatrix()

        };


        if (currentDraftId) {

            drafts =
                drafts.map(
                    draft =>
                        draft.id ===
                        currentDraftId
                            ? draftData
                            : draft
                );

        } else {

            drafts.push(
                draftData
            );

        }


        localStorage.setItem(
            "pixel_drafts",
            JSON.stringify(drafts)
        );


        currentDraftId =
            draftData.id;


        alert(
            "Draft saved!"
        );

    }
);


/* =====================================================
   PUBLISH
===================================================== */
// POST TO PUBLIC FEED

postArtBtn.addEventListener("click", () => {

    const title =
        titleInput.value.trim() ||
        "Untitled Post";

    let publishedArtworks =
        JSON.parse(
            localStorage.getItem("pixel_artworks")
        ) || [];

    const artwork = {

        id: Date.now().toString(),

        owner: currentUser,

        draftId: currentDraftId,

        title: title,

        rows: rows,

        cols: cols,

        pixelSize: CELL_SIZE,

        matrix: JSON.parse(
            JSON.stringify(matrix)
        ),

        publishedAt:
            new Date().toISOString(),

        likes: [],

        comments: []
    };


    publishedArtworks.push(artwork);


    localStorage.setItem(
        "pixel_artworks",
        JSON.stringify(publishedArtworks)
    );


    // Remove draft only after publishing
    if (currentDraftId) {

        let drafts =
            JSON.parse(
                localStorage.getItem("pixel_drafts")
            ) || [];

        drafts =
            drafts.filter(
                draft =>
                    !(
                        draft.id === currentDraftId &&
                        draft.owner === currentUser
                    )
            );

        localStorage.setItem(
            "pixel_drafts",
            JSON.stringify(drafts)
        );
    }


    // Go to feed
    window.location.href =
        "feed.html";
});

/* =====================================================
   DOWNLOAD PNG
   Canvas API + Blob API
===================================================== */

downloadBtn.addEventListener(
    "click",
    () => {

        const title =
            titleInput.value.trim() ||
            "pixel-artwork";


        const EXPORT_CELL_SIZE =
            32;


        const exportCanvas =
            document.createElement(
                "canvas"
            );


        const exportCtx =
            exportCanvas.getContext(
                "2d"
            );


        exportCanvas.width =
            cols *
            EXPORT_CELL_SIZE;


        exportCanvas.height =
            rows *
            EXPORT_CELL_SIZE;


        for (
            let i = 0;
            i < rows;
            i++
        ) {

            for (
                let j = 0;
                j < cols;
                j++
            ) {

                const color =
                    matrix[i][j];


                if (
                    color &&
                    color !== "transparent"
                ) {

                    exportCtx.fillStyle =
                        color;


                    exportCtx.fillRect(
                        j *
                            EXPORT_CELL_SIZE,

                        i *
                            EXPORT_CELL_SIZE,

                        EXPORT_CELL_SIZE,

                        EXPORT_CELL_SIZE
                    );

                }

            }

        }


        exportCanvas.toBlob(
            (blob) => {

                if (!blob) {

                    alert(
                        "Error generating image file."
                    );

                    return;

                }


                const blobUrl =
                    URL.createObjectURL(
                        blob
                    );


                const downloadLink =
                    document.createElement(
                        "a"
                    );


                downloadLink.href =
                    blobUrl;


                downloadLink.download =
                    `${title
                        .toLowerCase()
                        .replace(
                            /\s+/g,
                            "_"
                        )}.png`;


                document.body.appendChild(
                    downloadLink
                );


                downloadLink.click();


                document.body.removeChild(
                    downloadLink
                );


                URL.revokeObjectURL(
                    blobUrl
                );

            },
            "image/png"
        );

    }
);


/* =====================================================
   RANDOM PALETTE
   Fetch API
===================================================== */

function rgbToHex(
    r,
    g,
    b
) {

    return (
        "#" +
        [r, g, b]
            .map(
                value => {

                    const hex =
                        value.toString(
                            16
                        );

                    return hex.length === 1
                        ? "0" + hex
                        : hex;

                }
            )
            .join("")
    );

}


async function fetchRandomPalette() {

    paletteStatus.innerText =
        "Fetching...";


    fetchPaletteBtn.disabled =
        true;


    try {

        const response =
            await fetch(
                "http://colormind.io/api/",
                {
                    method: "POST",

                    body: JSON.stringify({
                        model: "default"
                    })
                }
            );


        if (!response.ok) {

            throw new Error(
                `HTTP Error! Status: ${response.status}`
            );

        }


        const data =
            await response.json();


        const rgbColors =
            data.result;


        paletteContainer.innerHTML =
            "";


        rgbColors.forEach(
            rgb => {

                const hexColor =
                    rgbToHex(
                        rgb[0],
                        rgb[1],
                        rgb[2]
                    );


                const swatch =
                    document.createElement(
                        "button"
                    );


                swatch.style.backgroundColor =
                    hexColor;


                swatch.title =
                    `Select ${hexColor}`;


                swatch.addEventListener(
                    "click",
                    () => {

                        colorButton.value =
                            hexColor;


                        erase = false;


                        eraseBtn.classList.remove(
                            "selectedEditControl"
                        );


                        paintBtn.classList.add(
                            "selectedEditControl"
                        );

                    }
                );


                paletteContainer.appendChild(
                    swatch
                );

            }
        );


        paletteStatus.innerText =
            "Palette loaded!";

    } catch (error) {

        console.error(
            "Fetch API Error:",
            error
        );


        paletteStatus.innerText =
            "Failed to load palette.";

    } finally {

        fetchPaletteBtn.disabled =
            false;

    }

}


fetchPaletteBtn.addEventListener(
    "click",
    fetchRandomPalette
);


/* =====================================================
   WEB SHARE API
===================================================== */

shareBtn.addEventListener(
    "click",
    () => {

        if (!navigator.share) {

            alert(
                "Web Share API is not supported on this browser/device."
            );

            return;

        }


        const title =
            titleInput.value.trim() ||
            "My Pixel Art";


        const EXPORT_CELL_SIZE =
            32;


        const exportCanvas =
            document.createElement(
                "canvas"
            );


        const exportCtx =
            exportCanvas.getContext(
                "2d"
            );


        exportCanvas.width =
            cols *
            EXPORT_CELL_SIZE;


        exportCanvas.height =
            rows *
            EXPORT_CELL_SIZE;


        for (
            let i = 0;
            i < rows;
            i++
        ) {

            for (
                let j = 0;
                j < cols;
                j++
            ) {

                const color =
                    matrix[i][j];


                if (
                    color &&
                    color !== "transparent"
                ) {

                    exportCtx.fillStyle =
                        color;


                    exportCtx.fillRect(
                        j *
                            EXPORT_CELL_SIZE,

                        i *
                            EXPORT_CELL_SIZE,

                        EXPORT_CELL_SIZE,

                        EXPORT_CELL_SIZE
                    );

                }

            }

        }


        exportCanvas.toBlob(
            async (blob) => {

                if (!blob) {

                    alert(
                        "Failed to process image for sharing."
                    );

                    return;

                }


                const fileName =
                    `${title
                        .toLowerCase()
                        .replace(
                            /\s+/g,
                            "_"
                        )}.png`;


                const file =
                    new File(
                        [blob],
                        fileName,
                        {
                            type:
                                "image/png"
                        }
                    );


                try {

                    if (
                        navigator.canShare &&
                        navigator.canShare({
                            files: [file]
                        })
                    ) {

                        await navigator.share({

                            title:
                                title,

                            text:
                                `Check out my pixel art creation: "${title}"!`,

                            files:
                                [file]

                        });

                    } else {

                        await navigator.share({

                            title:
                                title,

                            text:
                                `Check out my pixel art creation: "${title}"!`

                        });

                    }

                } catch (error) {

                    if (
                        error.name !==
                        "AbortError"
                    ) {

                        console.error(
                            "Share failed:",
                            error
                        );

                    }

                }

            },
            "image/png"
        );

    }
);


/* =====================================================
   LOAD DRAFT
===================================================== */

function loadDraftFromURL() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    const draftId =
        params.get("draftId");


    if (!draftId) {

        return false;

    }


    const drafts =
        JSON.parse(
            localStorage.getItem(
                "pixel_drafts"
            )
        ) || [];


    const draft =
        drafts.find(
            item =>
                item.id === draftId &&
                item.owner === currentUser
        );


    if (!draft) {

        return false;

    }


    currentDraftId =
        draft.id;


    titleInput.value =
        draft.title;


    gridWidth.value =
        draft.cols;


    gridHeight.value =
        draft.rows;


    widthValue.innerText =
        draft.cols;


    heightValue.innerText =
        draft.rows;


    CELL_SIZE =
    draft.pixelSize || 20;

    pixelSizeRange.value =
        CELL_SIZE;

    pixelSizeValue.innerText =
        `${CELL_SIZE}px`;


    createGrid(
        draft.rows,
        draft.cols,
        draft.matrix
    );


    return true;

}


/* =====================================================
   INITIALIZE
===================================================== */

window.addEventListener(
    "load",
    () => {

        if (
            !loadDraftFromURL()
        ) {

            gridWidth.value =
                16;

            gridHeight.value =
                16;

            widthValue.innerText =
                "16";

            heightValue.innerText =
                "16";


            pixelSizeRange.value = CELL_SIZE;

            pixelSizeValue.innerText =
                `${CELL_SIZE}px`;
            
            createGrid(
                16,
                16
            );

        }


        paintBtn.classList.add(
            "selectedEditControl"
        );

    }
);