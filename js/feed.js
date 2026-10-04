const currentUser =
    localStorage.getItem("logged_in_user");


if (!currentUser) {
    window.location.href = "login.html";
}


const feedContainer =
    document.getElementById("feed-container");


let artworks =
    JSON.parse(
        localStorage.getItem("pixel_artworks")
    ) || [];

const legacyPosts =
    JSON.parse(
        localStorage.getItem("pixel_posts")
    ) || [];

if (legacyPosts.length > 0) {
    const artworkIds = new Set(
        artworks.map(artwork => artwork.id)
    );

    legacyPosts.forEach(post => {
        if (!artworkIds.has(post.id)) {
            artworks.push({
                ...post,
                owner: post.owner || post.creator,
                likes: Array.isArray(post.likes) ? post.likes : [],
                comments: Array.isArray(post.comments) ? post.comments : [],
                publishedAt: post.publishedAt || post.createdAt
            });
        }
    });

    localStorage.setItem(
        "pixel_artworks",
        JSON.stringify(artworks)
    );
    localStorage.removeItem("pixel_posts");
}


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

    // Support artworks created before comments were added
    if (!Array.isArray(artwork.likes)) {
        artwork.likes = [];
    }

    if (!Array.isArray(artwork.comments)) {
        artwork.comments = [];
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

        <div
            class="artwork-preview artwork-clickable"
            data-id="${artwork.id}"
        >

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


        <div class="comments-section">

            <h4>
                Comments
            </h4>

            <div class="comments-list"></div>


            <div class="comment-form">

                <input
                    type="text"
                    class="comment-input"
                    placeholder="Write a comment..."
                    maxlength="200"
                >

                <button class="comment-btn">
                    Post
                </button>

            </div>

        </div>
    `;


    feedContainer.appendChild(card);

    const artworkPreview =
        card.querySelector(
            ".artwork-clickable"
        );


        artworkPreview.addEventListener(
            "click",
            () => {

                window.location.href =
                    `artwork.html?id=${artwork.id}`;

            }
        );

    // Render artwork
    renderArtworkCanvas(
        card.querySelector("canvas"),
        artwork,
        15
    );


    // Like functionality
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


    // Render existing comments
    renderComments(
        artwork,
        card
    );


    // Comment functionality
    const commentButton =
        card.querySelector(".comment-btn");


    const commentInput =
        card.querySelector(".comment-input");


    commentButton.addEventListener(
        "click",
        () => {

            addComment(
                artwork,
                commentInput,
                card
            );

        }
    );


    // Allow Enter to submit
    commentInput.addEventListener(
        "keydown",
        event => {

            if (event.key === "Enter") {

                addComment(
                    artwork,
                    commentInput,
                    card
                );

            }

        }
    );

}


function toggleLike(artwork, likeButton) {

    const userIndex =
        artwork.likes.indexOf(
            currentUser
        );


    if (userIndex === -1) {

        artwork.likes.push(
            currentUser
        );

    } else {

        artwork.likes.splice(
            userIndex,
            1
        );

    }


    saveArtworks();


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


function renderComments(artwork, card) {

    const commentsList =
        card.querySelector(
            ".comments-list"
        );


    commentsList.innerHTML = "";


    if (artwork.comments.length === 0) {

        commentsList.innerHTML = `
            <p class="no-comments">
                No comments yet.
            </p>
        `;

        return;
    }


    artwork.comments.forEach(
        comment => {

            const commentElement =
                document.createElement("div");


            commentElement.classList.add(
                "comment"
            );


            commentElement.innerHTML = `

                <strong>
                    ${comment.author}
                </strong>

                <span>
                    ${comment.text}
                </span>

            `;


            commentsList.appendChild(
                commentElement
            );

        }
    );

}


function addComment(
    artwork,
    commentInput,
    card
) {

    const text =
        commentInput.value.trim();


    if (!text) {

        return;

    }


    const comment = {

        id:
            Date.now().toString(),

        author:
            currentUser,

        text:
            text,

        createdAt:
            new Date().toISOString()

    };


    artwork.comments.push(
        comment
    );


    saveArtworks();


    commentInput.value = "";


    renderComments(
        artwork,
        card
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