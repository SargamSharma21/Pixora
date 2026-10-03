const currentUser =
    localStorage.getItem("logged_in_user");

if (!currentUser) {
    window.location.href = "login.html";
}


const draftContainer =
    document.getElementById("draft-container");


const drafts =
    JSON.parse(localStorage.getItem("pixel_drafts")) || [];


const userDrafts =
    drafts.filter(draft => draft.owner === currentUser);


if (userDrafts.length === 0) {

    draftContainer.innerHTML =
        "<p>You don't have any drafts yet.</p>";

} else {

    userDrafts.forEach(draft => {

        const card =
            document.createElement("div");

        card.classList.add("draft-card");
        card.innerHTML = `
            <h3>${draft.title}</h3>

            <p>Size: ${draft.rows} × ${draft.cols}</p>

            <button class="open-draft-btn"
                    data-id="${draft.id}">
                Open Draft
            </button>

            <button class="publish-draft-btn"
                    data-id="${draft.id}">
                Publish
            </button>

            <button class="delete-draft-btn"
                    data-id="${draft.id}">
                Delete
            </button>
        `;

        draftContainer.appendChild(card);
    });

    document.querySelectorAll(".open-draft-btn").forEach(button => {

        button.addEventListener("click", () => {

            const draftId = button.dataset.id;

            window.location.href =
                `index.html?draftId=${draftId}`;
        });

    });

    document.querySelectorAll(".delete-draft-btn").forEach(button => {

        button.addEventListener("click", () => {

            const draftId =
                button.dataset.id;

            const confirmDelete =
                confirm("Are you sure you want to delete this draft?");

            if (!confirmDelete) {
                return;
            }

            let drafts =
                JSON.parse(
                    localStorage.getItem("pixel_drafts")
                ) || [];

            drafts =
                drafts.filter(
                    draft =>
                        !(
                            draft.id === draftId &&
                            draft.owner === currentUser
                        )
                );

            localStorage.setItem(
                "pixel_drafts",
                JSON.stringify(drafts)
            );

            window.location.reload();


        });

        });

        document.querySelectorAll(".publish-draft-btn").forEach(button => {

            button.addEventListener("click", () => {

                const draftId =
                    button.dataset.id;

                let drafts =
                    JSON.parse(
                        localStorage.getItem("pixel_drafts")
                    ) || [];


                const draft =
                    drafts.find(
                        item =>
                            item.id === draftId &&
                            item.owner === currentUser
                    );


                if (!draft) {

                    alert("Draft not found.");

                    return;
                }


                let publishedArtworks =
                    JSON.parse(
                        localStorage.getItem("pixel_artworks")
                    ) || [];


                const alreadyPublished =
                    publishedArtworks.some(
                        artwork =>
                            artwork.draftId === draft.id
                    );


                if (alreadyPublished) {

                    alert("This artwork is already published.");

                    return;
                }


                const artwork = {

                    id: Date.now().toString(),

                    draftId: draft.id,

                    owner: currentUser,

                    title: draft.title,

                    rows: draft.rows,

                    cols: draft.cols,

                    pixelSize: draft.pixelSize,

                    matrix: draft.matrix,

                    likes: [],

                    comments: [],

                    publishedAt:
                        new Date().toISOString()
                };


                publishedArtworks.push(artwork);


                localStorage.setItem(
                    "pixel_artworks",
                    JSON.stringify(
                        publishedArtworks
                    )
                );


                drafts = drafts.filter(
                    item =>
                        !(item.id === draft.id && item.owner === currentUser)
                );

                localStorage.setItem(
                    "pixel_drafts",
                    JSON.stringify(drafts)
                );


                alert("Artwork published!");

            });

        });
}

