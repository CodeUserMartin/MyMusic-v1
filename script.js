console.log('JS Connected');

document.addEventListener('DOMContentLoaded', () => {

    const displaySongFolderContainerEl = document.getElementById('display-folders');
    const displaySongListContainerEl = document.getElementById('display-songs-container');
    const displayFavSongContainerEl = document.getElementById("fav-Song-Container");
    const goBackBtnEl = document.getElementById('go-back-btn');
    const goBackDivEl = document.getElementById('go-back-div');
    const prevBtnEl = document.getElementById('prev-btn');
    const nextBtnEl = document.getElementById('next-btn');
    const playPauseBtnEl = document.getElementById('play-pause-btn');
    const playPauseIoonEl = document.getElementById('play-pause-icon');

    const searchTextEl = document.getElementById('text');
    const searchIconEl = document.getElementById('serach-icon');
    const volumeSlider = document.getElementById('volumeSlider');
    const favSongTextEl = document.getElementById('fav-song-text');

    const currSongNameEl = document.getElementById('curr-song-name');
    const currSongDurationEl = document.getElementById('song-duration');

    const progressOuterBarEl = document.getElementById('progress-outer-bar');
    const progressInnerBarEl = document.getElementById('progress-inner-bar');


    //CurrentScreen Tracking Variable
    let currScreen = 'showFolders'

    let currentSongIndex = 0;
    let currentPlayingSong;


    let foldersArray = [];
    let folderSongsArray = [];

    fetchFolders();

    // Get existing liked songs from localStorage
    let likedSongs = JSON.parse(localStorage.getItem('likedSongs')) || [];
    renderMostFavSongs();

    // To fetch folders 
    async function fetchFolders() {

        try {

            const url = `/songs/`
            const response = await fetch(url);
            const result = await response.text();

            // Create an div to store the text of the result from the server
            const div = document.createElement('div');

            div.innerHTML = result;

            let anchorTagFromText = div.getElementsByTagName('a');

            // Filtering out only the sub-folders inside the songs folder
            let folderLink = [...anchorTagFromText].filter(a => a.classList.contains('icon-directory'));

            let newFolders = folderLink.slice(1, folderLink.length);

            foldersArray = newFolders.map((folder, index) => {
                return {
                    index: index,
                    folderTitle: folder.title,
                    folderSongLink: folder.href
                }
            })

            // Calling render Function after the async task in done
            renderFolder(foldersArray);

        } catch (error) {
            console.log("fail to fetch songs", error);

        }
    }


    // RenderFolders to the DOM
    function renderFolder(folders) {
        currScreen = 'showFolders';

        displaySongFolderContainerEl.innerHTML = '';

        folders.forEach((folder) => {

            let folderTitle = folder.folderTitle;
            let folderHref = folder.folderSongLink;

            // Create an div element to store each folder

            const folderDiv = document.createElement('div');

            folderDiv.setAttribute('data-href', folderHref);


            folderDiv.innerHTML = `
            <div class = "aspect-square w-[130px] md:w-[150px] lg:w-[170px] font-bold bg-[#101E26] rounded-2xl overflow-hidden hover:cursor-pointer">
            <p class="text-[#ECDFCC] font-mono text-center p-2">${folderTitle}</p>
            <img src="${folderHref}/cover.jpg" alt= "${folderTitle}">
            </div>
            `

            displaySongFolderContainerEl.appendChild(folderDiv);

            folderDiv.addEventListener('click', () => fetchFolderSongs(folderHref));

        });


    }

    // To fetch songs from a folder
    async function fetchFolderSongs(folderHref) {

        try {

            let url = folderHref;
            let response = await fetch(url);
            let songs = await response.text();

            const songsDiv = document.createElement('div');

            songsDiv.innerHTML = songs;

            let anchorTag = songsDiv.getElementsByTagName('a');

            let extractSongsFromText = [...anchorTag].filter(s => s.href.endsWith('.mp3'));
            // console.log("Extracted-Songs: ", extractSongsFromText);


            // folderSongsArray.push(...extractSongsFromText);
            folderSongsArray = extractSongsFromText.map((link, index) => {
                return {
                    title: extractFileName(link.href),
                    href: link.href,
                    index: index,
                    liked: false
                }
            });

            folderSongsArray.forEach(song => {
                const match = likedSongs.find(s => s.href === song.href);
                if (match) {
                    song.liked = true;
                }
            });

            renderSongs(folderSongsArray);

            // Helper function to format-Song-name
            function extractFileName(href) {
                const file = href.split("/").pop().replace(/\.[^/.]+$/, ""); // remove extension
                return decodeURIComponent(file); // decode %20 etc.
            }

        } catch (error) {
            console.log("Error fetching songs from the folder", error);

        }
    }


    // To render songs of a specific folder on click
    function renderSongs(folderSongs) {
        currScreen = 'showFoldersSongs';

        // Making sure to clear the already existed songs on the list 
        displaySongListContainerEl.innerHTML = '';


        displaySongFolderContainerEl.classList.add('hidden');
        displaySongListContainerEl.classList.remove('hidden');
        displaySongListContainerEl.classList.add('grid');

        goBackDivEl.classList.remove('hidden');
        goBackBtnEl.classList.remove('hidden');
        goBackDivEl.classList.add('flex');


        // Looping through the clicked folderSongsArray to get the specific songs from the clicked folder
        folderSongs.forEach((song) => {

            let songTitle = song.title;
            let songHref = song.href;
            let index = song.index;
            let songLiked = song.liked;


            let songDiv = document.createElement('div');

            songDiv.setAttribute('song-href', songHref);

            songDiv.innerHTML = `
        <div class="bg-gray-900 px-3 py-2 w-[300px] md:w-[250px] lg:w-full lg:h-[90px] flex justify-around items-center gap-3 rounded-xl  hover:cursor-pointer">
            <div class="aspect-square w-[55px] md:w-[70px] lg:w-[90px] flex justify-center items-center ">
                <img src="src/images/music-player.png" alt="music-icon">
            </div>
            <div>
                <p class="text-white font-mono text-sm p-1 md:text-md">${songTitle}</p>
            </div>
            <div id="heart-icon" class="w-[30px] invert">
                <img src="${songLiked ? `src/images/liked-heart-icon.png` : `src/images/unlike-heart-icon.png`}" alt="unliked-heart-icon" class="heart-icon">
            </div>
        </div>
        `

            // console.log(songDiv);


            songDiv.addEventListener('click', () => playSong(index));
            songDiv.querySelector('.heart-icon').addEventListener('click', (e) => {
                e.stopPropagation();
                toggleLike(index);
            })

            displaySongListContainerEl.appendChild(songDiv);

        });


        // goBack btn logic
        // Goes back to the folder selection screen
        // clears the array with the songs loaded 
        goBackBtnEl.addEventListener('click', () => {

            // Every time we click on the goBack button we reset the array to 0.
            folderSongsArray = [];

            //currScreen back to showFolders;
            currScreen = 'showFolders';

            // Make sure that gobackdiv is also getting hidden when going back to the folderScreen
            goBackDivEl.classList.remove('flex');
            goBackDivEl.classList.add('hidden');

            // adding hidden class over to gird to the songList container 
            displaySongListContainerEl.classList.remove('grid');
            displaySongListContainerEl.classList.add('hidden');

            // showing displayFolder container
            displaySongFolderContainerEl.classList.remove('hidden');
            displaySongFolderContainerEl.classList.add('grid');
        })
    }

    // Song liked or unliked logic
    function toggleLike(index) {
        const song = folderSongsArray[index];
        console.log("song is :", song);

        song.liked = !song.liked;

        if (song.liked) {
            saveToLocalStorage(song);
        }
        else {
            likedSongs = likedSongs.filter(s => s.href !== song.href);
            console.log('Song removed success!!');
        }

        // Find song div
        const songDiv = document.querySelector(`[song-href="${folderSongsArray[index].href}"]`);

        // Find heart img
        const heartImg = songDiv.querySelector('.heart-icon');

        // Update icon instantly
        heartImg.src = folderSongsArray[index].liked
            ? 'src/images/liked-heart-icon.png'
            : 'src/images/unlike-heart-icon.png';

        localStorage.setItem("likedSongs", JSON.stringify(likedSongs));

        renderMostFavSongs();
    }


    // Setting liked song to the local storage
    function saveToLocalStorage(song) {

        // Check if the song is already in the list
        const exists = likedSongs.some(s => s.href === song.href);

        // If not already liked, add it
        if (!exists) {
            likedSongs.push(song);
            localStorage.setItem('likedSongs', JSON.stringify(likedSongs));
            console.log("Song added to localStorage:", song.title);
        }
    }


    //Play Song logic
    function playSong(index) {

        currentSongIndex = index;

        // if currentSong is playing we pause it using .pause from new Audio property
        if (currentPlayingSong) {
            currentPlayingSong.pause();
        }

        // Creating a new Audio object everytime, new song is clicked 
        const songHref = folderSongsArray[currentSongIndex].href;

        currentPlayingSong = new Audio(songHref);
        playPauseIoonEl.src = "../src/images/play-btn.png"

        currentPlayingSong.play();

        // Retriving the song data
        currentPlayingSong.addEventListener('loadeddata', () => {


            // Changing the currentSongName
            currSongNameEl.innerHTML = folderSongsArray[currentSongIndex].title;

            currentPlayingSong.ontimeupdate = () => {
                currSongDurationEl.textContent =
                    `${formatTime(currentPlayingSong.currentTime)} / ${formatTime(currentPlayingSong.duration)}`;
                const percent = (currentPlayingSong.currentTime / currentPlayingSong.duration) * 100;
                progressInnerBarEl.style.width = percent + "%";
            };
            // console.log("Duration: ", formatTime(currentPlayingSong.duration));

            // Click to seek
            progressOuterBarEl.addEventListener("click", (e) => {
                const rect = progressOuterBarEl.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const percent = clickX / rect.width;

                currentPlayingSong.currentTime = percent * currentPlayingSong.duration;
            });



            // Player next song logic
            // console.log("nextbtn ", nextBtnEl);

            // console.log("Before prevBtn or nextBtn clicked value of currentSongIndex is: ", currentSongIndex);

        })

        // Volume Slider Logic
        volumeSlider.addEventListener('input', () => {
            if (currentPlayingSong) {
                currentPlayingSong.volume = volumeSlider.value;
            }
        });

        currentPlayingSong.addEventListener('ended', playNextSong);

        // helper function to format time (mm:ss)
        function formatTime(seconds) {
            let minutes = Math.floor(seconds / 60);
            let secs = Math.floor(seconds % 60);
            return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
        }

    }

    // PlayNextSong logic
    function playNextSong() {
        currentSongIndex++;

        if (currentSongIndex >= folderSongsArray.length) {
            currentSongIndex = 0;
        }

        playSong(currentSongIndex);
    }

    prevBtnEl.addEventListener('click', () => {
        currentSongIndex--;

        if (currentSongIndex < 0) {
            currentSongIndex = folderSongsArray.length - 1;
        }

        playSong(currentSongIndex);
        // console.log("after prev clicked: ", currentSongIndex);
    });

    // Player play/pasue logic
    playPauseBtnEl.addEventListener('click', () => {

        if (!currentPlayingSong) return;

        if (currentPlayingSong.paused) {
            currentPlayingSong.play()
            playPauseIoonEl.src = "../src/images/play-btn.png"
        } else {
            currentPlayingSong.pause();
            playPauseIoonEl.src = "../src/images/pause-btn.png"
        }

    });

    nextBtnEl.addEventListener('click', () => {
        currentSongIndex++;

        if (currentSongIndex >= folderSongsArray.length) {
            currentSongIndex = 0;
        }

        playSong(currentSongIndex);
        // console.log("after nextBtn clicked: ", currentSongIndex);

    })

    //Render favSong logic
    function renderMostFavSongs() {

        if (likedSongs.length === 0) {
            displayFavSongContainerEl.innerHTML =
                `<p class="text-center font-mono text-black text-2xl bg-blue-500 p-2 rounded-2xl">No Favorite Songs!!</p>`;
        } else {
            displayFavSongContainerEl.innerHTML = '';
        }
        likedSongs.forEach((likedSong) => {

            // console.log("like:", likedSong.title);


            let songTitle = likedSong.title;
            let songLiked = likedSong.liked;

            // console.log("this is from mostFavSongArr", likedSong);

            const favsongDiv = document.createElement("div");

            favsongDiv.innerHTML = `
                <div
                            class=" bg-gray-900 px-3 py-2 mx-auto my-0 lg:w-[80%] h-[70px] flex justify-between items-center gap-3 rounded-xl">
                            <div class="aspect-square w-[55px] md:w-[70px] lg:w-[90px] flex justify-center items-center">
                                <img src="src/images/music-player.png" alt="music-iocn">
                            </div>
                            <div>
                                <p class="text-white text-sm  md:text-lg p-2">${songTitle}</p>
                            </div>
                            <div class="w-[30px]">
                                 <img src="${songLiked ? `src/images/liked-heart-icon.png` : `src/images/unlike-heart-icon.png`}" alt="unliked-heart-icon" class="heart-icon">
                            </div>
                </div>`

            displayFavSongContainerEl.appendChild(favsongDiv);

        })
    }

    // Search bar Logic
    searchTextEl.addEventListener('input', (e) => {
        const value = e.target.value.trim().toLowerCase();

        if (currScreen === 'showFolders') {
            if (value === "") {
                renderFolder(foldersArray);
            }
            else {
                const showFoldersResult = foldersArray.filter((searchFolder => searchFolder.folderTitle.toLowerCase().includes(value)));
                renderFolder(showFoldersResult);
            }
        }
        else if (currScreen === 'showFoldersSongs') {
            if (value === "") {
                renderSongs(folderSongsArray);
            }
            else {
                const showFoldersSongsResult = folderSongsArray.filter((searchFolderSong => searchFolderSong.title.toLowerCase().includes(value)));
                renderSongs(showFoldersSongsResult);
            }
        }

    });

});