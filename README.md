# Map
This is a Map of the City I live in. PATRA - GREECE

For running the app take public_html folder and drug and drop to a browser the index file included.

Ihave used 3 apis 

Google maps, Streetview for images, Weather api from worldweatherOnline and GoogleInsights api

I have picked my self a few of POIS from my city. Museums, places to eat the University and the ATEI school and two sights.
There is a list on the side with a button list-icon. 

From the search input you filter the places. Filtering is by type:
Type foo for FOOD
     mus for MUSEUMS
     oth for OTHER
     edu for EDUCATION

Also there is a weatherBox with current weather in Patras which is dragable(Click and Hold with mouse and it moves).

Speed file icon is for Google insights and displays the sites own score.

I used sample code for sliding elements and filtering list with knockout from js fiddle examples.

***Notice for Googles Insights BOX. The box works for hosting online, the link is applied by using URL element taken from DOM. For hosting localy you must provide the url of another page of your choosing and check those results. For example
https://www.example.com. Just replace the code on appengine.js
