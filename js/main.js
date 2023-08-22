

let loadingScreen = $('.loading');
/* Getting Elements from Doc */
let main = $('.games');
let games = [];
let currentGame;
let detailsBody = $('.details-body');
let detailsPanel = $('.details-panel');
let home = $('.home');
let closeDetails = $('#close');
let clickedGame;
/* Get The API for a category*/
async function getCategoryApi(category = `mmorpg`) {
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '74bc1b5c73msha638f3546b847d3p1f73cfjsn4df37836f5da',
            'X-RapidAPI-Host': 'free-to-play-games-database.p.rapidapi.com'
        }
    };
    const url = `https://free-to-play-games-database.p.rapidapi.com/api/games?category=${category}`;
    let api = await fetch(url, options);
    let response = await api.json();
    games = response;
}

/*  Get the API for a specific game*/
async function getGameApi(id = '540') {
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '74bc1b5c73msha638f3546b847d3p1f73cfjsn4df37836f5da',
            'X-RapidAPI-Host': 'free-to-play-games-database.p.rapidapi.com'
        }
    };
    const url = `https://free-to-play-games-database.p.rapidapi.com/api/game?id=${id}`;
    let api = await fetch(url, options);
    currentGame = await api.json();
}

/* Creating game cards class */
class GameCard {
    constructor(id, title, shortDescrip, genre, platform, thumbnail) {
        this.id = id;
        this.title = title;
        this.shortDescrip = shortDescrip;
        this.genre = genre;
        this.platform = platform;
        this.thumbnail = thumbnail;
    }
    displayCard() {
        let card = `<div class="col-sm-12 col-md-6 col-lg-4 col-xl-3 ">
            <div class="card" id=${this.id}>
                <img src="${this.thumbnail}" class="card-img-top" alt="...">
                <div class="card-body">
                    <div class="card-title d-flex justify-content-between text-white">
                        <h6>${this.title}</h6>
                        <button class="btn btn-primary" type="button">Free</button>
                    </div>
                    <p class="card-text">${this.shortDescrip}</p>
                </div >
                <div class="card-footer d-flex justify-content-between">
                    <small class="p-2 rounded text-white">${this.genre}</small>
                    <small class="p-2 rounded text-white">${this.platform}</small>
                </div>
            </div >
        </div > `;
        main.append(card)
    }
}

/* Create the cards and Display them */
async function viewHome(category = `mmorpg`) {
    loadingScreen.fadeIn();
    $("body").css("overflow", "hidden");
    await getCategoryApi(category);
    console.log(games);
    main.empty();
    for (let game of games) {
        let { id, title, short_description, genre, platform, thumbnail } = game;
        let gameCard = new GameCard(id, title, short_description, genre, platform, thumbnail);
        gameCard.displayCard();
    }
    loadingScreen.fadeOut(500);

    $("body").css("overflow", "auto");

    /* Get the clicked game id */
    clickedGame = $('.card');
    clickedGame.click(function (info) {
        viewDetails($(this).attr('id'));
    })


}
viewHome();

/* Change the category of the displayed games through the navbar */
let x = $('.nav-link');
x.click(async function (info) {
    $('.active').removeClass('active');
    $(this).addClass('active');
    await viewHome(info.target.text);
})




/* Creating game details class */
class GameDetails extends GameCard {
    constructor(id, title, shortDescrip, genre, platform, thumbnail, status, description, gameUrl) {
        super(id, title, shortDescrip, genre, platform, thumbnail);
        this.status = status;
        this.description = description;
        this.gameUrl = gameUrl;
    }
    displayDetails() {
        let detail = `<div class="details-img col-12 col-md-4">
        <img src="${this.thumbnail}" class="w-100" alt="">
    </div>
    <div class="details-content col-12 col-md-8">
        <h3>Title: <span class="title">${this.title}</span></h3>
        <p>Category: <span class="platform bg-info rounded text-black px-2">${this.genre}</span></p>
        <p>Platform: <span class="platform bg-info rounded text-black px-2">${this.platform}</span></p>
        <p>Status: <span class="platform bg-info rounded text-black px-2">${this.status}</span></p>
        <p class="discription">${this.description}</p>
        <button type="button" class="btn btn-outline-warning "><a class="text-white" href="${this.gameUrl}">Show Game</a></button>
    </div>`;
        detailsBody.html(detail)
    }

}


/* Creating and displaying the details page */
async function viewDetails(gameId) {
    loadingScreen.fadeIn();
    $("body").css("overflow", "hidden");

    await getGameApi(gameId);
    let { id, title, genre, platform, thumbnail, status, description, game_url } = currentGame;
    currentGameObject = new GameDetails(id, title, '', genre, platform, thumbnail, status, description, game_url);
    currentGameObject.displayDetails();
    home.toggleClass('d-none')
    detailsPanel.toggleClass('d-none');
    loadingScreen.fadeOut(500);
    $("body").css("overflow", "auto");


}




/* From details to home  */
closeDetails.click(function () {
    home.toggleClass('d-none');
    detailsPanel.toggleClass('d-none');
})

