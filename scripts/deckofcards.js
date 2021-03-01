"use strict";

// Set up eventlistners
const btnDrawACard = document.querySelector('#btnDrawACard').addEventListener('click', GetDeck);

// Här sparar jag globala variabler
let app = { 
    // true om vi har en kortlek
    hasDeck: false,
    // true om vi skall blanda om kortleken
    shuffelDeck: false,
    // id för den kortlek som används
    deckId: ''
};



/*
    function som skapar en ny kortlek
*/
function GetDeck()
{
    
    if(app.hasDeck === false)
    {
        app.shuffelDeck = false;
        app.hasDeck = false;
        app.deckId = '';
    
        fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
            .then(res => res.json())
            .then(data => {
                console.log('GetDeck: ' + data.success + ', ' + data.deck_id + ', ' + data.remaining + ', ' + data.shuffled); 

                if(data.success === true)
                {// Vi har en ny kortlek
                    app.hasDeck = true;
                    app.shuffelDeck = false;
                    app.deckId = data.deck_id;

                    // Hämta kort
                    GetCard();
                }
            })
            .catch(err => {
                console.error(err);
        })     
    }
    else
    {
        GetCard();
    }
}


/* 
    function som blandar om en tidigare hämtad kortlek
*/
function ShuffleDeck()
{
    if(app.shuffelDeck === true)
    {
        fetch(`https://deckofcardsapi.com/api/deck/${app.deckId}/shuffle/`)
        .then(res => res.json())
        .then(data => {
            console.log('ShuffleDeck: ' + data.success + ', ' + data.deck_id + ', ' + data.remaining + ', ' + data.shuffled); 

            if(data.success === true)
            {// Vi har blandat om kortleken
                app.shuffelDeck = false;
                app.hasDeck = true;
                app.deckId = data.deck_id;

                // Hämta kort
                GetCard();
            }
        })
        .catch(err => {
            console.error(err);
        })     
    }
}


/* 
    function som hämtar ett spelkort från en tidigare skapad kortlek
*/
function GetCard()
{
    if(app.hasDeck === true)
    {
        fetch(`https://deckofcardsapi.com/api/deck/${app.deckId}/draw/?count=1`)
            .then(res => res.json())
            .then(data => {
                console.log('GetCard: ' + data.success + ', ' + data.deck_id + ', ' + data.remaining); 

                if(data.success === true)
                {// Vi har fått en spelkort. Visa kortet
                    ShowCard(data);
                } 
                else
                {// Alla kort är dragna. Blanda om korleken
                    app.shuffelDeck = true;
                    ShuffleDeck();
                }               
            })
            .catch(err => {
            console.error(err);
        })
    }    
}


/*
    function som visar kortet i gui
*/
function ShowCard(data)
{
    // divCard  Yttre div som skall visas
    // divImage Inre div som skall innehålla image

    if(data)
    {
        if(data.success)
        {            
            // Vi skall visa ett kort. Visa div som skall innehålla bilden av spelkortet
            document.getElementById('divCard').removeAttribute('hidden');

            // Skapa bilden
            let imageElement = document.createElement('img');
            imageElement.src = data.cards[0].image;
            let strAltText = data.cards[0].suit + ' ' + data.cards[0].value;
            imageElement.setAttribute('title', strAltText);
            imageElement.setAttribute('alt', strAltText);

            // Lägg till image i div
            let divImage = document.getElementById('divImage');   
            divImage.textContent = '';            
            divImage.appendChild(imageElement);

            // Skapa en paragraph där jag visar id för kortleken
            let newParagraph = document.createElement('p');
            let newTextNode = document.createTextNode(data.deck_id);
            newParagraph.appendChild(newTextNode);

            // Lägg till paragraph till image i div
            divImage.appendChild(newParagraph);
        }
    }
}