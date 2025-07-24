import { request, showNavMenu, showCharacters, showCharacter } from "./methods.js";

if(document.location.pathname === "/index.html"){
    showNavMenu();
}else if(document.location.pathname === "/characters/"){
    showCharacters();
}