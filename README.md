# Implement Image Carousel

## **Instructions**

#### **Important:**
Even though I have customized the URL to dynamically show MLB photos for today's game, I have seen that sometimes there is no photos for "today". And therefore to test my code and use it, sometimes I had to use data for previous dates. 


For example: 

If you get a message on the screen saying that "There are no MLB games for today! Please try again later."

then please modify line: 30-31 in file mlbBrowsePage.js to use mlbURL for 2018-06-08 just like below:

```
    // var mlbURL = `http://statsapi.mlb.com/api/v1/schedule?hydrate=game(content(editorial(recap))),decisions&date=${date}&sportId=1`;
    
    var mlbURL = "http://statsapi.mlb.com/api/v1/schedule?hydrate=game(content(editorial(recap))),decisions&date=2018-06-10&sportId=1";
    
```
#### **How to run the app:**
1. Download zip file from dropbox location in the email
2. Unzip the files to a local folder
3. Navigate to downloaded folder ../MLBCarousel
4. Run `npm install`. This will install the required modules in package.json
5. After that is done, run `http-server` to start http-server to serve our app
6. Grab the local server URL indicated in the messages. For me it was: `http://127.0.0.1:8080`
7. To launch app, simply open browser and type `http://127.0.0.1:8080/index.html`
8. Enjoy!

## **Technologies used**
1. Javascript
2. CSS (did not use preprocessor like LESS since it does not run on browser)
3. HTML

## **Basic Functional Requirements**

All of the below requirements were accomplised

1. Display carousel of MLB editorial recap content photos
2. Display a background image http://mlb.mlb.com/mlb/images/devices/ballpark/1920x1080/1.jpg
3. Enable Navigation via user remote or keyboard
4. Selecting a tile should:
    a. expand it up by 150%
    b. Display metadata at the top and bottom of the selected tile

## **Additional Functional Requirement for extra credit**

All of the additional functional requirements below were accomplised, except for #2 below

1. Customize the URL to dynamically show MLB photos for today's game
2. ~~Support loading and displaying MLB photos for adjacent days (*)~~
3. Incorporate transitions/animations/visual aesthetics if needed
4. Display a details overlay/screen upon selecting an item via "Enter" key or "OK" button on remote

(*) needs additional server queries + data parsing. 

I did not get time to complete #2 above and I promised that I would deliver this EOD Friday. 
Basically, consider this as the end of sprint and so I would leave this task for the next sprint :). 
But I have an idea on what I must do. Basically, this is what I would do:

1. Create asynchronous requests with Promises to fetch data for 2 previous days
2. Create a hashMap to represent 3 day's worth of data. Example:
    ```
    hashMap[today] = {}
    hashMap[yesterday] = {}
    hashMap[dayBeforeYesterday] = {}
    ```
3. Merge all 3 day's of images in the image carousel as a list. Basically when the user navigates left from the first item of "today's" list, we are taken back into yesterday's and day-before-yesterday's images.
4. We can have a Timeline Label that is shown at the top of the page that can have 3 different values - 
"2019-05-03", "2019-05-02", "2019-05-01" representing "today", "yesterday" and "day-before-yesterday" respectively. And this label changes as the user switches between different time windows while navigating the image boundaries. 

## **Additional Requirements that I added**

1. If an image takes time to download, showing default photo instead. See default.jpg under images folder. Code to support that is under function createCarousel() line 224.

## **Assumptions made**

1. Mouse input will not be used
2. Aspect Ratio chosen for photos is "4:3"
3. Chosen Dimensions to support aspect ratio is "192x144"

## **Wishlist**

1. Use a preprocessort like LESS for CSS so that I can write consice css styles.
2. Append adjacent day's data in the game carousel with the design as indicated above.
3. Although I have used % (percentages for width and height) in some places in the CSS, I would prefer using vw and vh so that this page is responsive and works on multiple devices.
4. Add retry logic in case if server returns error message due to server down. That way, the user does not have to keep hitting refresh.
5. We can add conditions to fallback to a different aspect ratio/dimension if the desired aspect ratio or dimension does not exist for a game. But that would require some work in CSS since I am factoring in aspect ratio 4:3 for some of the styling calculations.
6. Assuming that this is one page in an full app experience, it would make sense to possibly cache data so that we dont have to refetch and reparse this huge data set returned by the server.
7. If the server supports paging then possibly fetch data in chunks for some games and implement paging algorithm to fetch data asynchronously while user has some data to see on the UI.