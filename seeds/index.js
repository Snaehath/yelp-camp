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
            location:`${cities[random1000].city},${cities[random1000].state}`,
            title:`${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/collection/483251',
            description:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Error quasi consectetur vel modi, nesciunt rerum aliquam labore a voluptates libero maxime earum distinctio quas iure, ratione quisquam sint eveniet facilis.',
            price
        })
        await camp.save()
    }
}

seedDB().then(() =>{
    mongoose.connection.close();
})