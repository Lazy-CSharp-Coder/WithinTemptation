const playlist = [ new Audio("AudioTracks/01 - Why Not Me.mp3"),  
                    new Audio("AudioTracks/02 - Shot In The Dark.mp3"),
                   new Audio("AudioTracks/03 - In The Middle Of The Night.mp3"),    
                  new Audio("AudioTracks/04 - Faster.mp3"),
                  new Audio("AudioTracks/05 - Fire And Ice.mp3"),    
                  new Audio("AudioTracks/06 - Iron.mp3"),
                   new Audio("AudioTracks/07 - Where Is The Edge.mp3"),    
                   new Audio("AudioTracks/08 - Sinead.mp3"),
                   new Audio("AudioTracks/09 - Lost.mp3"),    
                   new Audio("AudioTrackc/10 - Murder.mp3"),
                   new Audio("AudioTrackc/11 - A Demons's Fate.mp3"),    
                   new Audio("AudioTrackc/12 - Stairway To The Skies.mp3"),
                 ];

const songNameList = [ "Why Not Me", "Shot In The Dark", "In The Middle Of The Night", "Faster", "Fire And Ice", "Iron", "Where Is The Edge", "Sinead", "Lost", "Murder", "A Demon's Fate", "Stairway To The Skies"];
let isPlaying = false;
let songPlaying = 0;

const nowPlayingText = document.querySelector("#nowPlayingText");
const recordIcon = document.querySelector("#recordIcon");
const playIconFileName = "/Icons/playwhite.png";
const pauseIconFileName = "/Icons/pause.png";

function playNextSong()
{
    if(isPlayingTrack)
    {
        listIconsArray[trackNumberPlaying].play.classList.remove("hide");
        listIconsArray[trackNumberPlaying].pause.classList.add("hide");
        playlist[trackNumberPlaying].pause();
        playlist[trackNumberPlaying].currentTime = 0;
        
    }

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
    if(seconds < 10) seconds = "0" + seconds;
 
    console.log(seconds);

    return `${minutes} : ${seconds}`;

}

let isPlayingTrack = false;
let trackNumberPlaying = -1;

const listIconsArray = [];

function addTracksToList() 
{
    const tracks = document.querySelector("#tracks");
    console.log(tracks);
    
    let delay = 0;
    const delayInc = 200;

    for(let i = 0; i < playlist.length; ++i)
    {
        playlist[i].load();

        playlist[i].addEventListener("loadedmetadata", function() 
        {
            const newListItem = document.createElement("li");
            const songNumber = document.createElement("p");
            const playIcon = document.createElement("img");
            const pauseIcon = document.createElement("img");
            const songTitle = document.createElement("p");
            const songLength = document.createElement("p");
           
            songNumber.textContent = i+1;
            playIcon.src = playIconFileName;
            pauseIcon.src = pauseIconFileName;
                           
            listIconsArray.push({play : playIcon, pause : pauseIcon});
            console.log(listIconsArray);

            playIcon.classList.add("playIcon");
            pauseIcon.classList.add("hide");
            pauseIcon.classList.add("pauseIcon");
            
            // legg inn eventlistener for play icon for hver track

            playIcon.addEventListener("click", function() 
            {
                if(isPlayingTrack)
                {
                    playlist[trackNumberPlaying].pause()
                    playlist[trackNumberPlaying].currentTime = 0;
                    console.log(listIconsArray);
                    console.log(listIconsArray[trackNumberPlaying])
            
                    listIconsArray[trackNumberPlaying].play.classList.remove("hide");
                    listIconsArray[trackNumberPlaying].pause.classList.add("hide");
                }
                playlist[i].play();
                
                trackNumberPlaying = i;
                isPlayingTrack = true;
                playlist[i].addEventListener("playing", function()
                {
                    playIcon.classList.add("hide");
                    pauseIcon.classList.remove("hide");
                });
                  
                playlist[i].addEventListener("ended", function()
                {
                    pauseIcon.classList.add("hide");
                    playIcon.classList.remove("hide");
                    isPlayingTrack = false;
                    trackNumberPlaying = -1;

                });
        

            });

            pauseIcon.addEventListener("click", function() 
            {
                playlist[i].pause();
                playIcon.classList.remove("hide");
                pauseIcon.classList.add("hide");

            });
    

            songTitle.textContent = songNameList[i];
            console.log(playlist[i].duration);
            songLength.textContent = getTrackTime(playlist[i].duration);
    
            newListItem.appendChild(songNumber);
            newListItem.appendChild(playIcon);
            newListItem.appendChild(pauseIcon);
            newListItem.appendChild(songTitle);
            newListItem.appendChild(songLength);
         
                
            setTimeout(()=> { tracks.appendChild(newListItem);  newListItem.classList.add("scaleInAnim") }, delay);
            delay += delayInc;
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

function rotateCoverOut()
{  
    const coverImage = document.querySelector("#coverImage");
    coverImage.classList.remove("rotateYInAnim");
    coverImage.classList.add("rotateYOutAnim");

    
    const albumTitleText = document.querySelector("#albumTitleText");
    albumTitleText.classList.add("rotateYOutAnim");

    coverImage.addEventListener("animationend", function()
    {

        coverImage.src = "/Album/theheartofeverything.png";
        coverImage.classList.remove("rotateYOutAnim");
        coverImage.classList.add("rotateYInAnim");

        // const albumTitleText = document.querySelector("#albumTitleText");
        albumTitleText.classList.remove("rotateYOutAnim");
        albumTitleText.classList.add("rotateYInAnim");

        albumTitleText.textContent = "The Heart Of Everything";


    }, {once:true});

}

const menuChoice = document.querySelector("#heartOfEverything");
menuChoice.addEventListener("click", rotateCoverOut);





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