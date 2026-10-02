const currentUser =
    localStorage.getItem("logged_in_user");


if (!currentUser) {

    window.location.href =
        "login.html";

}


const usernameElement =
    document.getElementById(
        "profile-username"
    );

const bioElement =
    document.getElementById(
        "profile-bio"
    );

const editProfileBtn =
    document.getElementById(
        "edit-profile-btn"
    );

const saveProfileBtn =
    document.getElementById(
        "save-profile-btn"
    );

const profileForm =
    document.getElementById(
        "profile-form"
    );

const usernameInput =
    document.getElementById(
        "username-input"
    );

const bioInput =
    document.getElementById(
        "bio-input"
    );

const artworkGrid =
    document.getElementById(
        "profile-artwork-grid"
    );


// -------------------------
// PROFILE DATA
// -------------------------

let profiles =
    JSON.parse(
        localStorage.getItem("pixel_profiles")
    ) || {};


if (!profiles[currentUser]) {

    profiles[currentUser] = {

        username: currentUser,

        bio: "Pixel artist"

    };


    localStorage.setItem(
        "pixel_profiles",
        JSON.stringify(profiles)
    );

}


let currentProfile =
    profiles[currentUser];


usernameElement.innerText =
    currentProfile.username;

bioElement.innerText =
    currentProfile.bio;


// -------------------------
// EDIT PROFILE
// -------------------------

editProfileBtn.addEventListener(
    "click",
    () => {

        usernameInput.value =
            currentProfile.username;

        bioInput.value =
            currentProfile.bio;

        profileForm.classList.remove(
            "hidden"
        );

    }
);


// -------------------------
// SAVE PROFILE
// -------------------------

saveProfileBtn.addEventListener(
    "click",
    () => {

        const username =
            usernameInput.value.trim();

        const bio =
            bioInput.value.trim();


        if (!username) {

            alert(
                "Username cannot be empty."
            );

            return;

        }


        currentProfile.username =
            username;

        currentProfile.bio =
            bio || "Pixel artist";


        profiles[currentUser] =
            currentProfile;


        localStorage.setItem(
            "pixel_profiles",
            JSON.stringify(profiles)
        );


        usernameElement.innerText =
            currentProfile.username;

        bioElement.innerText =
            currentProfile.bio;


        profileForm.classList.add(
            "hidden"
        );


        alert(
            "Profile updated!"
        );

    }
);


// -------------------------
// LOAD PUBLISHED ARTWORK
// -------------------------

const artworks =
    JSON.parse(
        localStorage.getItem("pixel_artworks")
    ) || [];


const userArtworks =
    artworks.filter(
        artwork =>
            artwork.owner === currentUser
    );


if (userArtworks.length === 0) {

    artworkGrid.innerHTML = `
        <p class="no-artwork">
            You haven't published any artwork yet.
        </p>
    `;

} else {

    userArtworks
        .slice()
        .reverse()
        .forEach(
            artwork => {

                createArtworkPreview(
                    artwork
                );

            }
        );

}


// -------------------------
// CREATE ARTWORK PREVIEW
// -------------------------

function createArtworkPreview(
    artwork
) {

    const card =
        document.createElement(
            "div"
        );


    card.classList.add(
        "profile-artwork-card"
    );


    card.innerHTML = `

        <canvas></canvas>

        <h4>
            ${artwork.title}
        </h4>

        <p>
            ❤️ ${artwork.likes?.length || 0}
        </p>

    `;


    artworkGrid.appendChild(
        card
    );


    const canvas =
        card.querySelector(
            "canvas"
        );


    renderArtwork(
        canvas,
        artwork
    );

}


// -------------------------
// RENDER ARTWORK
// -------------------------

function renderArtwork(
    canvas,
    artwork
) {

    const ctx =
        canvas.getContext("2d");


    const CELL_SIZE = 12;


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