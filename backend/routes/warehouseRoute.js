import express from 'express';
import warehouse from '../schemas/warehouse_metadata.js';
import { roomModel } from '../schemas/room_metadata.js';
import { gridModel } from '../schemas/grid_metadata.js';
import { dgsetModel } from '../schemas/dgset_meatadata.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Warehouse:
 *       type: object
 *       required:
 *         - warehouse_id
 *         - warehouse_name
 *         - latitude
 *         - longitude
 *         - warehouse_dimensions
 *         - energy_resource
 *         - cooling_units
 *         - sensors
 *         - userId
 *         - email
 *       properties:
 *         warehouse_id:
 *           type: string
 *           description: Unique ID for the warehouse, auto-generated by UUID
 *           example: 922d4b81-98c1-4c41-a06d-aa90b4f580d1
 *         warehouse_name:
 *           type: string
 *           description: Name of the warehouse
 *           example: Central Warehouse
 *         latitude:
 *           type: number
 *           description: Latitude coordinate of the warehouse
 *           example: 37.7749
 *         longitude:
 *           type: number
 *           description: Longitude coordinate of the warehouse
 *           example: -122.4194
 *         warehouse_dimensions:
 *           type: object
 *           description: Dimensions of the warehouse
 *           properties:
 *             length:
 *               type: number
 *               description: Length of the warehouse in meters
 *               example: 100
 *             width:
 *               type: number
 *               description: Width of the warehouse in meters
 *               example: 50
 *             height:
 *               type: number
 *               description: Height of the warehouse in meters
 *               example: 20
 *         energy_resource:
 *           type: string
 *           description: Type of energy resource used by the warehouse, e.g., Grid/Generator
 *           example: Grid
 *         cooling_units:
 *           type: number
 *           description: Number of cooling units installed in the warehouse
 *           example: 10
 *         sensors:
 *           type: number
 *           description: Number of sensors in the warehouse
 *           example: 15
 *         userId:
 *           type: string
 *           description: User ID associated with the warehouse
 *           example: 60d5f9f5b2933b2f0a5f5b5a
 *         email:
 *           type: string
 *           description: Email address of the user
 *           example: user@example.com
 */


/**
 * @swagger
 * /warehouse/addwarehouse:
 *   post:
 *     summary: Create a new warehouse
 *     tags: [Warehouse]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Warehouse'
 *     responses:
 *       201:
 *         description: Warehouse created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Warehouse'
 *       400:
 *         description: Bad Request - Error creating warehouse. The request payload may be malformed or missing required fields.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error message describing the issue
 *       409:
 *         description: Conflict - Warehouse already exists. The warehouse_id provided is already in use.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error message indicating that the warehouse already exists
 * components:
 *   schemas:
 *     Warehouse:
 *       type: object
 *       required:
 *         - warehouse_id
 *         - warehouse_name
 *         - latitude
 *         - longitude
 *         - warehouse_dimensions
 *         - energy_resource
 *         - cooling_units
 *         - sensors
 *         - userId
 *         - email
 *       properties:
 *         warehouse_id:
 *           type: string
 *           description: Unique identifier for the warehouse
 *           example: c8fd49b0-7579-11ef-9e73-658fb0bea526
 *         warehouse_name:
 *           type: string
 *           description: Name of the warehouse
 *           example: Main Warehouse
 *         latitude:
 *           type: number
 *           description: Latitude of the warehouse location
 *           example: 40.7128
 *         longitude:
 *           type: number
 *           description: Longitude of the warehouse location
 *           example: -74.0060
 *         warehouse_dimensions:
 *           type: object
 *           properties:
 *             length:
 *               type: number
 *               description: Length of the warehouse
 *               example: 50
 *             width:
 *               type: number
 *               description: Width of the warehouse
 *               example: 30
 *             height:
 *               type: number
 *               description: Height of the warehouse
 *               example: 20
 *           required:
 *             - length
 *             - width
 *             - height
 *         energy_resource:
 *           type: string
 *           description: Type of energy resource used by the warehouse
 *           example: Solar
 *         cooling_units:
 *           type: number
 *           description: Number of cooling units in the warehouse
 *           example: 10
 *         sensors:
 *           type: number
 *           description: Number of sensors in the warehouse
 *           example: 15
 *         userId:
 *           type: string
 *           description: User ID associated with the warehouse
 *           example: 9a7e5c8e-72e3-45a7-b74f-d0072b0e6c54
 *         email:
 *           type: string
 *           description: Email address associated with the warehouse
 *           example: example@example.com
 */
router.post('/addwarehouse', async (req, res) => {
  try {
    const existingWarehouse = await warehouse.findOne({
      $or: [{ warehouse_id: req.body.warehouse_id }],
    });

    if (existingWarehouse) {
      return res.status(409).send({ message: 'Warehouse already exists' });
    }

    const newWarehouse = new warehouse(req.body);
    await newWarehouse.save();
    res.status(200).send(newWarehouse);
  } catch (error) {
    res.status(400).send(error);
  }
});

/**
 * @swagger
 * /warehouse/getallwarehouse:
 *   get:
 *     summary: Get all warehouses
 *     tags: [Warehouse]
 *     responses:
 *       200:
 *         description: A list of all warehouses
 *       500:
 *         description: Error retrieving warehouse data
 */

router.get('/getallwarehouse', async (req, res) => {
  try {
    const getAllWarehouse = await warehouse.find();

    if (!getAllWarehouse) {
      return res.status(404).json({ message: 'Warehouse not found' });
    }
    res.status(200).json(getAllWarehouse);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving warehouse data', error });
  }
});


router.get('/getallwarehousetest', async (req, res) => {
  try {
    const getAllWarehouse = await warehouse.find(); // Fetch all warehouses

    if (getAllWarehouse.length === 0) { // Check if there are no warehouses
      return res.status(404).json({ message: 'No warehouses found' });
    }

    // Initialize arrays to hold the results
    let warehousesWithDetails = await Promise.all(
      getAllWarehouse.map(async (warehouse) => {
        // Populate room data using the room_id
        let roomsWithDetails = [];
        if (Array.isArray(warehouse.rooms) && warehouse.rooms.length > 0) {
          roomsWithDetails = await Promise.all(
            warehouse.rooms.map(async (roomId) => {
              const roomData = await roomModel.findOne({ room_id: roomId }).select('room_name racks power_point slot level_slots room_id');
              return roomData;
            })
          );
        }

        let gridWithDetails = [];
        if (Array.isArray(warehouse.grid) && warehouse.grid.length > 0) {
          gridWithDetails = await Promise.all(
            warehouse.grid.map(async (gridId) => {
              const gridData = await gridModel.findOne({ grid_id: gridId }).select('grid_name output_voltage max_output_current output_connector_type grid_id');
              return gridData;
            })
          );
        }

        let dgsetWithDetails = [];
        if (Array.isArray(warehouse.dgset) && warehouse.dgset.length > 0) {
          dgsetWithDetails = await Promise.all(
            warehouse.dgset.map(async (dgsetId) => {
              const dgsetData = await dgsetModel.findOne({ dgset_id: dgsetId }).select('dgset_name output_voltage max_output_current fuel_type fuel_capacity output_connector_type motor_type dgset_id');
              return dgsetData;
            })
          );
        }



        // Return the warehouse data with populated rooms and power sources
        const { rooms, grid, dgset, ...warehouseWithoutDetails } = warehouse.toObject(); // Convert to plain object
        return {
          ...warehouseWithoutDetails,
          rooms: roomsWithDetails,
          grids : gridWithDetails,
          dgsets : dgsetWithDetails,
        };
      })
    );

    return res.status(200).json(warehousesWithDetails);
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ message: 'Error retrieving warehouse data', error });
  }
});


/**
 * @swagger
 * /warehouse/getallwarehouse/{userId}:
 *   get:
 *     summary: Get all warehouses by user ID with pagination
 *     tags: [Warehouse]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID associated with the warehouses, Example User ID c8fd49b0-7579-11ef-9e73-658fb0bea526
 *       - in: query
 *         name: page
 *         required: true
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Page number for pagination (0-based index)
 *       - in: query
 *         name: pageSize
 *         required: true
 *         schema:
 *           type: integer
 *           default: 12
 *         description: Number of items per page for pagination
 *     responses:
 *       200:
 *         description: A list of warehouses for the specified user with pagination metadata
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       warehouse_id:
 *                         type: string
 *                         description: Unique identifier for the warehouse
 *                       warehouse_name:
 *                         type: string
 *                         description: Name of the warehouse
 *                       latitude:
 *                         type: number
 *                         description: Latitude of the warehouse location
 *                       longitude:
 *                         type: number
 *                         description: Longitude of the warehouse location
 *                       warehouse_dimensions:
 *                         type: object
 *                         properties:
 *                           length:
 *                             type: number
 *                             description: Length of the warehouse
 *                           width:
 *                             type: number
 *                             description: Width of the warehouse
 *                           height:
 *                             type: number
 *                             description: Height of the warehouse
 *                       energy_resource:
 *                         type: string
 *                         description: Type of energy resource used by the warehouse
 *                       cooling_units:
 *                         type: number
 *                         description: Number of cooling units in the warehouse
 *                       sensors:
 *                         type: number
 *                         description: Number of sensors in the warehouse
 *                       userId:
 *                         type: string
 *                         description: User ID associated with the warehouse
 *                       email:
 *                         type: string
 *                         description: Email address associated with the warehouse
 *                 hasNext:
 *                   type: boolean
 *                   description: Flag indicating if there are more pages available
 *                 totalElements:
 *                   type: integer
 *                   description: Total number of warehouses for the specified user
 *                 totalPages:
 *                   type: integer
 *                   description: Total number of pages available
 *       500:
 *         description: Internal server error when retrieving warehouse data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error message describing the internal server error
 *                 error:
 *                   type: object
 *                   example: Detailed error information
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: Name of the error
 *                     message:
 *                       type: string
 *                       example: Detailed message of the error
 *                     stack:
 *                       type: string
 *                       example: Stack trace of the error
 */

router.get('/getallwarehouse/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const page = parseInt(req.query.page) || 0;
    const pageSize = parseInt(req.query.pageSize) || 12;
    console.log(page, pageSize);

    // Calculate the skip value (how many records to skip)
    const skip = page * pageSize;

    // Get the total count of warehouses for the user (for pagination metadata)
    const totalElements = await warehouse.countDocuments({ userId });

    // Calculate totalPages and check if the requested page is out of range
    const totalPages = Math.ceil(totalElements / pageSize);

    // If the requested page is out of range, return empty data
    if (page >= totalPages) {
      return res.status(200).json({
        data: [],
        hasNext: false,
        totalElements,
        totalPages,
      });
    }

    // Get the paginated warehouses
    const getAllWarehouse = await warehouse
      .find({ userId })
      .skip(skip)
      .limit(pageSize);

    // Check if there is a next page
    const hasNext = page < totalPages - 1;

    // Respond with warehouses, pagination metadata, and hasNext flag
    res.status(200).json({
      data: getAllWarehouse,
      hasNext,
      totalElements,
      totalPages,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving warehouse data', error });
  }
});

router.get('/getallwarehousetest/:userId', async (req, res) => {
  try {
    const { userId } = req.params; // Get the userId from the route parameters

    // Fetch all warehouses for the specific userId
    const getAllWarehouse = await warehouse.find({ userId }); 

    if (getAllWarehouse.length === 0) { // Check if there are no warehouses for this user
      return res.status(404).json({ message: 'No warehouses found for this user' });
    }

    // Initialize arrays to hold the results
    let warehousesWithDetails = await Promise.all(
      getAllWarehouse.map(async (warehouse) => {
        // Populate room data using the room_id
        let roomsWithDetails = [];
        if (Array.isArray(warehouse.rooms) && warehouse.rooms.length > 0) {
          roomsWithDetails = await Promise.all(
            warehouse.rooms.map(async (roomId) => {
              const roomData = await roomModel.findOne({ room_id: roomId }).select('room_name racks power_point slot level_slots room_id');
              return roomData;
            })
          );
        }

        let gridWithDetails = [];
        if (Array.isArray(warehouse.grid) && warehouse.grid.length > 0) {
          gridWithDetails = await Promise.all(
            warehouse.grid.map(async (gridId) => {
              const gridData = await gridModel.findOne({ grid_id: gridId }).select('grid_name output_voltage max_output_current output_connector_type grid_id');
              return gridData;
            })
          );
        }

        let dgsetWithDetails = [];
        if (Array.isArray(warehouse.dgset) && warehouse.dgset.length > 0) {
          dgsetWithDetails = await Promise.all(
            warehouse.dgset.map(async (dgsetId) => {
              const dgsetData = await dgsetModel.findOne({ dgset_id: dgsetId }).select('dgset_name output_voltage max_output_current fuel_type fuel_capacity output_connector_type motor_type dgset_id');
              return dgsetData;
            })
          );
        }

        // Return the warehouse data with populated rooms and power sources
        const { rooms, grid, dgset, ...warehouseWithoutDetails } = warehouse.toObject(); // Convert to plain object
        return {
          ...warehouseWithoutDetails,
          rooms: roomsWithDetails,
          grids: gridWithDetails,
          dgsets: dgsetWithDetails,
        };
      })
    );

    return res.status(200).json(warehousesWithDetails);
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ message: 'Error retrieving warehouse data', error });
  }
});


// rooms in use
router.get('/roomsinuse/:userId', async (req, res) => {
  try {
    const { userId } = req.params; // Get the userId from the route parameters

    // Fetch all warehouses for the specific userId
    const getAllWarehouse = await warehouse.find({ userId });

    if (getAllWarehouse.length === 0) { // Check if there are no warehouses for this user
      return res.status(404).json({ message: 'No warehouses found for this user' });
    }

    // Initialize an array to collect all room_ids
    let roomIds = [];

    // Iterate over each warehouse to collect room_ids
    getAllWarehouse.forEach((warehouse) => {
      if (Array.isArray(warehouse.rooms) && warehouse.rooms.length > 0) {
        // Collect room_id from each room in the warehouse
        const ids = warehouse.rooms.map(room => room.room_id);
        roomIds = [...roomIds, ...ids];
      }
    });

    // If no room_ids found
    if (roomIds.length === 0) {
      return res.status(404).json({ message: 'No rooms in use for this user' });
    }

    // Return the list of room_ids
    return res.status(200).json({ room_ids: roomIds });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ message: 'Error retrieving room data', error });
  }
});




// /**
//  * @swagger
//  * /warehouse/getwarehouse/{warehouse_id}:
//  *   get:
//  *     summary: Get warehouse by warehouse ID
//  *     tags: [Warehouse]
//  *     parameters:
//  *       - in: path
//  *         name: warehouse_id
//  *         required: true
//  *         schema:
//  *           type: string
//  *         description: Warehouse ID
//  *     responses:
//  *       200:
//  *         description: A warehouse object
//  *       404:
//  *         description: Warehouse not found
//  *       500:
//  *         description: Error retrieving warehouse data
//  */
router.get('/getwarehouse/:warehouse_id', async (req, res) => {
  try {
    const { warehouse_id } = req.params;
    console.log(warehouse_id);
    const getWarehouse = await warehouse.findOne({ warehouse_id });

    if (!getWarehouse) {
      return res.status(404).json({ message: 'Warehouse not found' });
    }
    res.status(200).json(getWarehouse);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving warehouse data', error });
  }
});

router.get('/getwarehousetest/:warehouseId', async (req, res) => {
  try {
    const { warehouseId } = req.params; // Get warehouseId from the route parameters

    // Fetch the warehouse by warehouseId
    const warehouseData = await warehouse.findOne({ warehouse_id : warehouseId });

    if (!warehouseData) { // If no warehouse is found
      return res.status(404).json({ message: 'Warehouse not found' });
    }

    // Populate room data using the room_id
    let roomsWithDetails = [];
    if (Array.isArray(warehouseData.rooms) && warehouseData.rooms.length > 0) {
      roomsWithDetails = await Promise.all(
        warehouseData.rooms.map(async (roomId) => {
          const roomData = await roomModel.findOne({ room_id: roomId }).select('room_name racks power_point slot level_slots room_id');
          return roomData;
        })
      );
    }

    // Populate grid data using the grid_id
    let gridWithDetails = [];
    if (Array.isArray(warehouseData.grid) && warehouseData.grid.length > 0) {
      gridWithDetails = await Promise.all(
        warehouseData.grid.map(async (gridId) => {
          const gridData = await gridModel.findOne({ grid_id: gridId }).select('grid_name output_voltage max_output_current output_connector_type grid_id');
          return gridData;
        })
      );
    }

    // Populate DGSet data using the dgset_id
    let dgsetWithDetails = [];
    if (Array.isArray(warehouseData.dgset) && warehouseData.dgset.length > 0) {
      dgsetWithDetails = await Promise.all(
        warehouseData.dgset.map(async (dgsetId) => {
          const dgsetData = await dgsetModel.findOne({ dgset_id: dgsetId }).select('dgset_name output_voltage max_output_current fuel_type fuel_capacity output_connector_type motor_type dgset_id');
          return dgsetData;
        })
      );
    }

    // Return the warehouse data with populated rooms and power sources
    const { rooms, grid, dgset, ...warehouseWithoutDetails } = warehouseData.toObject(); // Convert to plain object
    return res.status(200).json({
      message: 'Warehouse details fetched successfully',
      warehouse: {
        ...warehouseWithoutDetails,
        rooms: roomsWithDetails,
        grids: gridWithDetails,
        dgsets: dgsetWithDetails,
      },
    });
  } catch (error) {
    console.error('Error fetching warehouse by ID:', error); // Log the error for debugging
    res.status(500).json({ message: 'Error retrieving warehouse data', error });
  }
});


/**
 * @swagger
 * /warehouse/deletewarehouse/{warehouse_id}:
 *   delete:
 *     summary: Delete a warehouse by its ID
 *     tags: [Warehouse]
 *     parameters:
 *       - in: path
 *         name: warehouse_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the warehouse to be deleted
 *     responses:
 *       200:
 *         description: Warehouse deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Confirmation message indicating successful deletion of the warehouse
 *       204:
 *         description: Warehouse not found. No content to return.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Message indicating that the warehouse was not found
 *       500:
 *         description: Internal server error while attempting to delete the warehouse
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error message describing the issue
 *                 error:
 *                   type: object
 *                   example: Detailed error information
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: Name of the error
 *                     message:
 *                       type: string
 *                       example: Detailed message of the error
 *                     stack:
 *                       type: string
 *                       example: Stack trace of the error
 */

router.delete('/deletewarehouse/:warehouse_id', async (req, res) => {
  try {
    const { warehouse_id } = req.params;
    const result = await warehouse.findOneAndDelete({ warehouse_id });

    if (!result) {
      return res.status(204).send({ message: 'Warehouse not found' });
    }

    res.status(200).send({ message: 'Warehouse deleted successfully' });
  } catch (error) {
    res.status(500).send({ message: 'Error deleting warehouse', error });
  }
});

/**
 * @swagger
 * /warehouse/updatewarehouse/{warehouse_id}:
 *   put:
 *     summary: Update a warehouse by its ID
 *     tags: [Warehouse]
 *     parameters:
 *       - in: path
 *         name: warehouse_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the warehouse to be updated
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               warehouse_id:
 *                 type: string
 *                 description: Unique identifier of the warehouse
 *               warehouse_name:
 *                 type: string
 *                 description: Name of the warehouse
 *               latitude:
 *                 type: number
 *                 format: float
 *                 description: Latitude coordinate of the warehouse
 *               longitude:
 *                 type: number
 *                 format: float
 *                 description: Longitude coordinate of the warehouse
 *               warehouse_dimensions:
 *                 type: object
 *                 properties:
 *                   length:
 *                     type: number
 *                     format: float
 *                     description: Length of the warehouse
 *                   width:
 *                     type: number
 *                     format: float
 *                     description: Width of the warehouse
 *                   height:
 *                     type: number
 *                     format: float
 *                     description: Height of the warehouse
 *               energy_resource:
 *                 type: string
 *                 description: Energy resource used by the warehouse
 *               cooling_units:
 *                 type: number
 *                 description: Number of cooling units in the warehouse
 *               sensors:
 *                 type: number
 *                 description: Number of sensors in the warehouse
 *               userId:
 *                 type: string
 *                 description: User ID associated with the warehouse
 *               email:
 *                 type: string
 *                 description: Email associated with the warehouse
 *     responses:
 *       200:
 *         description: Warehouse updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 warehouse_id:
 *                   type: string
 *                   description: Unique identifier of the warehouse
 *                 warehouse_name:
 *                   type: string
 *                   description: Name of the warehouse
 *                 latitude:
 *                   type: number
 *                   format: float
 *                   description: Latitude coordinate of the warehouse
 *                 longitude:
 *                   type: number
 *                   format: float
 *                   description: Longitude coordinate of the warehouse
 *                 warehouse_dimensions:
 *                   type: object
 *                   properties:
 *                     length:
 *                       type: number
 *                       format: float
 *                       description: Length of the warehouse
 *                     width:
 *                       type: number
 *                       format: float
 *                       description: Width of the warehouse
 *                     height:
 *                       type: number
 *                       format: float
 *                       description: Height of the warehouse
 *                 energy_resource:
 *                   type: string
 *                   description: Energy resource used by the warehouse
 *                 cooling_units:
 *                   type: number
 *                   description: Number of cooling units in the warehouse
 *                 sensors:
 *                   type: number
 *                   description: Number of sensors in the warehouse
 *                 userId:
 *                   type: string
 *                   example: User ID associated with the warehouse
 *                 email:
 *                   type: string
 *                   example: Email associated with the warehouse
 *       204:
 *         description: Warehouse not found. No content to return.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Message indicating that the warehouse was not found
 *       500:
 *         description: Internal server error while attempting to update the warehouse
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error message describing the issue
 *                 error:
 *                   type: object
 *                   example: Detailed error information
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: Name of the error
 *                     message:
 *                       type: string
 *                       example: Detailed message of the error
 *                     stack:
 *                       type: string
 *                       example: Stack trace of the error
 */

// Update a warehouse by warehouse_id
router.put('/updatewarehouse/:warehouse_id', async (req, res) => {
  try {
    const { warehouse_id } = req.params;
    const updateData = req.body;

    // Find the warehouse by warehouse_id and update it
    const updatedWarehouse = await warehouse.findOneAndUpdate(
      { warehouse_id },
      updateData,
      { new: true } // Return the updated document
    );

    if (!updatedWarehouse) {
      return res.status(204).json({ message: 'Warehouse not found' });
    }

    res.status(200).json(updatedWarehouse);
  } catch (error) {
    console.error('Error updating warehouse:', error);
    res.status(500).json({ message: 'Internal Server Error', error });
  }
});

router.put('/updatewarehousetest/:warehouseId', async (req, res) => {
  try {
    const { warehouseId } = req.params;
    const updatedData = req.body;

    // Find the warehouse by warehouseId and update it
    const updatedWarehouse = await warehouseModel.findOneAndUpdate(
      { warehouse_id: warehouseId }, // Match the warehouseId
      { $set: updatedData }, // Update the fields from the request body
      { new: true } // Return the updated warehouse document
    );

    if (!updatedWarehouse) {
      return res.status(404).json({ message: 'Warehouse not found' });
    }

    res.status(200).json({
      message: 'Warehouse updated successfully',
      warehouse: updatedWarehouse
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating warehouse', error });
  }
});

export default router;
