const currentUser =
    localStorage.getItem("logged_in_user");


if (!currentUser) {

    window.location.href =
        "login.html";

}


const feedContainer =
    document.getElementById(
        "feed-container"
    );


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

    const card =
        document.createElement("div");

    card.classList.add(
        "artwork-card"
    );


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

    `;


    feedContainer.appendChild(card);


    const canvas =
        card.querySelector("canvas");

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