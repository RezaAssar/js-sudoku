#JUDOKU (JS-Sudoku)#

A simple, mostly complete Sudoku game written for the browser.

Link to built app - (http://mynd.us/judoku/)

###Stack###
* Yeoman
* Bower
* Grunt
* jQuery
* Sass

###About###
* Responsive, same DOM elements are used for all resolutions.
* Accessible, desktop users can use keyboard (arrow keys + enter, or just arrow keys + number) to select digits.
* App consumes a JSON feed of pre-made Sudoku boards, on app load a random board is chosen, and a variable number of tiles are displayed.
* Structure
    * Game
        * Game.init
        * Board
            * Board.loadData
            * Board.ui
            * Board.events
            * Board.solve


###TO DOs###
I started working on updating the digit pickers to only allow users to select valid digits. This added a significant amount of complexity and also made the game much easier to solve which is why I shelved it for now.

The app does not render well on mobile devices in landscape mode. In the real world if this was not a requirement I would rotate the entire app on orientation change, 'preventing' the user from ever entering landscape orientation.

I'm using native dialog/confirms when a user attempts to solve or restart the app, I would use stylized DOM elements in a production app.