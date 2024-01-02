const mongoose = require('mongoose')
const cities = require('./cities')
const {places,descriptors} = require('./seedHelper')
const Campground = require('../models/campground')

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
    .then(() =>{
        console.log('MONGO Connection on')
    })
    .catch(err =>{
        console.log('Oh no MONGO error')
    })


const sample = array => array[Math.floor(Math.random() * array.length)]

const seedDB = async () =>{
    await Campground.deleteMany({});
    for(let i = 0; i < 50; i++){
        const random1000 = Math.floor(Math.random()*1000)
        const price = Math.floor(Math.random()*20) + 10
        const camp = new Campground({
            author:'6590089c56da5f97613b05f9',
            location:`${cities[random1000].city},${cities[random1000].state}`,
            title:`${sample(descriptors)} ${sample(places)}`,
            description:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Error quasi consectetur vel modi, nesciunt rerum aliquam labore a voluptates libero maxime earum distinctio quas iure, ratione quisquam sint eveniet facilis.',
            price,
            images: [
                {
                    url: 'https://res.cloudinary.com/drahtuhf4/image/upload/v1704164985/YelpCamp/r9vvtx29wxjq2fweorip.jpg',
                    filename: 'YelpCamp/r9vvtx29wxjq2fweorip', 
                  },
                  {
                    url: 'https://res.cloudinary.com/drahtuhf4/image/upload/v1704164985/YelpCamp/t4ke0g9e5wfslgey9uar.jpg',
                    filename: 'YelpCamp/t4ke0g9e5wfslgey9uar',
                  }
            ]
        })
        await camp.save()
    }
}

seedDB().then(() =>{
    mongoose.connection.close();
})