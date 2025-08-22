console.log('JS Connected');

document.addEventListener('DOMContentLoaded', () => {

    const displaySongFolderContainerEl = document.getElementById('display-folders');
    const displaySongListContainerEl = document.getElementById('display-songs-container');


    fetchSongs();


    async function fetchSongs() {

        try {

            const url = `/songs/`
            const response = await fetch(url);
            const result = await response.text();


            // console.log(result);

            // Create an div to store the text of the result from the server

            const div = document.createElement('div');

            div.innerHTML = result;

            let anchorTagFromText = div.getElementsByTagName('a');
            console.log(anchorTagFromText);
            console.log(typeof anchorTagFromText);

            // Filtering out only the sub-folders inside the songs folder
            let folderLink = [...anchorTagFromText].filter(a => a.classList.contains('icon-directory'));
            console.log(folderLink);
            let newFolders = folderLink.slice(1, folderLink.length);
            console.log("newFolder: ", newFolders);

            newFolders.forEach((folder) => {
                renderFolder(folder);

            });
        } catch (error) {
            console.log("fail to fetch songs", error);

        }



        // RenderFolders to the DOM

        function renderFolder(folder) {

            // displaySongFolderContainerEl.innerHTML = '';
            displaySongFolderContainerEl.classList.remove('hidden');

            let folderHref = folder.href;
            let folderTitle = folder.title;


            // Create an div element to store each folder

            const folderDiv = document.createElement('div');

            folderDiv.innerHTML = `
           <div class="aspect-square w-[100px] md:w-[120px] lg:w-[150px] bg-black">
                    <div>
                    <p class="text-white">${folderTitle}</p>
                    <img src="${folderHref}/cover.jpg" alt= "${folderTitle}">
                    </div>
            </div>
            `

            displaySongFolderContainerEl.appendChild(folderDiv);

            //    When cliked on a folder, show that folder related songs
            folderDiv.addEventListener('click', () => {

            })

        }

    }

});
