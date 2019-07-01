const aspectRatio = "4:3";
const dimensions = "192x144";
const defaultPoster = "../images/default.jpg";

// generic handler for showing error message
function showErrorMessage(msg) {
  var element = document.querySelector(".container");

  var paragraph = document.createElement("p");

  // prepare error message
  paragraph.innerHTML = `<span>${msg}</span>`;

  // append error message element
  element.append(paragraph);
}

function fetchMLBData() {
  return new Promise((resolve, reject) => {
    // get today's date and use that to query server
    var today = new Date();
    var date = `${today.getFullYear()}-${(today.getMonth() + 1)}-${today.getDate()}`;

    /* Even though I have customized the URL to dynamically show MLB photos for today's game, 
    I have seen that sometimes there is no photos for "today". And therefore to test my code and use it, 
    sometimes I had to use data for previous dates, just like I have done here.
    
    PLEASE uncomment line 30 and comment out line 31 if you want to fetch today's data */

    var mlbURL = `http://statsapi.mlb.com/api/v1/schedule?hydrate=game(content(editorial(recap))),decisions&date=${date}&sportId=1`;
    // var mlbURL = "http://statsapi.mlb.com/api/v1/schedule?hydrate=game(content(editorial(recap))),decisions&date=2018-06-10&sportId=1";

    var xhr = new XMLHttpRequest();
    xhr.timeout = 2000;

    xhr.open("GET", mlbURL, true);

    xhr.onload = () => {
      if (xhr.status == 200) {
        resolve(xhr.response);
      } else {
        reject(`Error Status is ${xhr.status} : ${xhr.statusText}`);
      }
    };

    xhr.onerror = () => {
      reject(`Request did not go through!`);
    };

    xhr.ontimeout = function () {
      reject(`Server took longer than expected. Timed out after ${xhr.timeout}`);
    }

    xhr.send();
  });
}

function parseMLBData(data) {
  // get all games for the current date

  var allGames = JSON.parse(data).dates[0].games;

  /* For each game, parse out 4:3 photo, headline, description for the main thumbnail.
    Also parse out details for the details overlay
    Only do this for games that have content->editorial->recap->mlb->photo->cuts
    Assumption: Choose photo aspect ratio 4:3 with dimension 192x144
  */

  var gameInfoObject = allGames.reduce((result, game) => {
    if (game.content.editorial.recap.mlb && game.content.editorial.recap.mlb.photo && game.content.editorial.recap.mlb.photo.cuts) {
      if (game.content.editorial.recap.mlb.photo.cuts[dimensions] && game.content.editorial.recap.mlb.photo.cuts[dimensions]["aspectRatio"] === aspectRatio) {
        result.push({
          "headline": game.content.editorial.recap.mlb.headline,
          "description": game.content.editorial.recap.mlb.seoTitle,
          "photoURL": game.content.editorial.recap.mlb.photo.cuts[dimensions]["src"],
          "details": {
            "keywords": game.content.editorial.recap.mlb.seoKeywords,
            "title": game.content.editorial.recap.mlb.seoTitle,
          }
        })
      }
    }
    return result;
  }, []);

  return gameInfoObject;
}

function displayDetails(event) {
  // add class "display" to the selected thumbnail/item to show details overlay
  var detailsOverlay = document.querySelector(".item.selected .overlayDetails");

  detailsOverlay.classList.remove("displayNone");
  detailsOverlay.classList.add("display");
}

function enableNavigation() {
    var items = document.querySelectorAll('.container .item');

    var noOfItems = items.length;

    // assign id to each image/cell
    items.forEach((item, key) => {
        item.id = key;
    });

    var items = document.querySelectorAll(".container .item");
    var keyupCallback = function (e) {
        switch (e.which) {
            case 37: // left
                move(1, noOfItems);
                break;
            case 38: // up
                move(2, noOfItems);
                break;
            case 39: // right
                move(3, noOfItems);
                break;
            case 40: // down
                move(4, noOfItems);
                break;
            case 13: // enter/OK
                displayDetails(e);
            default: return; // exit this handler for other keys
        }

        e.preventDefault(); // prevent the default action (scroll / move )
    };

    items.forEach((i) => {
        i.addEventListener("keyup", keyupCallback, false);
    });

}

function move(direction, noOfItems){
  var cur_id = parseInt(document.querySelector('.item.selected').getAttribute('id'));
 	switch(direction){
        case 1://left
        selectItemAndShiftOthers(cur_id-1, noOfItems);
            break;
        case 2://up
            // do nothing. stay at the same selected item
            break;
        case 3://right
        selectItemAndShiftOthers(cur_id+1, noOfItems);
            break;
        case 4://down
            // do nothing. stay at the same selected item
            break;
         
    }
}

function cleanUpClassNames(onlyDetails) {
    var selectedItem = document.querySelector('.container .item.selected');
    
     // remove "display" from current item/thumbnail
    var detailsOverlay = document.querySelector(".item.selected .overlayDetails");

    !onlyDetails && selectedItem && selectedItem.classList.remove('selected');
    detailsOverlay && detailsOverlay.classList.remove("display");
    detailsOverlay && detailsOverlay.classList.add("displayNone");
}

function selectItemAndShiftOthers(id, noOfItems) {
    // add selected class to the correct item
    if (id > (noOfItems - 1)) {
        // end of list. stay there
        id = noOfItems - 1;

        cleanUpClassNames(true);

        return;
    } else if (id < 0) {
        // start of list. stay there.
        id = 0;

        cleanUpClassNames(true);

        return;
    }

    // cleanup classNames
    // remove "selected" from current item/thumbnail
    cleanUpClassNames();

    // set focus on new item
    var newSelectedItem = document.getElementById(id);
    newSelectedItem.focus();

    // this will shift other items in CSS
    // this will also scale selected item and fade out other game items in CSS
    newSelectedItem.classList.add('selected');
}

function createCarousel(gameInfo) {
  // create list of images and overlays
  var container = document.querySelector(".inner__container");

  /* for each game:
   1. create img element 
   2. create headline
   3. create description
   4. create details overlay, although initially set display: none 
   */ 
  for (let i = 0; i < gameInfo.length; i++) {
    var imageURL = gameInfo[i]["photoURL"];

    // create cell
    var itemDiv = document.createElement("div");
    itemDiv.className = "item";
    itemDiv.tabIndex = "0";

    // add image element
    var image = document.createElement("img");

    // show default image until poster is downloaded
    image.src = defaultPoster;

    // download the image
    var downloadingImage = new Image();

    downloadingImage.onload = (function (img) {
      return function () {
        img.src = this.src;
      }
    })(image);

    downloadingImage.src = imageURL;

    // add the headline and description
    var headline = document.createElement("div");
    headline.className = "headline";
    headline.innerHTML = gameInfo[i]["headline"];

    var description = document.createElement("div");
    description.className = "description";
    description.innerHTML = gameInfo[i]["description"]

    // add details overlays
    var overlayDetails = document.createElement("div");
    overlayDetails.classList = "overlayDetails displayNone";

    var paragraph = document.createElement("p");

    paragraph.innerText = `
    Title: ${gameInfo[i]["details"]["title"]}



    Highlights: ${gameInfo[i]["details"]["keywords"]}`;

    overlayDetails.appendChild(paragraph);

    // append children to parent container
    itemDiv.appendChild(headline);
    itemDiv.appendChild(image);
    itemDiv.appendChild(description);
    itemDiv.appendChild(overlayDetails);
    
    // append item to container
    container.append(itemDiv);
  }
}

// IIFE main function to start the fun!
(async function main() {
    // Fetch MLB data and parse it 
    try {
      var data = await fetchMLBData();

      // check if any data is returned 
      var gameInfo =  parseMLBData(data);
      // var gameInfo =  parseMLBData(fakedata);

      if (gameInfo.length === 0) {
        // no MLB photos found 
        throw("There are no MLB games for today!")
      }

    } catch(err) {
        showErrorMessage(`${err} Please try again later.`);
        return;
    };

    // create DOM structure
    createCarousel(gameInfo);

    // enable navigation
    enableNavigation();

    // set focus on inner container that contains the items
    var innerContainer = document.querySelector(".inner__container");
    innerContainer.classList.add("selected");

    // by default, select the first item in the list
    var items = document.querySelectorAll('.container .item');

    selectItemAndShiftOthers(0, items.length);

})();

