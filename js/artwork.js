const currentUser =
    localStorage.getItem("logged_in_user");

if (!currentUser) {
    window.location.href = "login.html";
}


/* =========================================
   CONTAINER
========================================= */

const container =
    document.getElementById("artwork-container");


/* =========================================
   GET ARTWORK ID
========================================= */

const params =
    new URLSearchParams(
        window.location.search
    );

const artworkId =
    params.get("id");


/* =========================================
   GET POSTS
========================================= */

let artworks =
    JSON.parse(
        localStorage.getItem("pixel_artworks")
    ) || [];


/* =========================================
   FIND POST
========================================= */

const artwork =
    artworks.find(
        item =>
            String(item.id) ===
            String(artworkId)
    );


/* =========================================
   ARTWORK NOT FOUND
========================================= */

if (!artwork) {

    container.innerHTML = `

        <div class="artwork-error">

            <h2>
                Artwork not found
            </h2>

            <p>
                This artwork may have been
                deleted or is no longer available.
            </p>

            <a href="feed.html">
                ← Back to Feed
            </a>

        </div>

    `;

} else {

    renderArtworkPage(artwork);

}


/* =========================================
   RENDER ARTWORK PAGE
========================================= */

function renderArtworkPage(artwork) {

    /*
       Older posts may not have these
       properties, so create them.
    */

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

        <div class="artwork-header">

            <div>

                <p class="artwork-label">
                    PIXEL ARTWORK
                </p>

                <h2 class="artwork-title">
                    ${escapeHTML(
                        artwork.title
                    )}
                </h2>

                <p class="artwork-author">
                    Created by
                    <strong>
                        ${escapeHTML(
                            artwork.owner || artwork.creator
                        )}
                    </strong>
                </p>

            </div>

        </div>


        <div class="artwork-canvas-wrapper">

            <canvas
                id="artwork-canvas"
            ></canvas>

        </div>


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


            <button
                id="download-btn"
                class="action-btn"
            >
                ↓ PNG
            </button>


            <button
                id="share-btn"
                class="action-btn"
            >
                ↗ Share
            </button>


            ${
                (artwork.owner || artwork.creator) === currentUser
                ?
                `
                    <button
                        id="delete-artwork-btn"
                        class="delete-artwork-btn"
                    >
                        Delete
                    </button>
                `
                :
                ""
            }

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


        <div class="back-container">

            <a href="feed.html">
                ← Back to Feed
            </a>

        </div>

    `;


    renderArtworkCanvas(
        document.getElementById("artwork-canvas"),
        artwork,
        artwork.pixelSize || 20
    );

    renderComments(artwork);

    setupLike(artwork);

    setupComments(artwork);

    setupDelete(artwork);

    setupDownload(artwork);

    setupShare();

}


/* =========================================
   LIKE
========================================= */

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


/* =========================================
   COMMENTS
========================================= */

function renderComments(artwork) {

    const list =
        document.getElementById(
            "comments-list"
        );


    list.innerHTML = "";


    if (
        artwork.comments.length === 0
    ) {

        list.innerHTML = `
            <p class="no-comments">
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
                    ${escapeHTML(
                        comment.author
                    )}
                </strong>

                <span>
                    ${escapeHTML(
                        comment.text
                    )}
                </span>

            `;


            list.appendChild(
                element
            );

        }
    );

}


/* =========================================
   COMMENT BUTTON
========================================= */

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

            if (
                event.key === "Enter"
            ) {

                addComment(
                    artwork,
                    input
                );

            }

        }
    );

}


/* =========================================
   ADD COMMENT
========================================= */

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


/* =========================================
   DELETE
========================================= */

function setupDelete(artwork) {

    const button =
        document.getElementById(
            "delete-artwork-btn"
        );


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        () => {

            const confirmed =
                confirm(
                    "Are you sure you want to delete this artwork?"
                );


            if (!confirmed) {
                return;
            }


            artworks =
                artworks.filter(
                    item =>
                        String(item.id) !==
                        String(artwork.id)
                );


            localStorage.setItem(
                "pixel_artworks",
                JSON.stringify(artworks)
            );


            window.location.href =
                "feed.html";

        }
    );

}


/* =========================================
   DOWNLOAD
========================================= */

function setupDownload(artwork) {

    const button =
        document.getElementById(
            "download-btn"
        );


    button.addEventListener(
        "click",
        () => {

            const canvas =
                document.getElementById(
                    "artwork-canvas"
                );


            const link =
                document.createElement(
                    "a"
                );


            link.download =
                `${artwork.title
                    .replace(
                        /[^a-z0-9]/gi,
                        "_"
                    )
                    .toLowerCase()
                }.png`;


            link.href =
                canvas.toDataURL(
                    "image/png"
                );


            link.click();

        }
    );

}


/* =========================================
   SHARE
========================================= */

function setupShare() {

    const button =
        document.getElementById(
            "share-btn"
        );


    button.addEventListener(
        "click",
        async () => {

            const shareData = {

                title:
                    document.title,

                text:
                    "Check out this pixel artwork on PIXELFORGE!",

                url:
                    window.location.href

            };


            if (
                navigator.share
            ) {

                try {

                    await navigator.share(
                        shareData
                    );

                } catch (error) {

                    console.log(
                        "Share cancelled"
                    );

                }

            } else {

                await navigator.clipboard.writeText(
                    window.location.href
                );


                alert(
                    "Artwork link copied!"
                );

            }

        }
    );

}


/* =========================================
   SAVE POSTS
========================================= */

function saveArtworks() {

    localStorage.setItem(
        "pixel_artworks",
        JSON.stringify(artworks)
    );

}


/* =========================================
   ESCAPE HTML
========================================= */

function escapeHTML(value) {

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}