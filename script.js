
import { albums } from "./js/albums.js";
// data containing album playing

let isPlayingTrack = false; // related to complete track list
let trackNumberPlaying = 0;

let isPlaying = false;  // related to play button 
let songPlaying = 0;
let currentAlbum = 0;

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
        albums[currentAlbum].tracks[trackNumberPlaying].audio.pause();
        albums[currentAlbum].tracks[trackNumberPlaying].audiocurrentTime = 0;
    }

    if(songPlaying < albums[currentAlbum].tracks.length)
    {
  
        const newtrack = albums[currentAlbum].tracks[trackNumberPlaying];
        newtrack.audio.play();
        
        nowPlayingText.textContent = newtrack.title;
            
        newtrack.audio.addEventListener("ended", () => { trackNumberPlaying++; playNextSong(); });
    }
    else 
    {
        trackNumberPlaying = 0;
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
        albums[currentAlbum].tracks[trackNumberPlaying].audio.pause();
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
    let seconds = Math.floor(timeInSeconds - (minutes * 60));
    if(seconds < 10) seconds = "0" + seconds;
 
    console.log(seconds);

    return `${minutes} : ${seconds}`;

}

function loadMetaData()
{
    for(let j = 0; j < albums.length; ++j)
    {
        const numTracks = albums[j].tracks.length;
        for(let i = 0; i < numTracks; ++i)
        {
            const currTrack = albums[j].tracks[i];
            currTrack.audio.load();
            currTrack.audio.addEventListener("loadedmetadata", function() 
            {
                currTrack.time = getTrackTime(currTrack.audio.duration);
            
            });
        }
    }
    

}
const load = new Promise((resolve, reject) => 
    {
        loadMetaData();
        resolve("meta data loaded");

    }); 


let isAlbumListVisible = false;

function switchAlbums(newAlbum)
{  
    const coverImage = document.querySelector("#coverImage");
    coverImage.classList.remove("rotateYInAnim");
    coverImage.classList.add("rotateYOutAnim");
    
    const albumTitleText = document.querySelector("#albumTitleText");
    albumTitleText.classList.add("rotateYOutAnim");

    coverImage.addEventListener("animationend", function()
    {

        coverImage.src = albums[newAlbum].albumCover;
        coverImage.classList.remove("rotateYOutAnim");
        coverImage.classList.add("rotateYInAnim");

        // const albumTitleText = document.querySelector("#albumTitleText");
        albumTitleText.classList.remove("rotateYOutAnim");
        albumTitleText.classList.add("rotateYInAnim");

        albumTitleText.textContent = albums[newAlbum].albumName;

        // skjekk variabler, currentAlbum har blitt nytt album - fiks  
        if(isPlaying)
        {
            albums[currentAlbum].tracks[trackNumberPlaying].audio.pause();
            isPlayingTrack = false;
        }
  

    }, {once:true});

}


function displayAlbumSubMenu()
{
    const albumSubMenuList = document.querySelector("#albumSubMenuList");
    // while(albumSubMenuList.lastChild) albumSubMenuList.remove(albumSubMenuList.lastChild);

    for(let i = 0; i < albums.length; ++i)
    {
        if(isAlbumListVisible)
        {

            const childNodes = Array.from(albumSubMenuList.children);
            for(let i = 0; i < childNodes.length; ++i)
            {
                childNodes[i].remove();
             
                 
            }
            console.log("list removed");
           isAlbumListVisible = false;
           return;
        }
        const newItem = document.createElement("li");
        newItem.textContent = albums[i].albumName;
        newItem.classList.add("subMenuItem", "scaleInAnim");
        albumSubMenuList.appendChild(newItem);

        newItem.addEventListener("click", function() 
        { 
           
            albumHasChanged = true;
            switchAlbums(i);
            currentAlbum = i;
           
            loadAlbumTracksWithAnim();

        });
    };
}





const listIconsArray = [];

async function addTracksToList() 
{

  
    const tracks = document.querySelector("#tracks");
    while(tracks.lastChild) tracks.removeChild(tracks.lastChild);
    console.log(tracks);

    let delay = 0;
    const delayInc = 200;
    const numTracks = albums[currentAlbum].tracks.length;

    for(let i = 0; i < numTracks; ++i)
    {        
        const newListItem = document.createElement("li");
        const songNumber = document.createElement("p");
        const playIcon = document.createElement("img");
        const pauseIcon = document.createElement("img");
        const songTitle = document.createElement("p");
        const songLength = document.createElement("p");
        
        songNumber.textContent = albums[currentAlbum].tracks[i].nr;
        songTitle.textContent = albums[currentAlbum].tracks[i].title;
        songLength.textContent = albums[currentAlbum].tracks[i].time;
        playIcon.src = playIconFileName;
        pauseIcon.src = pauseIconFileName;
                   
            
        console.log(listIconsArray);

        playIcon.classList.add("playIcon");
        pauseIcon.classList.add("hide");
        pauseIcon.classList.add("pauseIcon");
        
        // legg inn eventlistener for play icon for hver track

        playIcon.addEventListener("click", function() 
        {
            if(isPlayingTrack)
            {
                albums[currentAlbum].tracks[trackNumberPlaying].audio.pause()
                albums[currentAlbum].tracks[trackNumberPlaying].audio.currentTime = 0;
        
                listIconsArray[trackNumberPlaying].play.classList.remove("hide");
                listIconsArray[trackNumberPlaying].pause.classList.add("hide");
            }
            trackNumberPlaying = i;
            const trackPlayingNow = albums[currentAlbum].tracks[trackNumberPlaying];
            trackPlayingNow.audio.play();
                       
            isPlayingTrack = true;
            trackPlayingNow.audio.addEventListener("playing", function()
            {
                playIcon.classList.add("hide");
                pauseIcon.classList.remove("hide");
            });
                
            trackPlayingNow.audio.addEventListener("ended", function()
            {
                pauseIcon.classList.add("hide");
                playIcon.classList.remove("hide");
                isPlayingTrack = false;
                trackNumberPlaying = -1;

            });
    
        });

        pauseIcon.addEventListener("click", function() 
        {
            albums[currentAlbum].tracks[trackNumberPlaying].audio.pause();
            playIcon.classList.remove("hide");
            pauseIcon.classList.add("hide");

        });

        newListItem.appendChild(songNumber);
        newListItem.appendChild(playIcon);
        newListItem.appendChild(pauseIcon);
        newListItem.appendChild(songTitle);
        newListItem.appendChild(songLength);
                    
        setTimeout(()=> { tracks.appendChild(newListItem);  newListItem.classList.add("scaleInAnim");  listIconsArray[i] = {play : playIcon, pause : pauseIcon};   }, delay);
        delay += delayInc;

        
    }; 
}


// sett opp at sporene skal animeres inn når man når ett visst sted på skjermen

window.addEventListener("scroll", loadAlbumTracksWithAnim);

let listIsLoaded = false;
const limitScrollYPos = 700;
let albumHasChanged = false;

function loadAlbumTracksWithAnim()
{
    const currentScrollPos = window.scrollY;

    if(currentScrollPos > limitScrollYPos && (!listIsLoaded || albumHasChanged))
    {
        
        addTracksToList();
        listIsLoaded = true; 
        albumHasChanged = false;
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
    const studioAlbumChoice = document.querySelector("#studioAlbumChoice");
    studioAlbumChoice.addEventListener("click", function() 
    {

        displayAlbumSubMenu();
        isAlbumListVisible = true;
    });
 
}


const hamburgerIcon = document.querySelector("#hamburgerIcon");
hamburgerIcon.addEventListener("click", hamburgerToggle);

const closeMenuImg = document.querySelector("#closeMenuImg");
closeMenuImg.addEventListener("click", hamburgerToggle);