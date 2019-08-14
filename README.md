# Burrito Maker

Prompt
-------
Design and build a visual burrito builder

Food is a good thing. Especially eating it. The Mission, where PicnicHealth is located, is the land of the burritos. In fact, the Mission is the home of America’s best burrito, according to some very scientific analysis by Nate Silver’s FiveThirtyEight. And while ordering burritos in person can be good, sometimes you like the convenience of ordering them from the web. Unfortunately, we often find the online burrito ordering experience lacking. You can’t see the ingredients! We think there should be a better option. Domino’s Pizza Builder is a UX wonder, and we think the inspired approach that Domino’s takes should be applied to burritos. Only with the visual feedback of seeing the ingredients go into your burrito can you imagine the taste those combined ingredients will produce. It’s up to you to create this taste synesthesia. 

Design and build a burrito orderer, where the user sees ingredients added to an image of the burrito as ingredients are selected. Take inspiration from the Domino’s Pizza Builder. Think about UI and UX.

Strategy
--------
Burrito_Maker is a React Redux application that utilizes a Flask backend and a MongoDB for data_storage/manipulation.
It is hosted on heroku and provided publicly here

To mimic an actual portal in which one provides updates to the app about specific orders. The frontend uses a timer and activity function to server updates
regarding the status of an order. 
In addition, after reaching the final status of "Delivered!", the server constructs an email with the meta_data of the order
and sends it to the ordering party's email address.

I chose to build a full stack application to mimic the layout of what could possibly be seen in a real production environment.
Storing updates and reading in data from databases would be crucial to any such application

Mongodb was chosen to due to the abstract data model I was working with. As the project progressed, I was able to add more features such as
tipping and datetimes without comprimising my code. Mongodb allows for a flexible database that is suited towards early projects

Backend
-------
The Backend is built in flask and mainly handles database connection and API on top of smtp emails. 
There is a config file located in the backend directory that contains the username and passwords used in the server. This was done on purpose
to make sure it can be run locally when graded. 
In production that would not be provided locally

Frontend
--------
The frontend is built in react-redux. I like using redux because it provides better control on the data model the frontend has to work with.
It allows for a central store that can be accessed and modified by all components in the application. 
The application is also split into two routes with the Tracker route being inaccessible when loaded directly. I did this intentionally to make the user
go through the burrito making process in order to check on delivery or tracking data. That way the tracker avoids running into empty datasets.
In addition the burrito emoji stacking has random heights associated with each emoji present on the burrito. The differing emoji sizes
gives it a better look where all the ingredients are stacked but still shown.

Going Forward
-------------
The layout of the UI can be improved upon. The previous tickets panel needs pagination to handle the increasing amount of orders so it does not
ruin the page.
In addition, the backend could handle authentication and even provide templates of known liked burrito combinations
Also, different deliverers other than Chorizo could be added which provide another layer of complexity to the app and database.
The smtp server also sends a plain text email for the burrito. This can be improved by providing direct html.


To Run Locally
--------------
Frontend:
1) cd /frontend/burrito_maker/
2) yarn install (if using npm use the react_scripts provided)
3) yarn start

Backend:
1) cd /backend/
2) virtualenv env (certain packages need installing)
3) source ./env/bin/activate
4) pip install -r requirements.txt
5) python application.py
