from flask import Flask, render_template, request,Response
import os
import requests
import json
from data_access.tree import Tree, Node
import pickle
import api_keys


def generate_tree(place, hotel_json, rest_json, attrac_json):
    
    hotel_tree = Node({'hotel_data': None})
    rest_tree = Node({'rest_data': None})
    attrac_tree = Node({'attrac_data': None})

    hotel_attributes = ['main_photo_url', 'hotel_name', 'city', 'address', 'url', 'is_free_cancellable', 'price_breakdown', 
                        'review_score_word', 'review_score', 'unit_configuration_label', 'checkin', 'distances']
    

    if 'result' in hotel_json.keys():
        for hotel in hotel_json['result']:
            hotel_info = Node({hotel['hotel_name']: None})
            for attr in hotel_attributes:
                if attr in hotel.keys():
                    data = hotel[attr]
                else:
                    data = 'Data not available'
                hotel_info.add_child(Node({attr: data}))
            hotel_tree.add_child(hotel_info)


    rest_attributes = ['email', 'restaurantName', 'cityName', 'address', 'website', 'phone', 'hoursInterval', 'cuisineType']

    if 'restaurants' in rest_json.keys():
        for rest in rest_json['restaurants']:
            rest_info = Node({rest['restaurantName']: None})
            for attr in rest_attributes:
                if attr in rest.keys():
                    data = rest[attr]
                else:
                    data = 'Data not available'
                rest_info.add_child(Node({attr: data}))
            rest_tree.add_child(rest_info)

    
    attrac_attributes = ['photo', 'name', 'location_string', 'address', 'website', 'description', 'offer_group']

    if 'data' in attrac_json.keys():
        # print(attrac_json['data'])
        for attrac in attrac_json['data']:
            try:
                attrac_info = Node({attrac['name']: None})
            except:
                attrac_info = Node({'Name not available': None})

            for attr in attrac_attributes:
                if attr in attrac.keys():
                    data = attrac[attr]
                else:
                    data = 'Data not available'
                attrac_info.add_child(Node({attr: data}))
            attrac_tree.add_child(attrac_info)


    data_tree = Tree()
    data_tree.add_root(Node({place: None}))
    data_tree.root.add_child(hotel_tree)
    data_tree.root.add_child(rest_tree)
    data_tree.root.add_child(attrac_tree)

    return data_tree


cache_path = 'searches.pickle'

app = Flask(__name__)

@app.route("/")  
def home():
    return render_template("index.html")

@app.route("/<place>")  
def second(place):
    return render_template("second.html", place=place)

@app.route("/data")
def results():
    if request.method == "POST":
        job_role = request.form['role']
        print(job_role)
    return render_template('data.html',job_role = job_role)


@app.route('/get_data/<place>')
def data(place):
    url = "https://booking-com.p.rapidapi.com/v1/hotels/locations"
    querystring = {"name":f"{place}","locale":"en-us"}
    headers = {
        "X-RapidAPI-Key": api_keys.api_key,
        "X-RapidAPI-Host": "booking-com.p.rapidapi.com"
    }
    response = requests.request("GET", url, headers=headers, params=querystring)

    response = response.json()
    dest_id=response[0]['dest_id']
    url = "https://travel-advisor.p.rapidapi.com/locations/search"
    querystring = {"query": f"{place}","limit":"30","offset":"0","units":"km","location_id":"1","currency":"USD","sort":"relevance","lang":"en_US"}
    headers = {
        "X-RapidAPI-Key": api_keys.api_key,
        "X-RapidAPI-Host": "travel-advisor.p.rapidapi.com"
    }
    response = requests.request("GET", url, headers=headers, params=querystring)
    response = response.json()
    loc_id=response['data'][0]['result_object']['location_id']

    ################## Restaurants ###############################

    url = f"https://restaurants-near-me-usa.p.rapidapi.com/restaurants/location/city/{place}/0"
    headers = {
        "X-RapidAPI-Key": api_keys.api_key,
        "X-RapidAPI-Host": "restaurants-near-me-usa.p.rapidapi.com"
    }
    response = requests.request("GET", url, headers=headers)
    response_rest = response.json()

    ############################### Hotels ###############################

    url = "https://booking-com.p.rapidapi.com/v1/hotels/search"
    querystring = {"checkin_date":"2023-09-27","dest_type":"city","units":"metric","checkout_date":"2023-09-28","adults_number":"2","order_by":"popularity","dest_id":dest_id,"filter_by_currency":"USD","locale":"en-us","room_number":"1","children_number":"2","children_ages":"5,0","categories_filter_ids":"class::2,class::4,free_cancellation::1","page_number":"0","include_adjacency":"true"}
    headers = {
        "X-RapidAPI-Key": api_keys.api_key,
        "X-RapidAPI-Host": "booking-com.p.rapidapi.com"
    }

    response = requests.request("GET", url, headers=headers, params=querystring)
    response_hotel = response.json()

    # ################################# Attractions ###############################

    url = "https://travel-advisor.p.rapidapi.com/attractions/list"
    querystring = {"location_id":loc_id,"currency":"USD","lang":"en_US","lunit":"km","sort":"recommended"}
    headers = {
        "X-RapidAPI-Key": api_keys.api_key,
        "X-RapidAPI-Host": "travel-advisor.p.rapidapi.com"
    }
    response = requests.request("GET", url, headers=headers, params=querystring)
    response_attrac = response.json()



    ######################### Caching and retrieving cache files ##########################

    if os.path.exists(cache_path):
        with open(cache_path, 'rb') as f:
            prev_searches = pickle.load(f)
            cache_node = prev_searches.find(prev_searches.root, place)
        
        if cache_node:
            print("Loading from cache....")
            data_tree = Tree()
            data_tree.add_root(cache_node)
        else:
            data_tree = generate_tree(place, response_hotel, response_rest, response_attrac)
            prev_searches.root.add_child(data_tree.root)
    
    else:
        data_tree = generate_tree(place, response_hotel, response_rest, response_attrac)
        prev_searches = data_tree
    
    ########################################################################################

    
    hotel_attr = ['main_photo_url', 'hotel_name', 'city', 'address', 'url', 'is_free_cancellable', 'price_breakdown', 
                        'review_score_word', 'review_score', 'unit_configuration_label', 'checkin', 'distances']
    
    hotel_tree = Tree()
    hotel_tree.add_root(data_tree.find(data_tree.root, 'hotel_data'))

    hotel_info = {"result": []}
    if len(hotel_tree.root.children) > 0:
        for hotel in hotel_tree.root.children:
            curr_hotel = Tree()
            curr_hotel.add_root(hotel)
            hotel_dict = {}
            for attr in hotel_attr:
                hotel_dict[attr] = curr_hotel.find(curr_hotel.root, attr).data[attr]
            hotel_info["result"].append(hotel_dict)


    rest_attr = ['email', 'cityName', 'restaurantName', 'address', 'website', 'phone', 'hoursInterval', 'cuisineType']
    rest_tree = Tree()
    rest_tree.add_root(data_tree.find(data_tree.root, 'rest_data')) 
    
    rest_info = {"restaurants": []}
    if len(rest_tree.root.children) > 0:
        for rest in rest_tree.root.children:
            curr_rest = Tree()
            curr_rest.add_root(rest)
            rest_dict = {}
            for attr in rest_attr:
                rest_dict[attr] = curr_rest.find(curr_rest.root, attr).data[attr]
            rest_info["restaurants"].append(rest_dict)


    attrac_attr = ['photo', 'location_string', 'name', 'address', 'website', 'description', 'offer_group']
    attrac_tree = Tree()
    attrac_tree.add_root(data_tree.find(data_tree.root, 'attrac_data')) 

    attrac_info = {"data": []}
    if len(attrac_tree.root.children) > 0:
        for attrac in attrac_tree.root.children:
            curr_attrac = Tree()
            curr_attrac.add_root(attrac)
            attrac_dict = {}
            for attr in attrac_attr:
                # print(type(curr_attrac.find(curr_attrac.root, attr).data[attr]))
                attrac_dict[attr] = curr_attrac.find(curr_attrac.root, attr).data[attr]
            attrac_info["data"].append(attrac_dict)


    with open(cache_path, 'wb') as f:
        pickle.dump(prev_searches, f)

    return {
        'hotel': hotel_info,
        'rest': rest_info,
        'attr': attrac_info
    }

if __name__ == "__main__":
    app.run(debug=True)