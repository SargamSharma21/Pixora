const currentUser =
    localStorage.getItem("logged_in_user");


if (!currentUser) {
    window.location.href = "login.html";
}


const feedContainer =
    document.getElementById("feed-container");


const artworks =
    JSON.parse(
        localStorage.getItem("pixel_artworks")
    ) || [];


if (artworks.length === 0) {

    feedContainer.innerHTML = `
        <div class="empty-feed">
            <p>No artwork has been published yet.</p>
        </div>
    `;

} else {

    artworks
        .slice()
        .reverse()
        .forEach(artwork => {

            createArtworkCard(artwork);

        });

}


function createArtworkCard(artwork) {

    // Make sure older artworks have a likes array
    if (!Array.isArray(artwork.likes)) {
        artwork.likes = [];
    }


    const card =
        document.createElement("div");

    card.classList.add("artwork-card");


    const likedByCurrentUser =
        artwork.likes.includes(currentUser);


    card.innerHTML = `

        <h3>
            ${artwork.title}
        </h3>

        <p class="author">
            Created by ${artwork.owner}
        </p>

        <div class="artwork-preview">

            <canvas></canvas>

        </div>

        <div class="artwork-actions">

            <button
                class="like-btn ${likedByCurrentUser ? "liked" : ""}"
                data-id="${artwork.id}"
            >
                ${likedByCurrentUser ? "❤️" : "♡"}
                <span class="like-count">
                    ${artwork.likes.length}
                </span>
            </button>

        </div>
    `;


    feedContainer.appendChild(card);


    // Render artwork
    renderArtwork(
        card.querySelector("canvas"),
        artwork
    );


    // Like button
    const likeButton =
        card.querySelector(".like-btn");


    likeButton.addEventListener(
        "click",
        () => {

            toggleLike(
                artwork,
                likeButton
            );

        }
    );

}


function renderArtwork(canvas, artwork) {

    const ctx =
        canvas.getContext("2d");


    const CELL_SIZE = 15;


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


            if (color !== "transparent") {

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

            ctx.lineWidth = 1;

            ctx.strokeRect(
                col * CELL_SIZE,
                row * CELL_SIZE,
                CELL_SIZE,
                CELL_SIZE
            );

        }
    }
}


function toggleLike(artwork, likeButton) {

    const userIndex =
        artwork.likes.indexOf(
            currentUser
        );


    if (userIndex === -1) {

        // Like
        artwork.likes.push(
            currentUser
        );

    } else {

        // Unlike
        artwork.likes.splice(
            userIndex,
            1
        );

    }


    // Save updated artworks
    localStorage.setItem(
        "pixel_artworks",
        JSON.stringify(artworks)
    );


    // Update button
    const isLiked =
        artwork.likes.includes(
            currentUser
        );


    likeButton.classList.toggle(
        "liked",
        isLiked
    );


    likeButton.innerHTML = `
        ${isLiked ? "❤️" : "♡"}

        <span class="like-count">
            ${artwork.likes.length}
        </span>
    `;
}