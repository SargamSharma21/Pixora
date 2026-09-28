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
}

