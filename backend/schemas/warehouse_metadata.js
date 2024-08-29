import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { type } from 'os';


    const warehouseSchema = new mongoose.Schema({
        warehouse_id : {
            type : String , 
            required : true,
            default : uuidv4
        },
        warehouse_name : {type : String , required : true},
        latitude : {type : Number , required : true},
        longitude : {type : Number , required : true},
        warehouse_dimensions :{
            length : {type: Number, required:true},
            width : {type: Number, required:true},
            height : {type: Number, required:true},
        },
        energy_resource : {type: String, required: true},
        cooling_units :{type: Number, required: true},
        sensors: {type: Number, reqired: true}

        // sensors :[{
        //     sensor : {type: mongoose.Schema.Types.ObjectId, ref:'sensor_meatadata'},
        //     rack_id : {type: Number, required:true},
        //     shelf_id : {type: Number, required:true}
        // }]

    })

    const warehouse = mongoose.model('warehouse_metadata', warehouseSchema);
    export default warehouse;