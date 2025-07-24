export async function request(url = '', options = { method: "GET" }) {
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    // await delay(5000);
    const data = await fetch(url, options);
    if (!data.ok) {
        throw new Error("Error occurred while processing the request: " + data.statusText + " " + data.status);
    }
    return data.json();
}

export const createElement = ({ tagName, src, value, className, id }) => {
    const tag = document.createElement(tagName);
    if (tagName === "a") {
        tag.href = src;
    } else if (tagName === "img") {
        tag.src = src;
        tag.alt = value
    }else if (tagName === "button") {
    }
    if (value) {
        tag.innerText = value;
    }
    if(className){
        tag.classList.add(className);
    }
    if(id){
        tag.id = id;
    }
    
    return tag;
}

export const showNavMenu = () => {
    const btns = document.querySelector(".btns");
    request("https://futuramaapi.com/api/characters").then(data => {
        const newTags = Object.keys(data).map((keys) => {
            return createElement({ tagName: "a", src: `/${keys}`, value: keys, className: "button" });
        })
        btns.append(...newTags);
    });

}

export const showCharacters = () => {
    const characters = document.querySelector("#characters");
    document.querySelector(".modal-loader").classList.add("active")
    request("https://futuramaapi.com/api/characters")
    .then(data => {
        console.log(data.items)
        if(Array.isArray(data.items) && data.items.length > 0){
            const item = data.items.map(ch => {
                // console.log(ch)
                return showCards(ch)
            })
            characters.append(...item);
        }
        document.querySelector(".modal-loader").classList.remove("active")
    })
    .catch((error) => {
        throw new Error(error)
    });
    
}  
    const modal = document.getElementById("myModal");
    // const btn = document.getElementsByClassName(".viewButton");
    const btn = document.getElementById("myBtn");
    const span = document.getElementsByClassName("close")[0];

    // Open modal on button click
    btn.addEventListener("click", () => {
        modal.style.display = "block";
        showCharacter("1");
    });
    // Close modal on <span> click
    span.addEventListener("click", () => {
        modal.style.display = "none";
    });
    // Close modal on click outside the modal
    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

export const showCharacter = (character_id) => {
    const modal = document.querySelector("#myModal");
    document.querySelector(".modal-loader").classList.add("active")
    request(`https://futuramaapi.com/api/characters/${character_id}`)
    .then(data => {
        if(data){
            console.log(data)
            const details = showCard(data);
            modal.append(details);
        }
        document.querySelector(".modal-loader").classList.remove("active")
    })
    .catch((error) => {
        throw new Error(error)
    });
}  
function showCards(characters) {
    const {id, image, name, species, status, gender, createdAt } = characters;
    const imageCh = createElement({ tagName: "img", src: image, value: name, className: "image" });
    const nameCh = createElement({ tagName: "h2", value: name });
    const viewBt = createElement({ tagName: "button", value: "View", className: "viewButton", id: id });
    const containerCh = createElement({ tagName: 'div', className: "characters-container" });
    const containerChDesc = createElement({ tagName: 'div'});
    containerChDesc.append(nameCh, viewBt)
    containerCh.append(imageCh, containerChDesc);

    return containerCh
}

function showCard(character) {
    const {id, image, name, species, status, gender, createdAt } = character;
    const imageCh = createElement({ tagName: "img", src: image, value: name, className: "image" });
    const nameCh = createElement({ tagName: "h2", value: name });
    const speciesCh = createElement({ tagName: "div", value: "Species: " + species.toLowerCase() });
    let statusCh = ""
    if (status === 'DEAD'){
        statusCh = createElement({ tagName: "div", value: "Status: " + status, className: "textColorRed" });
    }else{
        statusCh = createElement({ tagName: "div", value: "Status: " + status.toLowerCase() });
    }
    const genderCh = createElement({ tagName: "div", value: "Gender: " + gender.toLowerCase() });
    const createdAtCh = createElement({ tagName: "div", value: "Created: " + setDateEn(createdAt) });
    // const closeBt = createElement({ tagName: "button", value: "Close", id: "closeButton" });
    const containerChDesc = createElement({ tagName: 'div'});
    containerChDesc.append(nameCh, speciesCh, statusCh, genderCh, createdAtCh) //,closeBt
    
    const modalContent = document.querySelector(".modal-content");
    const oldCharacter = modalContent.querySelector(".character-container");
    if (oldCharacter) {
        oldCharacter.remove();  
    }

    const containerCh = createElement({ tagName: 'div', className: "character-container" });
    containerCh.append(imageCh, containerChDesc);
    modalContent.append(containerCh);
    return modalContent
}

function setDateEn (isoString) {
    const date = new Date(isoString)
    const year = date.getFullYear();
    const month = date.getMonth();
    const monthEn = date.toLocaleString('en-En', {month: 'long'});
    const day = date.getDate();
    const hours = date.getHours().toString().padStart(2, 0);
    const minutes = date.getMinutes().toString().padStart(2, 0);

    return `${day} ${monthEn} ${year} at ${hours}:${minutes}`
}

// {id: 1, name: 'Philip J. Fry', gender: 'MALE', status: 'ALIVE', species: 'HUMAN', …}
// createdAt: "2023-12-02T18:32:33.122015Z"
// gender: "MALE"
// id: 1
// image: "https://futuramaapi.com/static/img/human/philip-j_-fry.webp"
// name: "Philip J. Fry"
// species: "HUMAN"
// status: "ALIVE"
// [[Prototype]]: Object