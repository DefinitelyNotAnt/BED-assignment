const Place = require("../models/place");

const getAllPlaces = async (req, res) => 
{
    try 
    {
      const places = await Place.getAllPlaces();
      res.json(places);
    } 
    catch (error) 
    {
      console.error(error);
      res.status(500).send("Error retrieving places");
    }
};

//getBookById: This function retrieves a book by ID using the Book.getBookById method. It parses the id from the request parameters, checks for successful retrieval, and sends either the retrieved book object or a "Book not found" response with a 404 status code.
const getPlaceById = async (req, res) => 
{
    const placeId = parseInt(req.params.id);
    try 
    {
      const place = await Place.getPlaceById(placeId);
      if (!place) 
      {
        return res.status(404).send("Place not found");
      }
      res.json(place);
    } 
    catch (error) 
    {
      console.error(error);
      res.status(500).send("Error retrieving place");
    }
};

//Create a book and retrieves the new book data from the request body (req.body).
//It calls the Book.createBook method with the new book data to create the book record.
//Handles POST /books HTTP method to create a new book
const createPlace = async (req, res) => 
{
    const newPlace = req.body;
    try 
    {
        const createdPlace = await Place.createPlace(newPlace);
        res.status(201).json(createdPlace);
    } 
    catch (error) 
    {
        console.error(error);
        res.status(500).send("Error creating place");
    }
};
    
const updatePlace = async (req, res) => 
{
    const placeId = parseInt(req.params.id);
    const newPlaceData = req.body;
    
    try 
    {
        const updatedPlace = await Place.updatePlace(placeId, newPlaceData);
        if (!updatedPlace) 
        {
          return res.status(404).send("Place not found");
        }
        res.json(updatedPlace);
    } 
    catch (error) 
    {
        console.error(error);
        res.status(500).send("Error updating place");
    }
};
    
    //Handles DELETE /books/id HTTP method to delete the book by its id
const deletePlace = async (req, res) => 
{
    const placeId = parseInt(req.params.id);
    
    try 
    {
        const success = await Place.deletePlace(placeId);
        if (!success) 
        {
          return res.status(404).send("Place not found");
        }
        res.status(204).send();
    } 
    catch (error) 
    {
        console.error(error);
        res.status(500).send("Error deleting place");
    }
};

module.exports = 
{
    getAllPlaces,
    createPlace,
    getPlaceById,
    updatePlace,
    deletePlace,
};