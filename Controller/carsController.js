import car_Model from "../Model/Car.js";
export const addCar= async(req,res)=>{
    try {
        const { carBrand, rentRate, carModel, year,make, engineType } = req.body;
        if (![carBrand, rentRate, carModel, year, engineType].every(Boolean)) {
          return res.status(400).json( "Please provide all required fields." );
        }
        if(req.role!=="showroom"){
            return res.status(403).json("Unauthorized action. Only showroom owners can add cars.");
        }
        
        await car_Model.create({
            carBrand,
            rentRate,
            carModel,
            year,
            make,
            engineType,
            availability: "Available", // default value
            userId: req.user
        });
        console.log(req.body);
        console.log(req.file)
        console.log(req.user)
        return res.status(201).json("Car has been added successfully.");
    } catch (error) {
        console.error("Error adding car:", error); 
        return res.status(500).json("An internal server error occurred. Please try again later.");
    }
}


export const removeCar=async (req, res)=>{
    try {
        if (req.role !== 'showroom') {
            return res.status(403).json("Access denied. Only showroom owners can delete cars." );
        }
        const _id = req.params.id;
        console.log(_id);
        const car = await car_Model.findById(_id);
        if (!car) {
            return res.status(404).json("Car not found. Please try again." );
        }
        console.log({userID:car.userId})
        console.log({uid:req.user})
        if (req.user !== car.userId.toString()) {
            return res.status(403).json("Access denied. You can only delete cars you own." );
        }
        await car_Model.findByIdAndDelete(_id);
        
        return res.status(200).json("Car has been successfully deleted.");    
        
    } catch (error) {
        console.error("Error deleting car:", error);
        return res.status(500).json("An internal server error occurred. Please try again later." );
    }
}




export const searchCar = async (req, res) => {
    try {
        const { carmodel, carbrand } = req.query;
 
        const query = {};
    if(!carmodel && !carbrand){
        return res.status(400).json("Please enter car model or car brand to search");
    }
        if (carmodel) {
            query.carModel = { $regex: carmodel, $options: 'i' };
        }
        if (carbrand) {
            query.carBrand = { $regex: carbrand, $options: 'i' }; 
        }
        // const cars = await car_Model.find(query).populate('userId'); 
        console.log(query)

        const cars = await car_Model.find(query).populate('userId','showroomName -_id'); 

        if (cars.length === 0) {
            return res.status(404).json("No cars found matching your search criteria.");
        }


        return res.status(200).json(cars);
    } catch (error) {
        console.error("Error searching for cars:", error); 
        return res.status(500).json('Internal server error');
    }
};