import express from "express";
import {dgsetModel} from '../schemas/dgset_meatadata.js'


const router = express.Router();

router.post('/adddgset', async(req, res) => {

    try {
        const newdgset = new dgsetModel(req.body)
        await newdgset.save();
        res.status(200).send(newdgset);
    } catch (error) {
        res.send(500).send({message: "failed to add DGSet ", details: error.message})
    }

})

router.get('/getalldgsets', async (req, res) => {
    try {
        const dgsets = await dgsetModel.find(); // Fetch all DGSet entries from the database
        if (!dgsets || dgsets.length === 0) {
            return res.status(404).json({ message: 'No DGSets found' });
        }
        res.status(200).json(dgsets);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch DGSets', details: error.message });
    }
});

router.get('/getdgset/:dgset_id', async (req, res) => {
    const { dgset_id } = req.params;

    try {
        const dgset = await dgsetModel.findOne({ dgset_id }); // Fetch the DGSet with the given dgset_id

        if (!dgset) {
            return res.status(404).json({ message: 'DGSet not found' });
        }

        return res.status(200).json(dgsets);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error', error });
    }
});


router.put('/updatedgset/:dgset_id', async (req, res) => {
    const { dgset_id } = req.params;
    
    try {
        const updatedDgset = await dgsetModel.findOneAndUpdate(
            { dgset_id }, 
            req.body,   
            { new: true }
        );

        if (!updatedDgset) {
            return res.status(404).json({ message: 'DGSet not found' });
        }

        return res.status(200).json(updatedDgset);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error', error });
    }
});

router.put('/updatedgset', async (req, res) => {
    const { id, dgsets} = req.body;
    console.log(id, dgsets)

    if (!id || !dgsets || dgsets.length === 0) {
        return res.status(400).json({ error: 'Id and dgsets IDs are required' });
    }
    // console.log(req.body)

    try {
        dgsets.map(async (dgsetId) => {
            const dgSetToUpdate = await dgsetModel.findOne({dgset_id : dgsetId})
            if (!dgSetToUpdate){
                console.warn(`grid not found for ID: ${gridId}`);
                return;
            }

            dgSetToUpdate.warehouse_id = id;
            dgSetToUpdate.save();
        })
        res.json({ message: 'DGSet updated successfully' });
    } catch (error) {
        console.error(error.stack);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})


router.delete('/deletedgset/:dgset_id', async (req, res) => {
    const { dgset_id } = req.params;  // Get the dgset_id from the request parameters
    
    try {
        // Find and delete the dgset by its ID
        const deletedDgset = await dgsetModel.findOneAndDelete({ dgset_id });
        
        if (!deletedDgset) {
            return res.status(404).json({ message: 'DGSet not found' });
        }

        return res.status(200).json({
            message: 'DGSet deleted successfully',
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error', error });
    }
});



export default router