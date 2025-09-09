console.log('JS Connected');

document.addEventListener('DOMContentLoaded', () => {

    const displaySongFolderContainerEl = document.getElementById('display-folders');
    const displaySongListContainerEl = document.getElementById('display-songs-container');
    const prevBtnEl = document.getElementById('prev-btn');

    let currrentSong = new Audio;
    let currentSongIndex = 0;


    fetchFolders();
    renderFolder();

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

            newFolders.forEach((folder) => renderFolder(folder));

        } catch (error) {
            console.log("fail to fetch songs", error);

        }
    }

    // RenderFolders to the DOM
    function renderFolder(folder) {

        // displaySongFolderContainerEl.innerHTML = '';
        displaySongFolderContainerEl.classList.remove('hidden');

        let folderHref = folder.href;
        let folderTitle = folder.title;




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


        //    When cliked on a folder, show that folder related songs
        folderDiv.addEventListener('click', () => fetchFolderSongs(folderDiv));
    }

    // To fetch songs from a folder
    async function fetchFolderSongs(folderDiv) {

        let folderClickedHref = folderDiv.getAttribute('data-href');
        // console.log(folderClickedHref);

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


            let songsList = extractSongsFromText.forEach((song) => renderSongs(song));

        } catch (error) {
            console.log("Error fetching songs from the folder", error);


        }
    }

    // To render songs of a specific folder on click
    function renderSongs(song) {

        // console.log("Song: ", song);


        let songTitle = song.title;
        let songHref = song.href;
        // console.log(songHref);

        displaySongFolderContainerEl.classList.add('hidden');
        displaySongListContainerEl.classList.remove('hidden');
        displaySongListContainerEl.classList.add('grid')

        // displaySongListContainerEl.innerHTML = '';

        let songDiv = document.createElement('div');

        songDiv.innerHTML = `
        <div class="border bg-gray-900 px-3 py-2 w-full flex justify-around items-center gap-3 rounded-xl hover:cursor-pointer">
                <div class="aspect-square w-[55px] md:w-[70px] lg:w-[90px] flex justify-center items-center ">
                    <img src="src/images/music-player.png" alt="music-icon">
                </div>
                <div>
                    <p class="text-white text-sm p-1 md:text-md">${songTitle}</p>
                    <span song-href = "${songHref}"></span>
                </div>
                <div class="w-[30px] invert">
                    <img src="src/images/unlike-heart-icon.png" alt="unliked-heart-icon">
                </div>
        </div>
        `

        displaySongListContainerEl.appendChild(songDiv);

        // console.log(songDiv);
        // console.log("songDivHref : ", songHref);


        prevBtnEl.addEventListener('click', () => {

            // adding hidden class over to gird to the songList container 
            displaySongListContainerEl.classList.remove('grid');
            displaySongListContainerEl.classList.add('hidden');

            // shwoing displayFolder constainer
            displaySongFolderContainerEl.classList.remove('hidden');
            displaySongFolderContainerEl.classList.add('grid');

        })


    }



});
