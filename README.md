# SI507 Project Code

## Overview

Vacation planning portal – A one stop solution to plan your next vacation. Get information about accommodation, restaurants, top attractions, and activities. 

## Installation

The following python packages need to be installed to run the code:
1. flask - Run `pip install flask` in terminal to install
2. requests - `pip install requests` in terminal to install


## Running the code:

1. Create a file named api_keys.py in the root folder.
2. This project uses 3 different APIs, all of which need API keys. To simplify the process of creating an managing multiple keys, RapidAPI is used. Hence, it would suffice to create one key for RapidAPI alone. This can be used to access all the three APIs. Instructions to create key for RapiAPI:
    a. Log in or sign up for your RapidAPI account.
    b. Navigate to any API documentation page by searching for or clicking on one of the collections from the homepage.
    c. Scroll down to the “Header Parameters” section of the API console.
    d. Your API Key should be visible in the “X-RapidAPI-Key” field.

3. Add the following line to api_keys.py, by replacing `put_your_api_key_here` with your api key:

   ```api_key = 'put_your_api_key_here' ```

4. Run the file main.py. This will display a link `(http://127.0.0.1:5000)` in the terminal. Click to url to open the website in a browser.

5. You can now enter the name of a city in the search bar to search attractions, hotels, restaurants, etc. Once you enter a city, a new page will open with separate tabs for attractions, hotels, and restauranrts. Each tabs will display listings in the form of cards with detailed information.