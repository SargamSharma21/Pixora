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


// Get stored profiles
let profiles =
    JSON.parse(
        localStorage.getItem("pixel_profiles")
    ) || {};


// Create profile if it doesn't exist
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


// Display profile
usernameElement.innerText =
    currentProfile.username;

bioElement.innerText =
    currentProfile.bio;


// Open edit form
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


// Save profile
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


        alert("Profile updated!");

    }
);