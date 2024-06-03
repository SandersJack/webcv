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
                This site is to show off my achievements and personal projects. I've tried to keep it as simple as possible to make it easy to 
                navigate and show off some of my design skills.
            </p>
            <p>
                The site is static and is constructed using HTML, CSS and JavaScript. It is hosted locally and runs in a light docker container running
                an Nginx server. The docker container sits behind a reverse proxy, which serves all of my web-based containers on the server. 
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
                The project tested my skills as a developer as it involved combining several different technologies to get it to work. 
                The project's base is written in Python, and the Flask web module is used to set up routes and look after the login system. An SQLite database 
                is used to store data such as User data and scores. The site is constructed using HTML, CSS and JS, with a live leaderboard on the home page updated by 
                the server.
            </p>
            <p>
                The entire project is self-hosted on my server and runs in a docker container, which is used to allow seamless development over different systems. 
                The container sits behind a reverse proxy, which serves all the web containers I have running on the server.
            </p>
        </div>
    </div>
    <div class="pg-one">
        <div class="pg-home-text">
            <p>
                The entire project is based on guessing the location on a map of a randomly provided street view location. This involved accessing the
                GoogleMaps API is used for both street views, and the 2D map is used to place markers to guess the location.  
            </p>
            <p>
                The game can either be played in single-player mode or multiplayer mode. In multiplayer mode, it is possible to send a link to a friend and play in the same 
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
                This project was created initially to monitor the temperature of my room and see how it changed over time. The project was created using a
                Raspberry Pi and a DHT22 moisture and temperature sensor. The sensor was soldered wires connecting to the GPIO pins on the pico. The data is then 
                sent over UDP to a server, which stores the data in an SQLite database.
            </p>
            <p>
                The code for the pico is written in C and uses the pico-SDK to access the GPIO pins and send the data over UDP. The server is written in Python
            </p>
            <p>
                The data is then distributed to a dashboard, as shown in the image. The dashboard is created using HTML, CSS, and Python and is served using Docker. The 
                data is also sent to a local home assistant server, where a temperature can be selected, and the room is kept at that temperature.
            </p>
        </div>
    </div>
    `;

    const workproject1 = `
    <div class="pg-one">
        <div class="pg-home-text">
            <p>
                This was the first project when I started my PhD at NA62. The project was to create a flexible framework to allow for the development and design of
                new detectors within the Monte Carlo Simulation
            </p>
            <p>
                Before the project, the framework was extremely hard-coded, with only the current NA62 detector setup allowed. Work was done to generalise a lot of the classes 
                allowing a .dat file to define the detector setup and allow detectors to be placed in any position and orientation.
            </p>
        </div>
        <div class="pg-home-text">
            <p>
                Due to many changes to the code base, the simulation and reconstruction had to be validated. The detector validation was extensive, with 
                detectors being checked through Geantinos to create impacts with detector volumes and to check if any differences were present. The output of the simulation
                was also checked against the old simulation to make sure the changes had not affected the output.
            </p>
            <p>
                This feature has been extensivly used at NA62 for the development of new detectors and was integral to the HIKE proposal.
            </p>
        </div>
        <div class="project-logo-container">
            <img class="project-logo" src="../static/imgs/NA62-logo.jpg">
            <img class="project-logo" src="../static/imgs/HIKE-logo.png">
        </div>
    </div>
    `;
    const workproject2 = `
    <div class="pg-one">
    <div class="pg-home-text">
        <p>
            This was another large project I undertook at NA62 with the goal of compressing the output of the Monte Carlo simulation. Due to the large amount of simulations required 
            for the NA62 Analysis, a lot of storage is taken up, around ~ 1PB. As NA62 is a small experiment, we are limited in storage space, with most of the space taken up by collected data.
            So, compressing the output of the simulation was proposed. 
        </p>
    </div>
    <div class="pg-home-text">
        <p>
            This was done by using smaller data types, such as doubles to floats and ints to shorts when possible, and implementing custom compression algorithms to reduce the data size. 
            As of June 2024, the compression implemented resulted in a three times reduction in file size.
        </p>
    </div>
    <div class="project-logo-container">
            <img class="project-logo" src="../static/imgs/NA62-logo.jpg">
    </div>
</div>
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