const playlist = [ new Audio("Album/tracks/01 - Why Not Me.mp3"),    
                //    new Audio("Album/tracks/02 - Shot In The Dark.mp3"),
                //    new Audio("Album/tracks/03 - In The Middle Of The Night.mp3"),    
                //    new Audio("Album/tracks/04 - Faster.mp3"),
                //    new Audio("Album/tracks/05 - Fire And Ice.mp3"),    
                //    new Audio("Album/tracks/06 - Iron.mp3"),
                //    new Audio("Album/tracks/07 - Where Is The Edge.mp3"),    
                //    new Audio("Album/tracks/08 - Sinead.mp3"),
                //    new Audio("Album/tracks/09 - Lost.mp3"),    
                //    new Audio("Album/tracks/10 - Murder.mp3"),
                //    new Audio("Album/tracks/11 - A Demons's Fate.mp3"),    
                //    new Audio("Album/tracks/12 - Stairway To The Skies.mp3"),
                 ];

const songNameList = [ "Why Not Me", "Shot In The Dark", "In The Middle Of The Night", "Faster", "Fire And Ice", "Iron", "Where Is The Edge", "Sinead", "Lost", "Murder", "A Demon's Fate", "Stairway To The Skies"];
let isPlaying = false;
let songPlaying = 0;

const nowPlayingText = document.querySelector("#nowPlayingText");
const recordIcon = document.querySelector("#recordIcon");
const playIconFileName = "/Icons/playwhite.png";

function playNextSong()
{
    if(songPlaying < playlist.length)
    {
        playlist[songPlaying].play();
        
        nowPlayingText.textContent = songNameList[songPlaying];
            
        playlist[songPlaying].addEventListener("ended", () => { songPlaying++; playNextSong(); });
    }
    else 
    {
        songPlaying = 0;
        nowPlayingText.style.animationIteration = "0";
        playButtonToggle();
    }
}


function playButtonToggle()
{
    const playIcon = document.querySelector("#playIcon");
    const pauseIcon = document.querySelector("#pauseIcon");
    if(isPlaying)
    {
        pauseIcon.classList.add("hide");
        playIcon.classList.remove("hide");
        playlist[songPlaying].pause();
        isPlaying = false;
        recordIcon.style.animationIterationCount = "0";
    }
    else
    {

        recordIcon.style.animationIterationCount = "infinite";
        pauseIcon.classList.remove("hide");
        playIcon.classList.add("hide");
        isPlaying = true;
        playNextSong();
    }
}

const playButton = document.querySelector("#playButton");
playButton.addEventListener("click", playButtonToggle);

let isHamburgerVisible = false;

function getTrackTime(timeInSeconds)
{
    const minutes = Math.floor(timeInSeconds/60);
    console.log(minutes);
    const seconds = Math.floor(timeInSeconds - (minutes * 60));
    if(seconds.length == 1) seconds = "0" + seconds;
    console.log(seconds);

    return `${minutes} : ${seconds}`;

}


function addTracksToList() 
{
    const tracks = document.querySelector("#tracks");
    console.log(tracks);
    
    for(let i = 0; i < playlist.length; ++i)
    {
        playlist[i].load();

        playlist[i].addEventListener("loadedmetadata", function() 
        {
            const newListItem = document.createElement("li");
            const songNumber = document.createElement("p");
            const playIcon = document.createElement("img");
            const songTitle = document.createElement("p");
            const songLength = document.createElement("p");
           
            songNumber.textContent = i+1;
            playIcon.src = playIconFileName;
            playIcon.classList.add("playIcon");
            songTitle.textContent = songNameList[i];
            console.log(playlist[i].duration);
            songLength.textContent = getTrackTime(playlist[i].duration);
    
            newListItem.appendChild(songNumber);
            newListItem.appendChild(playIcon);
            newListItem.appendChild(songTitle);
            newListItem.appendChild(songLength);
    
            tracks.appendChild(newListItem);
            newListItem.classList.add("slideInTopAnim");

        });
       
    }
}


// sett opp at sporene skal animeres inn når man når ett visst sted på skjermen

window.addEventListener("scroll", loadAlbumTracksWithAnim);

let listIsLoaded = false;
const limitScrollYPos = 700;

function loadAlbumTracksWithAnim()
{
    const currentScrollPos = window.scrollY;

    if(currentScrollPos > limitScrollYPos && !listIsLoaded)
    {
        addTracksToList();
        listIsLoaded = true;
    }
    
}





// hamburger meny som kommer inn fra siden



function hamburgerToggle()
{
    const slideInMenuNav = document.querySelector("#slideInMenuNav");
    if(!isHamburgerVisible)
    {    
        slideInMenuNav.classList.remove("hide");
        slideInMenuNav.classList.add("flex");
        slideInMenuNav.classList.add("slideInRightAnim");
        isHamburgerVisible = true;

    }
    else
    { 
        slideInMenuNav.classList.remove("slideInRightAnim");
        slideInMenuNav.classList.add("slideOutRightAnim");
        slideInMenuNav.addEventListener("animationend", function() 
        {
            slideInMenuNav.classList.remove("flex");
            slideInMenuNav.classList.add("hide");
            slideInMenuNav.classList.remove("slideOutRightAnim");
        }, {once: true});

        isHamburgerVisible = false;

    }

}

const hamburgerIcon = document.querySelector("#hamburgerIcon");
hamburgerIcon.addEventListener("click", hamburgerToggle);

const closeMenuImg = document.querySelector("#closeMenuImg");
// console.log(menuExitImg);
closeMenuImg.addEventListener("click", hamburgerToggle);