function openModal(title, description) {
    
    document.getElementById('modal-title').innerText = title;

    fetchProjectContent(title);

    document.getElementById('modal-overlay').classList.add('active');
    document.getElementById('modal').classList.add('active');
}

function closeModal() {

    const projectTileElements = document.querySelectorAll('.own-project');
    projectTileElements.forEach((element) => {
        element.style.animation = 'gradientAnimation 3s ease infinite';
    });

    const work_projectTileElements = document.querySelectorAll('.work-project');
    work_projectTileElements.forEach((element) => {
        element.style.animation = 'gradientAnimation 3s ease infinite';
    });

    const modalOverlay = document.getElementById('modal');
    modalOverlay.classList.remove('work-info');
    modalOverlay.classList.remove('own-info');

    document.getElementById('modal-overlay').classList.remove('active');
    document.getElementById('modal').classList.remove('active');
}

function fetchProjectContent(projectTitle) {
    // Define HTML content for each project

    const project1 = `
        <div class="site-info">
            <p>
                This site is to show off my personal achievements and personal projects. I've tried to keep it at as simple as possible, to make it easy to 
                navigate and maybe show off some of my design skils.
            </p>
            <p>
                The site is static and is constructed using HTML, CSS and JavaScript. It is hosted locally and is run in a light docker container runing
                a nginx server. The docker container sits behind a reverse proxy which serves all of my web based conatiners on the server. 
            </p>
            <p>
                The code for the site can be found here: <a href="https://github.com/SandersJack/webcv" target="_blank"><i class="fa fa-github"   ></i></a>
            </p>
        </div>
    `

    const project2 = `
    <div class="pg-info">
        <p>
            This project comes from the popular game, GeoGuesser. I wasnt a massive fan of the fact that I and my friends would have to pay a subscription
            to play the game. So I decided to test my skills and make a fully working web game which I called PlaceGuesser (for obvious reasons).
        </p>
        <p>
            The link to the site can be found here: <a href="https://https://placeguesser.jack-sanders.uk/">https://placeguesser.jack-sanders.uk</a>.
        </p>
        <p>
            The code for the project can be found here: <a href="https://github.com/SandersJack/PlaceGuesser" target="_blank"><i class="fa fa-github"   ></i></a>
        </p>
    </div>
    <div class="pg-one">
        <img class="pg-home-img" src="../static/imgs/placeguesser_home.png">
        <div class="pg-home-text">
            <p>
                The project really tested my skills as a developer as it involved the combination of a number of different technologies to get it to work. 
                The base of the project is written in python and uses the flask web module to setup routes and to look after the login system. A SQLlite database 
                is used to store data such as User data and scores. The site is constructed using HTML, CSS and JS, with a live leader board on the home page updated by 
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

    const project3 = `
    <div class="pg-one">
        <img class="pg-home-img" src="../static/imgs/tempMonitor.png">
        <div class="pg-home-text">
            <p>
                This project was created orginaly to monitor the temperature of my room and to see how it changed over time. The project was created using a
                raspberry pi and a DHT22 mositure and temperature sensor. The sensor was soldered wires connecting to the GPIO pins on the pico. The data is then 
                sent over UDP to a server which stores the data in a SQLlite database.
            </p>
            <p>
                The code for the pico is written in C and uses the pico-sdk to access the GPIO pins and to send the data over UDP. The server is written in python
            </p>
            <p>
                The data is then distributed to a dashboard shown in the image. The dashboard is created using HTML, CSS and python and served using docker. The 
                data is also sent to a local home assistant server which a temperture can be sellected and the room kept at that temperture.
            </p>
        </div>
    </div>
    `;

    const workproject1 = `

    `;
    const workproject2 = `

    `;
    const workproject3 = `

    `;

    const projectContents = {
        'Flexible Framework': workproject1,
        'Slim MC': workproject2,
        'My Analysis': workproject3,
        'This Site!': project1,
        'PlaceGuesser': project2,   
        'Pico Projects': project3
    };

    const projectTileElements = document.querySelectorAll('.own-project');
    projectTileElements.forEach((element) => {
        element.style.animation = 'none';
    });

    const work_projectTileElements = document.querySelectorAll('.work-project');
    work_projectTileElements.forEach((element) => {
        element.style.animation = 'none';
    });


    // Get the modal content container  
    const modalContent = document.getElementById('model-content');
    const modalOverlay = document.getElementById('modal');

    if (projectTitle === 'Flexible Framework' || projectTitle === 'Slim MC' || projectTitle === 'My Analysis') {
        modalOverlay.classList.add('work-info');
    } else {
        modalOverlay.classList.add('own-info');
    }
    

    // Set the HTML content based on the selected project
    modalContent.innerHTML = projectContents[projectTitle];
}