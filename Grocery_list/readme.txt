Purpose of this work: Record and display a grocery shopping list with an easy-to-use web portal and backend database. 

Data Model: 
1. Item: - grocery item
       Title - item's name
       Summary - item details 
       SKU - this item's sku number, usde to locate item in grocery store 
       cat - product category, foreign key
2.Cat: 
        name - category name

Setup - Local
1. make sure all dependencies are installed 
        npm install express-generator -g
        express express-locallibrary-tutorial --view=pug
        cd express-locallibrary-tutorial
            npm install
        npm install async
2. Start the skleton project (this project is based on skelton project)
        DEBUG=express-locallibrary-tutorial:* npm start
3. Browser to load the following site
        http://localhost:3000/
4. Navigate to different tabs and use the features of this project
5. Run the following code to create some dummy data 
        node populatedb <your mongodb url>

Note: this is the MongoDB cloud database auth string, plz replace with your own auth string if necessary. 
         mongodb+srv://mia0303:199127@cluster0.69q8jdz.mongodb.net/?retryWrites=true&w=majority

This work is built upon the tutorial and code provided in the "Local Library" (https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/Tutorial_local_library_website) work and this repo (https://github.com/mdn/express-locallibrary-tutorial)
But this project will serve a different purpose about grocery list and have a different data model.
        
