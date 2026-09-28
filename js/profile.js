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


usernameElement.innerText =
    currentUser;