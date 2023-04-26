$('#place').hide()

$.ajax({
    url: `/get_data/${$('#place').text()}`,
    method: 'GET',
    dataType: 'json',
    success: function(data) {
        let { hotel, rest, attr } = data

        $('#load').hide()

        if( attr['data'] != []){
        attr['data'].forEach(element => {

            // Attraction --------------------------------------------------------------
            let img_url, name, location_string, address, website, booking

            // console.log(element)

            if(element['photo'] != 'Data not available'){
                img_url = element['photo']['images']['small']['url']
            } else {
                img_url = 'No image available'
            }
            
            if(element['name'] != 'Data not available'){
                name = element['name']
            } else {
                name = ''
            }

            if(element['location_string'] != 'Data not available'){
                location_string = element['location_string']
            } else {
                location_string = 'Data not available'
            }

            if(element['address'] != 'Data not available'){
                address = element['address']
            } else {
                address = 'Adress not available'
            }

            if(element['website'] != 'Data not available'){
                website = element['website']
            } else {
                website = ''
            }

            if(element['description'] != 'Data not available'){
                description = element['description']
                if (description == ''){
                    description = 'No data available'
                }
            } else {
                description = 'No data available'
            }

            let num = 3
            let count = 0
            let act_str = ``
            if(element['offer_group'] != 'Data not available'){
                element['offer_group']['offer_list'].forEach(function(e){
                    if (count < num){
                        act_str = act_str + ' ' + `<div class="col-3">
                                    <p>${e['title']} - ${e['rounded_up_price']}</p>
                                </div>`
                        count = count + 1 
                    }
                })
            } else {
                act_str = 'No activities'
            }

            if(name != ''){
                $('#card_col_attr').append(`
                <div class="d-flex flex-row col-10 m-3 attraction_spot" style="color: #070A52; border-radius: 50px; border: 1.5px solid #7F8487; box-shadow: 2px 2px 5px 0 rgba(0, 0, 0, 0.5); background-color: #A5C9CA;">
                <img class='col-3' style="border-radius: 50px;" src="${img_url}" alt="">
                <div  class="col-9">
                    <div class="d-flex flex-row align-items-center">
                        <h3 class="col-8" style="padding-left: 10px;">${name}</h3>
                        <h6 class="col-4">${location_string}</h6>
                    </div>
                    <div class="d-flex flex-row p-1 justify-content-between" style="color: #735F32;">
                        <div class="col-7">
                            <p class="text_packup pl-1" style="font-size: 14px; font-weight: bold; padding-left: 10px;">${description}</p>
                        </div>
                        <div class="col-4 p-1">
                            <p style="font-size: 13px; font-weight: bold; color: #2C3333;">Address: ${address}</p>
                            <p style="font-size: 13px; font-weight: bold; color: #2C3333;"><a href="${booking}" target="_blank">Booking Link</a></p>
                            <p style="font-size: 13px; font-weight: bold; color: #2C3333;"><a href="${website}" target="_blank">Website Link Link</a></p>
                        </div>
                    </div>
                    <div class="d-flex flex-column" style="padding-left: 10px; padding-right: 10px;">
                        <div class="d-flex flex-row">
                            <h6>Activities</h6>
                        </div>
                        <div class="d-flex flex-row justify-content-between" style="font-size: 13px; font-weight: bold; color: #2C3333;">
                            ${act_str}
                        </div>
                    </div>
                </div>
            </div>`)
            }
        });
    } else {
        $('#card_col_attr').append(`No data available`)
    }
        // -----------------------------------------------------------------------------------------------
        // Hotels ----------------------------------------------------------------------------------------

        if (hotel['result'] != []){
        hotel['result'].forEach(function(element){
            
            console.log("main photo url")
            console.log(element)
            console.log()

            let main_photo_url, hotel_name, city, booking_url, address_hotel, is_free_cancellable, price, review_score_word, distances, unit_configuration_label, from, until, review_score; 

            if(element['main_photo_url'] != 'Data not available'){
                console.log("HELLOOOOOOOOOO")
                main_photo_url = element['main_photo_url']
            } else {
                console.log("HIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII")
                main_photo_url = 'No image available'
            }
            
            if(element['hotel_name'] != 'Data not available'){
                hotel_name = element['hotel_name']
            } else {
                hotel_name = ''
            }

            if(element['city'] != 'Data not available'){
                city = element['city']
            } else {
                city = 'Data not available'
            }

            if(element['address'] != 'Data not available'){
                address_hotel = element['address']
            } else {
                address_hotel = 'Address not available'
            }

            if(element['url'] != 'Data not available'){
                booking_url = element['url']
            } else {
                booking_url = ''
            }

            if(element['is_free_cancellable'] != 'Data not available'){
                if (element['is_free_cancellable']){
                    is_free_cancellable = 'Yes !!'   
                }else{
                    is_free_cancellable = 'No !!'
                }
            } else {
                is_free_cancellable = ''
            }

            if(element['price_breakdown'] != 'Data not available'){
                price = element['price_breakdown']['gross_price']
            } else {
                price = 'Not available'
            }

            if(element['review_score_word'] != 'Data not available'){
                review_score_word = element['review_score_word']
            } else {
                review_score_word = 'Not available'
            }

            
            if(element['review_score'] != 'Data not available'){
                review_score = element['review_score']
            } else {
                review_score = ''
            }

            if(element['unit_configuration_label'] != 'Data not available'){
                unit_configuration_label = element['unit_configuration_label']
            } else {
                unit_configuration_label = 'Data not available'
            }

            if(element['checkin'] != 'Data not available'){
                from = element['checkin']['from']
                until = element['checkin']['until']
            } else {
                checkin = 'Data not available'
            }

            let dist_str = ``
            if(element['distances'] != 'Data not available'){
                element['distances'].forEach(function(e){
                    dist_str = dist_str + ' ' + 
                    `
                    <div class="col-3">
                    <p style="font-size: 13px;">${e['text']}</p>
                    </div>
                    `
                });
            } else {
                dist_str = 'No data given'
            }


            if(hotel_name != ''){
                $('#card_col_hotel').append(`
                <div class="d-flex flex-row col-10 m-3 hotels" style="color: #E5E5CB; border-radius: 50px; border: 1.5px solid #7F8487; box-shadow: 2px 2px 5px 0 rgba(0, 0, 0, 0.5); background-color: #A5C9CA;">
                <img class='col-3' style="border-radius: 50px;" src="${main_photo_url}" alt="">
                <div  class="col-9">
                    <div class="d-flex flex-row align-items-center">
                        <h3 class="col-8" style="padding-left: 10px;">${hotel_name}</h3>
                        <h6 class="col-4">${city}</h6>
                    </div>
                    <div class="d-flex flex-row p-1 justify-content-between" style="color: #735F32;">
                        <div class="col-3">
                            <p class="text_packup pl-1" style="font-size: 18px; font-weight: bold; padding-left: 10px; margin-bottom: 2px;">The price is ${price}</p>
                            <p style="color: #E5E5CB; padding-left: 10px; font-size: 18px; margin-bottom: 5px;">Review</p>
                            <p style="font-size: 13px; font-weight: bold; color: #2C3333; padding-left: 10px; margin-bottom: 5px;">${review_score_word}, Review score ${review_score}</p>
                        </div>
                        <div class="col-4">
                            <p style="color: #E5E5CB; padding-left: 10px; font-size: 18px; margin-bottom: 5px;">Room Type</p>
                            <p style="font-size: 13px; font-weight: bold; color: #2C3333; padding-left: 10px; margin-bottom: 5px;">${unit_configuration_label}</p>
                            <p style="color: #E5E5CB; padding-left: 10px; font-size: 18px; margin-bottom: 5px;">Checkin Time</p>
                            <p style="font-size: 13px; font-weight: bold; color: #2C3333; padding-left: 10px; margin-bottom: 5px;">From : ${from}, Until: ${until}</p>
                        </div>
                        <div class="col-4 p-1">
                            <p style="font-size: 13px; font-weight: bold; color: #2C3333;">Address: ${address_hotel}</p>
                            <p style="font-size: 13px; font-weight: bold; color: #2C3333;">Free cancellation: ${is_free_cancellable}</p>
                            <p style="font-size: 13px; font-weight: bold; color: #2C3333;"><a href="${booking_url}" target="_blank">Booking Link</a></p>
                        </div>
                    </div>
                    <div class="d-flex flex-column" style="padding-left: 10px; padding-right: 10px;">
                        <div class="d-flex flex-row">
                            <h6>Distances</h6>
                        </div>
                        <div class="d-flex flex-row justify-content-start" style="font-size: 11px; font-weight: bold; color: #2C3333;">
                            ${dist_str}
                        </div>
                    </div>
                </div>
            </div>`)
            }
        });
    }else{
        $('#card_col_hotel').append(`No data available`)
    }

        // -------------------------------------------------------------------------------------
        // Rest -----------------------------------------------------------------------------------

        if (rest['restaurants'] == []){
            rest['restaurants'].forEach(function(element){

            let restaurantName, rest_address, phone, rest_website, email, cityName, hoursInterval, cuisineType;

            if(element['email'] != 'Data not available'){
                email = element['email']
            } else {
                email = ''
            }
            
            if(element['restaurantName'] != 'Data not available'){
                restaurantName = element['restaurantName']
            } else {
                restaurantName = ''
            }

            if(element['cityName'] != 'Data not available'){
                cityName = element['cityName']
            } else {
                cityName = 'No data available'
            }

            if(element['address'] != 'Data not available'){
                rest_address = element['address']
            } else {
                rest_address = 'No data available'
            }

            if(element['website'] != 'Data not available'){
                rest_website = element['website']
            } else {
                rest_website = ''
            }

            if(element['phone'] != 'Data not available'){
                phone = element['phone']
            } else {
                phone = 'No data available'
            }

            if(element['hoursInterval'] != 'Data not available'){
                hoursInterval = element['hoursInterval']
                if (hoursInterval != ''){
                    hoursInterval = 'No data available'
                }
            } else {
                hoursInterval = 'No data available'
            }

            if(element['cuisineType'] != 'Data not available'){
                cuisineType = element['cuisineType']
            } else {
                cuisineType = 'No data available'
            }

            if(restaurantName != ''){
                $('#card_col_rest').append(`
                <div class="d-flex flex-row col-9 m-3  justify-content-center" style="color: #E5E5CB; border-radius: 50px; border: 1.5px solid #7F8487; box-shadow: 2px 2px 5px 0 rgba(0, 0, 0, 0.5); background-color: #A5C9CA">
                <div  class="col-9">
                    <div class="d-flex flex-column col-12 align-items-center">
                        <h3 class="">${restaurantName}</h3>
                        <p class="text_packup" style="font-size: 18px; font-weight: bold; margin-bottom: 2px;">${cuisineType}</p>
                    </div>
                    <div class='d-flex flex_row'>
                        <div class="col-6">
                            <p style="color: #E5E5CB; padding-left: 10px; font-size: 18px; margin-bottom: 5px;">Hours open:</p>
                            <p style="font-size: 13px; font-weight: bold; color: #2C3333; padding-left: 10px; margin-bottom: 5px;">${hoursInterval}</p>
                        </div>
                        <div class="col-6 p-1">
                            <h6 class="col-4">${cityName}</h6>
                            <p style="font-size: 13px; font-weight: bold; color: #2C3333;">Address: ${rest_address}</p>
                            <p style="font-size: 13px; font-weight: bold; color: #2C3333;">Phone number: ${phone}</p>
                            <p style="font-size: 13px; font-weight: bold; color: #2C3333;"><a href="${rest_website}">Website</a></p>
                            <p style="font-size: 13px; font-weight: bold; color: #2C3333;"><a href="${email}">email</a></p>
                        </div>
                    </div>
                </div>
            </div>`)
            }
        });
    }else{
        $('#card_col_rest').append('No data available')
    }

        // Start

        $('#card_col_hotel').hide()
        $('#card_col_rest').hide()
        $('#card_col_attr').show()
        

        attr_btn = $('#attraction_btn')
        rest_btn = $('#rest_btn')
        hotel_btn = $('#hotel_btn')

        // Event Listner
        $("#attraction_btn").click(function() {
            rest_btn.removeClass("border-bottom border-3")
            hotel_btn.removeClass("border-bottom border-3")
            attr_btn.addClass('border-bottom border-3')

            $('#card_col_hotel').hide()
            $('#card_col_rest').hide()
            $('#card_col_attr').show()
        });

        $("#rest_btn").click(function() {
            attr_btn.removeClass("border-bottom border-3")
            hotel_btn.removeClass("border-bottom border-3")
            rest_btn.addClass('border-bottom border-3')

            $('#card_col_hotel').hide()
            $('#card_col_attr').hide()
            $('#card_col_rest').show()

        });


        $("#hotel_btn").click(function() {
            console.log('hi')
            rest_btn.removeClass("border-bottom border-3")
            attr_btn.removeClass("border-bottom border-3")
            hotel_btn.addClass('border-bottom border-3')

            $('#card_col_attr').hide()
            $('#card_col_rest').hide()
            $('#card_col_hotel').show()
        });

    },
    error: function(error) {
      console.error(error);
    }
  });
  