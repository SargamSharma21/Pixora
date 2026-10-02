const currentUser =
    localStorage.getItem("logged_in_user");


if (!currentUser) {

    window.location.href =
        "login.html";

}


const container =
    document.getElementById(
        "artwork-container"
    );


const params =
    new URLSearchParams(
        window.location.search
    );


const artworkId =
    params.get("id");


const artworks =
    JSON.parse(
        localStorage.getItem(
            "pixel_artworks"
        )
    ) || [];


const artwork =
    artworks.find(
        item =>
            item.id === artworkId
    );


if (!artwork) {

    container.innerHTML = `
        <h2>Artwork not found.</h2>
    `;

} else {

    renderArtworkPage(
        artwork
    );

}


function renderArtworkPage(artwork) {

    if (!Array.isArray(artwork.likes)) {
        artwork.likes = [];
    }


    if (!Array.isArray(artwork.comments)) {
        artwork.comments = [];
    }


    const liked =
        artwork.likes.includes(
            currentUser
        );


    container.innerHTML = `

        <h2 class="artwork-title">
            ${artwork.title}
        </h2>

        <p class="artwork-author">
            Created by ${artwork.owner}
        </p>


        <div class="artwork-canvas-wrapper">

            <canvas id="artwork-canvas"></canvas>

        </div>


        <div class="artwork-actions">

            <button
                id="like-btn"
                class="like-btn ${liked ? "liked" : ""}"
            >
            <div class="artwork-actions">

    <div class="artwork-actions">

            <button
                id="like-btn"
                class="like-btn ${liked ? "liked" : ""}"
            >

            ${liked ? "❤️" : "♡"}

            <span id="like-count">
                ${artwork.likes.length}
            </span>

            </button>

        ${artwork.owner === currentUser ? `
            <button
                id="delete-artwork-btn"
                class="delete-artwork-btn"
            >
                Delete Artwork
            </button>
        ` : ""}

    </div>


        <div class="comments-section">

            <h3>
                Comments
            </h3>

            <div
                id="comments-list"
                class="comments-list"
            ></div>


            <div class="comment-form">

                <input
                    id="comment-input"
                    class="comment-input"
                    type="text"
                    maxlength="200"
                    placeholder="Write a comment..."
                >

                <button
                    id="comment-btn"
                    class="comment-btn"
                >
                    Post
                </button>

            </div>

        </div>
    `;


    renderCanvas(
        artwork
    );


    renderComments(
        artwork
    );


    setupLike(
        artwork
    );


    setupComments(
        artwork
    );

    setupDelete(
        artwork
    );

}


function renderCanvas(artwork) {

    const canvas =
        document.getElementById(
            "artwork-canvas"
        );


    const ctx =
        canvas.getContext("2d");


    const CELL_SIZE = 20;


    canvas.width =
        artwork.cols * CELL_SIZE;

    canvas.height =
        artwork.rows * CELL_SIZE;


    for (
        let row = 0;
        row < artwork.rows;
        row++
    ) {

        for (
            let col = 0;
            col < artwork.cols;
            col++
        ) {

            const color =
                artwork.matrix[row][col];


            if (
                color !== "transparent"
            ) {

                ctx.fillStyle =
                    color;

                ctx.fillRect(
                    col * CELL_SIZE,
                    row * CELL_SIZE,
                    CELL_SIZE,
                    CELL_SIZE
                );

            }


            ctx.strokeStyle =
                "#ddd";

            ctx.strokeRect(
                col * CELL_SIZE,
                row * CELL_SIZE,
                CELL_SIZE,
                CELL_SIZE
            );

        }

    }

}


function setupLike(artwork) {

    const button =
        document.getElementById(
            "like-btn"
        );


    button.addEventListener(
        "click",
        () => {

            const index =
                artwork.likes.indexOf(
                    currentUser
                );


            if (index === -1) {

                artwork.likes.push(
                    currentUser
                );

            } else {

                artwork.likes.splice(
                    index,
                    1
                );

            }


            saveArtworks();


            const liked =
                artwork.likes.includes(
                    currentUser
                );


            button.classList.toggle(
                "liked",
                liked
            );


            button.innerHTML = `
                ${liked ? "❤️" : "♡"}

                <span id="like-count">
                    ${artwork.likes.length}
                </span>
            `;

        }
    );

}


function renderComments(artwork) {

    const list =
        document.getElementById(
            "comments-list"
        );


    list.innerHTML = "";


    if (artwork.comments.length === 0) {

        list.innerHTML = `
            <p>
                No comments yet.
            </p>
        `;

        return;
    }


    artwork.comments.forEach(
        comment => {

            const element =
                document.createElement(
                    "div"
                );


            element.classList.add(
                "comment"
            );


            element.innerHTML = `

                <strong>
                    ${comment.author}
                </strong>

                ${comment.text}

            `;


            list.appendChild(
                element
            );

        }
    );

}


function setupComments(artwork) {

    const button =
        document.getElementById(
            "comment-btn"
        );


    const input =
        document.getElementById(
            "comment-input"
        );


    button.addEventListener(
        "click",
        () => {

            addComment(
                artwork,
                input
            );

        }
    );


    input.addEventListener(
        "keydown",
        event => {

            if (event.key === "Enter") {

                addComment(
                    artwork,
                    input
                );

            }

        }
    );

}


function addComment(
    artwork,
    input
) {

    const text =
        input.value.trim();


    if (!text) {
        return;
    }


    artwork.comments.push({

        id:
            Date.now().toString(),

        author:
            currentUser,

        text:
            text,

        createdAt:
            new Date().toISOString()

    });


    saveArtworks();


    input.value = "";


    renderComments(
        artwork
    );

}


function saveArtworks() {

    localStorage.setItem(
        "pixel_artworks",
        JSON.stringify(
            artworks
        )
    );

}

function setupDelete(artwork) {

    const deleteButton =
        document.getElementById(
            "delete-artwork-btn"
        );


    if (!deleteButton) {
        return;
    }


    deleteButton.addEventListener(
        "click",
        () => {

            const confirmed =
                confirm(
                    "Are you sure you want to delete this artwork?"
                );


            if (!confirmed) {
                return;
            }


            const artworkIndex =
                artworks.findIndex(
                    item =>
                        item.id === artwork.id &&
                        item.owner === currentUser
                );


            if (artworkIndex === -1) {

                alert(
                    "You cannot delete this artwork."
                );

                return;
            }


            artworks.splice(
                artworkIndex,
                1
            );


            saveArtworks();


            alert(
                "Artwork deleted successfully."
            );


            window.location.href =
                "feed.html";

        }
    );

}