function openModal(title, description) {
    
    document.getElementById('modal-title').innerText = title;

    fetchProjectContent(title);

    document.getElementById('modal-overlay').classList.add('active');
    document.getElementById('modal').classList.add('active');
}

function closeModal() {
    document.getElementById('modal-overlay').classList.remove('active');
    document.getElementById('modal').classList.remove('active');
}

function fetchProjectContent(projectTitle) {
    // Define HTML content for each project

    const project1 = `
        <div class="site-info">
            <p>
                This site is to show off my personal achivements and personal projects. I've tried to keep it at as simple as possible to make easy to 
                navigate and maybe show off my design skils (if any).
            </p>
            <p>
                The site is static and is constructed using HTML, CSS and JavaScript. It is hosted locally and is run in a light docker container runnig
                a nginx server. The docker container sits behind a revers proxy which serves all of my web based conatiners on the server. 
            </p>
        </div>
    `

    const project2 = `
    <div class="pg-info">
        <p>
            This project comes from the popular game, GeoGuesser. I wasnt a mssive fan of the fact that I and my friends would have to pay a subscription
            to play the game. So I decided to test my skills and make a fully working web game which I called PlaceGuesser (for obvious reasons).
        </p>
        <p>
            The link to the site can be found here: <a href="https://https://placeguesser.jack-sanders.uk/">https://placeguesser.jack-sanders.uk</a>.
        </p>
    </div>
    <div class="pg-one">
        <img class="pg-home-img" src="../static/imgs/placeguesser_home.png">
        <div class="pg-home-text">
            <p>
                The project really tested my skills as a developer as it involved the combination of a number of different technologies to get it to work. 
                The base of the project is written in python and uses the flask web module to setup routes and to look after the login system. A SQLlite database 
                is used to store data such as User data and scores. The site is written in HTML, CSS and JS with a live leader board on the home page updated by 
                the server.
            </p>
            <p>
                The entire project is self hosted on my own server and runs in a docker container, which used to allow seamless development over different systems. 
                The container sits behind a reverse proxy which serves all the web containers I have running on the server.
            </p>
        </div>
    </div>
    <div class="pg-one">
        <div class="pg-home-text">
            <p>
                The entire project is based around having to guess the location on a map of a radomly provided street view location. This involved accessing the
                GoogleMaps API for both the street view and the 2D map for placeing markers to guess the location. 
            </p>
            <p>
                The game can either be played in single player mode or multiplayer mode. In multiplayer mode it is possible to send a link to friend and play in the same 
                game with realtime data sharing between the clients and the server using SOCKET-IO.
            </p>
        </div>
        <img class="pg-home-img" src="../static/imgs/placeguesser_game.png">
        
    </div>

    `;

    const projectContents = {
        'This Site!': project1,
        'PlaceGuesser': project2,
        // Add more projects as needed
    };

    // Get the modal content container
    const modalContent = document.getElementById('model-content');

    // Set the HTML content based on the selected project
    modalContent.innerHTML = projectContents[projectTitle];
}