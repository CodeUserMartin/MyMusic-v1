console.log('JS Connected');

document.addEventListener('DOMContentLoaded', () => {

    const displaySongFolderContainerEl = document.getElementById('display-folders');
    const displaySongListContainerEl = document.getElementById('display-songs-container');
    const prevBtnEl = document.getElementById('prev-btn');


    const currSongNameEl = document.getElementById('curr-song-name');


    // let currrentSong = new Audio;
    let currentSongIndex = 0;
    let currentPlayingSong;


    let foldersArray = [];
    let folderSongsArray = [];

    // console.log("Before pushing any ssongs to the array: ", folderSongsArray.length);



    fetchFolders();

    // To fetch folders 
    async function fetchFolders() {

        try {

            const url = `/songs/`
            const response = await fetch(url);
            const result = await response.text();


            // console.log(result);

            // Create an div to store the text of the result from the server

            const div = document.createElement('div');

            div.innerHTML = result;

            let anchorTagFromText = div.getElementsByTagName('a');
            // console.log(anchorTagFromText);
            // console.log(typeof anchorTagFromText);

            // Filtering out only the sub-folders inside the songs folder
            let folderLink = [...anchorTagFromText].filter(a => a.classList.contains('icon-directory'));
            // console.log(folderLink);
            let newFolders = folderLink.slice(1, folderLink.length);
            // console.log("newFolder: ", newFolders);

            // newFolders.forEach((folder) => renderFolder(folder));

            // Pushing the fetched folders to the newly array folderArray
            foldersArray.push(...newFolders);

            // console.log("Inside function length", foldersArray.length);
            // console.log("FolderArray insdie function", foldersArray);
            // console.log(foldersArray[0]);

            // Calling render Function after the async task in done
            renderFolder();

        } catch (error) {
            console.log("fail to fetch songs", error);

        }
    }

    // console.log("Outside function length", foldersArray.length);




    // RenderFolders to the DOM
    function renderFolder() {

        // displaySongFolderContainerEl.innerHTML = '';
        displaySongFolderContainerEl.classList.remove('hidden');

        // console.log("foldersArray outside forEach loop", foldersArray.length);
        // console.log("0", foldersArray[0]);

        // looping through the foldersArray to get the folders

        foldersArray.forEach((folder) => {

            // console.log("folder", folder);

            let folderTitle = folder.title;
            let folderHref = folder.href;

            // console.log(folderTitle);
            // console.log(folderHref);



            // Create an div element to store each folder

            const folderDiv = document.createElement('div');

            folderDiv.setAttribute('data-href', folderHref);


            folderDiv.innerHTML = `
            <div class = "aspect-square w-[100px] md:w-[120px] lg:w-[150px] bg-black hover:cursor-pointer">
            <p class="text-white">${folderTitle}</p>
            <img src="${folderHref}/cover.jpg" alt= "${folderTitle}">
            </div>
            `

            displaySongFolderContainerEl.appendChild(folderDiv);


            // //    When cliked on a folder, show that folder related songs
            folderDiv.addEventListener('click', () => fetchFolderSongs(folderDiv));

        });
    }

    // To fetch songs from a folder
    async function fetchFolderSongs(folderDiv) {

        let folderClickedHref = folderDiv.getAttribute('data-href');
        // console.log();


        try {

            let url = folderClickedHref;
            let response = await fetch(url);
            let songs = await response.text();

            const songsDiv = document.createElement('div');

            songsDiv.innerHTML = songs;

            // console.log(songsDiv);


            let anchorTag = songsDiv.getElementsByTagName('a');
            // console.log("anchorTag: ", anchorTag);


            let extractSongsFromText = [...anchorTag].filter(s => s.classList.contains('icon-mp3'));
            // console.log("Extracted-Songs: ", extractSongsFromText);


            folderSongsArray.push(...extractSongsFromText);
            console.log("SongList: ", folderSongsArray);

            // console.log("After pusing the folder extracted songs to the array: ", folderSongsArray.length);

            renderSongs();

        } catch (error) {
            console.log("Error fetching songs from the folder", error);


        }
    }


    // To render songs of a specific folder on click
    function renderSongs() {

        // Making sure to clear the already existed songs on the list 
        displaySongListContainerEl.innerHTML = '';


        displaySongFolderContainerEl.classList.add('hidden');
        displaySongListContainerEl.classList.remove('hidden');
        displaySongListContainerEl.classList.add('grid')

        // Looping through the clicked folderSongsArray to get the specific songs from the clicked folder


        folderSongsArray.forEach((song) => {


            let songTitle = song.title;
            let songHref = song.href;
            // console.log(songHref);


            let songDiv = document.createElement('div');

            songDiv.setAttribute('song-href', songHref);

            songDiv.innerHTML = `
        <div class="border bg-gray-900 px-3 py-2 w-full flex justify-around items-center gap-3 rounded-xl hover:cursor-pointer">
            <div class="aspect-square w-[55px] md:w-[70px] lg:w-[90px] flex justify-center items-center ">
                <img src="src/images/music-player.png" alt="music-icon">
            </div>
            <div>
                <p class="text-white text-sm p-1 md:text-md">${songTitle}</p>
            </div>
            <div class="w-[30px] invert">
                <img src="src/images/unlike-heart-icon.png" alt="unliked-heart-icon">
            </div>
        </div>
        `

            displaySongListContainerEl.appendChild(songDiv);


            songDiv.addEventListener('click', () => fetchSongInfo(songDiv, songHref, songTitle));



            //     let songURL = songDiv.getAttribute('song-href');
            //     console.log(songURL);

            //     // let audio = new Audio(songURL);

            //     // audio.addEventListener('loadeddata', () => {

            //     //     audio.play();

            //     //     console.log("Duration: ", audio.duration);

            //     // })


            //     // console.log(songTitle);
            //     // console.log(songHref);

            //     currSongNameEl.innerText = songTitle;


            // })

        });

        // console.log(songDiv);
        // console.log("songDivHref : ", songHref);


        // Prev btn logic
        // Goes back to the folder selection screen
        // clears the array with the songs loaded 
        prevBtnEl.addEventListener('click', () => {

            // Every time we click on the prev button we reset the array to 0.
            folderSongsArray = [];

            // console.log("array length after clicking on the prev button: ", folderSongsArray.length);

            // adding hidden class over to gird to the songList container 
            displaySongListContainerEl.classList.remove('grid');
            displaySongListContainerEl.classList.add('hidden');

            // showing displayFolder container
            displaySongFolderContainerEl.classList.remove('hidden');
            displaySongFolderContainerEl.classList.add('grid');

        })
    }



    function fetchSongInfo(songDiv, songHref, songTitle) {

        // console.log("Hello from SongInfo: ", songDiv);

        // console.log("inside", songHref);

        // Changing the currentSongName
        currSongNameEl.innerHTML = songTitle;


        // Creating the audio object for the song playback

        // console.log("Currentplayingsong before: ", currentPlayingSong);
        // currentPlayingSong = songHref;

        console.log("Currentplayingsong after: ", currentPlayingSong);

        // Checking if the currentSong is paused in order to play the next song
        if (currentPlayingSong) {
            currentPlayingSong.pause();
        }


        currentPlayingSong = new Audio(songHref);
        console.log("now playing new song ", currentPlayingSong);
        currentPlayingSong.play();

        currentPlayingSong.addEventListener('loadeddata', () => {


            console.log("Duration: ", formatTime(currentPlayingSong.duration));

        })


    }

    // helper function to format time (mm:ss)
    function formatTime(seconds) {
        let minutes = Math.floor(seconds / 60);
        let secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }



});
