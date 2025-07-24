export async function request(url = '', options = { method: "GET" }) {
    const data = await fetch(url, options);
    if (!data.ok) {
        throw new Error("Error occurred while processing the request: " + data.statusText + " " + data.status);
    }
    return data.json();
}

export const createElement = ({ tagName, src, value, className }) => {
    const tag = document.createElement(tagName);
    if (tagName === "a") {
        tag.href = src;
    } else if (tagName === "img") {
        tag.src = src;
        tag.alt = value
    }

    if(className){
        tag.classList.add(className);
    }
    if (value) {
        tag.innerText = value;
    }

    return tag;
}
export const showNavMenu = () => {
    const btns = document.querySelector(".btns");
    request("https://futuramaapi.com/api/characters").then(data => {
        console.log(data)
        const newTags = Object.keys(data).map((keys) => {
            return createElement({ tagName: "a", src: `/${keys}`, value: keys, className: "button" });
        })
        console.log(newTags)
        btns.append(...newTags);
    });

}

export const showCharacters = () => {
    const characters = document.querySelector("#characters");
    request("https://futuramaapi.com/api/characters")
    .then(data => {
        console.log(data.items)
        if(Array.isArray(data.items) && data.items.length > 0){
            const item = data.items.map(ch => {
                return showCards(ch)
            })
            characters.append(...item);
        }
    })
}   
function showCards(characters) {
    const {image, name, species, status, gender, createdAt } = characters;
    const imageCh = createElement({ tagName: "img", src: image, value: name, className: "image" });
    const nameCh = createElement({ tagName: "h2", value: name });
    const speciesCh = createElement({ tagName: "div", value: "Species: " + species.toLowerCase() });
    let statusCh = ""
    console.log(status)
    if (status === 'DEAD'){
        statusCh = createElement({ tagName: "div", value: "Status: " + status, className: "textColorRed" });
    }else{
        statusCh = createElement({ tagName: "div", value: "Status: " + status.toLowerCase() });
    }
    const genderCh = createElement({ tagName: "div", value: "Gender: " + gender.toLowerCase() });
    const createdAtCh = createElement({ tagName: "div", value: "Created: " + setDateEn(createdAt) });
    const containerCh = createElement({ tagName: 'div', className: "characters-container" });
    const containerChDesc = createElement({ tagName: 'div'});
    containerChDesc.append(nameCh, speciesCh, statusCh, genderCh, createdAtCh)
    containerCh.append(imageCh, containerChDesc);

    return containerCh
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