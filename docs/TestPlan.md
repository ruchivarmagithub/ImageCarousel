# Test Plan

## **Test Platform**

Chrome Version 73.0.3683.103 

Lauched index.html locally (basically, I did not host it on any server)

## **Assumptions made**

1. Mouse input will not be used
2. Aspect Ratio is for photos is "4:3"
3. Dimensions to support aspect ratio is "192x144"

## **Tests**

### **Functional Scenarios**

#### **Passed Tests**
0. Page shows a carousel of MLB editorial recap content photos.
1. When the user lands on the page, the first game item is focused/selected by default.
2. User can navigate the game list via keyboard.
3. When user focuses on a game item, the game item scales by 150%.
4. When user focuses on a game item, descriptive text shows up at the top and bottom of the focused items.
5. When user selects or taps a game item, a details overlay shows up with additional details for that game.
6. URL to get game info is based off today's date.
7. When user focuses on a game item, verify that the other game items fade out.
8. When user focuses on a game item, verify that the other game items shift left or right to give space to the scaled out focused game item.
9. Display a background image http://mlb.mlb.com/mlb/images/devices/ballpark/1920x1080/1.jpg.
10. List scrolls as the user presses keys to go left or right.

### **Edge Case Tests**

#### **Passed Tests**
1. When the user reaches the right end of game list and presses right, user stays on the right most game item.
2. When the user reaches the left end of game list and presses left, user stays on the left most game item.
3. Verify that the user can dismiss a details overlay by pressing on the right or left key to go on to the next game item. But there are 2 additonal scenarios here:
    a. Assume that the details overlay for the right most game item is up. And so even though there are  no game items on the right of this item, verify that user can dismiss the details overlay by another right key press.
    b. Assume that the details overlay for the left most game item is up. And so even though there are  no game items on the left of this item, verify that user can dismiss the details overlay by another left key press.
4. Keyup and keydown key presses are ignored.
5. Display correct error message when
    a. There is no MLB data for that day.
    b. An incorrect URL is provided.
    c. Server returns 404 or response status other than 200.
    d. Request times out after 2000ms

#### **Failed Tests**
1. Scenario: User is navigating the game list, and brings up the details overlay for the game item at the edge of the screen Expected: The details overlay should never be cut off. 
Actual: *Sometimes* I see that the details overlay for the game items at the edge are being slightly cut off.

### **Performance Tests**

#### **Passed Tests**
1. Key presses are responsive and navigation occurs seamlessly.
2. Scrolling the list as the key is pressed is smooth with good user experience.
3. If the user holds a right or left key press for too long, the list scrolls.

#### **Failed Tests**
4. Assume that the user is holding a right or left key press for too long and the list is scrolling. 
Expected: When the user releases the key press, the game item which is currently at the center should get the focus.
Actual: The game item that gets the focus is not consistent. I have seen center items get focused and sometimes the corner ones get focus.

