console.log('JS Connected');

document.addEventListener('DOMContentLoaded', () => {

    const displaySongFolderContainerEl = document.getElementById('display-folders');
    const displaySongListContainerEl = document.getElementById('display-songs-container');
    const displayFavSongContainerEl = document.getElementById("fav-Song-Container");
    const goBackBtnEl = document.getElementById('go-back-btn');
    const prevBtnEl = document.getElementById('prev-btn');
    const nextBtnEl = document.getElementById('next-btn');
    const playPauseBtnEl = document.getElementById('play-pause-btn');
    const playPauseIoonEl = document.getElementById('play-pause-icon');


    const currSongNameEl = document.getElementById('curr-song-name');
    const currSongDurationEl = document.getElementById('song-duration');


    // let currrentSong = new Audio;
    let currentSongIndex = 0;
    let currentPlayingSong;


    let foldersArray = [];
    let folderSongsArray = [];
    let mostFavSongs = [];

    // console.log("Before pushing any ssongs to the array: ", folderSongsArray.length);



    fetchFolders();
    renderMostFavSongs();

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
            console.log("New folderLink :", folderLink);
            let newFolders = folderLink.slice(1, folderLink.length);
            // console.log("newFolder: ", newFolders);

            // newFolders.forEach((folder) => renderFolder(folder));

            // Pushing the fetched folders to the newly array folderArray
            foldersArray.push(...newFolders);
            // console.log("songsss: ", folderSongsArray);


            // console.log("Inside function length", foldersArray.length);
            // console.log("FolderArray insdie function", foldersArray);
            // console.log(foldersArray[0]);

            // Calling render Function after the async task in done
            renderFolder();

        } catch (error) {
            console.log("fail to fetch songs", error);

        }
    }


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


            // let extractSongsFromText = [...anchorTag].filter(s => s.classList.contains('icon-mp3'));
            let extractSongsFromText = [...anchorTag].filter(s => s.href.endsWith('.mp3'));
            console.log("Extracted-Songs: ", extractSongsFromText);


            // folderSongsArray.push(...extractSongsFromText);
            folderSongsArray = extractSongsFromText.map(link => ({
                title: extractFileName(link.href),
                href: link.href,
                liked: false
            }));
            console.log("SongList: ", folderSongsArray);



            // console.log("After pusing the folder extracted songs to the array: ", folderSongsArray.length);

            renderSongs();


            function extractFileName(href) {
                const file = href.split("/").pop().replace(/\.[^/.]+$/, ""); // remove extension
                return decodeURIComponent(file); // decode %20 etc.
            }


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


        folderSongsArray.forEach((song, index) => {

            // console.log("folderSong:", song.href);


            let songTitle = song.title;
            let songHref = song.href;
            // console.log("SongTtitleNow: ", songTitle);

            // console.log("songIndex: ", index);

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
            <div id="heart-icon" class="w-[30px] invert border-2 border-amber-600">
                <img src="${song.liked ? `src/images/liked-heart-icon.png` : `src/images/unlike-heart-icon.png`}" alt="unliked-heart-icon" class="heart-icon">
            </div>
        </div>
        `



            songDiv.addEventListener('click', () => playSong(index));
            // playSong();
            songDiv.querySelector('.heart-icon').addEventListener('click', (e) => {
                e.stopPropagation();
                toggleLike(index)
            })

            displaySongListContainerEl.appendChild(songDiv);


            function toggleLike(index) {
                const song = folderSongsArray[index];
                song.liked = !song.liked;

                if (song.liked) {
                    mostFavSongs.push(song);
                } else {
                    mostFavSongs = mostFavSongs.filter(s => s.href !== song.href);
                }

                renderSongs();
                renderMostFavSongs();
            }

        });



        // goBack btn logic
        // Goes back to the folder selection screen
        // clears the array with the songs loaded 
        goBackBtnEl.addEventListener('click', () => {

            // Every time we click on the goBack button we reset the array to 0.
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



    function playSong(index) {


        // console.log("Song Folder: ", folderSongsArray);


        // console.log("Index value at start in playSong is: ", currentSongIndex);
        // console.log("title is ", songTitle);



        // console.log("current Song ULR in the playSong function:", songHref);


        // currentSongIndex is the clicked song index
        // console.log("CurrentSongIndex value now before setting ", currentSongIndex);
        currentSongIndex = index;

        // console.log("currentSongIndex value after cureentSong set to Index of the song", currentSongIndex);


        // Creating the audio object for the song playback


        // if currentSong is playing we pause it using .pause from new Audio property
        if (currentPlayingSong) {
            currentPlayingSong.pause();
        }



        // Creating a new Audio object everytime, new song is clicked 
        const songHref = folderSongsArray[currentSongIndex].href;
        // console.log("DemoHref is", songHref);


        currentPlayingSong = new Audio(songHref);
        playPauseIoonEl.src = "../src/images/play-btn.png"
        console.log("curr song and idndex: ", currentSongIndex);
        // console.log("Songs list: ", folderSongsArray);

        // currSong = folderSongsArray[currentSongIndex];
        // console.log("is: ", currSong);
        // currSong = new Audio(songHref); 



        console.log("now playing new song ", currentPlayingSong)
        currentPlayingSong.play();
        // currSong.play();


        currentPlayingSong.addEventListener('loadeddata', () => {


            //     // Changing the currentSongName
            currSongNameEl.innerHTML = folderSongsArray[currentSongIndex].title;

            //     // CurrentSong duration
            currSongDurationEl.innerHTML = formatTime(currentPlayingSong.duration);
            // console.log("Duration: ", formatTime(currentPlayingSong.duration));



            //     // Player next song logic
            //     // console.log("nextbtn ", nextBtnEl);

            // console.log("Before prevBtn or nextBtn clicked value of currentSongIndex is: ", currentSongIndex);




        })

        // helper function to format time (mm:ss)
        function formatTime(seconds) {
            let minutes = Math.floor(seconds / 60);
            let secs = Math.floor(seconds % 60);
            return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
        }

    }

    //     // Player play/pasue logic

    prevBtnEl.addEventListener('click', () => {
        currentSongIndex--;

        if (currentSongIndex < 0) {
            currentSongIndex = folderSongsArray.length - 1;
        }

        playSong(currentSongIndex);
        // console.log("after prev clicked: ", currentSongIndex);
    });


    playPauseBtnEl.addEventListener('click', () => {

        if (!currentPlayingSong) return;


        if (currentPlayingSong.paused) {
            currentPlayingSong.play()
            playPauseIoonEl.src = "../src/images/play-btn.png"
            // console.log("Music Playing...");
        } else {
            currentPlayingSong.pause();
            playPauseIoonEl.src = "../src/images/pause-btn.png"
            // console.log("Music Paused...");

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


    function likedSong(songDiv) {

        // console.log("inside likedSong func", folderSongsArray);
        // console.log("here ", songDiv);
        // console.log("before addding to favsong arr", mostFavSongs);



        //   folderSongsArray.forEach((h)=> {
        //     console.log("liked song: ", h);

        //   })  

        // songDiv.addEventListener("click", (e) => {

        //     // console.log("okay", songDiv);

        //     e.stopPropagation();



        //     // If heart icon was clicked
        //     if (e.target.tagName === "IMG") {
        //         // console.log("yES, IMG WAS CLICKED");
        //         // console.log("yes", e.target);

        //         mostFavSongs.push(songDiv);
        //         // console.log("success adding");
        //         // console.log("after adding to fav song arr", mostFavSongs);
        //         renderMostFavSongs(songTitle);
        //     }


        //     // console.log("event is:", e);

        // })

        // folderSongsArray.forEach((demo) => {
        //     console.log("demo:", demo);


        //         demo.addEventListener("click", (e) => {
        //             //  e.stopPropagation();
        //              console.log("clicked div insdie new foreach is:", e);

        //         })


        // })

        console.log("insde liedsong: ", songDiv);




    }

    function renderMostFavSongs(songTitle) {

        console.log("hello.............");
        console.log("length of mostfavarr", mostFavSongs.length);
        console.log(mostFavSongs);



        // displayFavSongContainerEl.innerHTML = '';
        // mostFavSongs.forEach((s) => {

        // console.log("this is from mostFavSongArr", s);

        // const favsongDiv = document.createElement("div");

        // favsongDiv.innerHTML = `
        // <div
        //             class=" bg-gray-900 px-3 py-2 mx-auto my-0 lg:w-[80%] h-[70px] flex justify-between items-center gap-3 rounded-xl">
        //             <div class="aspect-square w-[55px] md:w-[70px] lg:w-[90px] flex justify-center items-center">
        //                 <img src="src/images/music-player.png" alt="music-iocn">
        //             </div>
        //             <div>
        //                 <p class="text-white text-sm  md:text-lg p-2">${songTitle}</p>
        //             </div>
        //             <div class="w-[30px]">
        //                 <img src="src/images/liked-heart-icon.png" alt="liked-heart-icon">
        //             </div>
        // </div>`


        // displayFavSongContainerEl.appendChild(favsongDiv);

        // })
    }



});




// let arr = [1,2,3];

// arr[0] --- 1
// arr[1] --- 2
// arr[2] --- 3


// currentSongindex = 1
// arrayElement = 2nd element in the array
// folderFetchSong = [em1, em2, em3]



// currentsongindex = 0


// arr = [asa nhi, chahaun]
// currsongindex = 1


// arr[0] = asa nhi
// arr[1] = chahum


