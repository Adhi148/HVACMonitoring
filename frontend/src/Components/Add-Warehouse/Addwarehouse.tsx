import React, { useState } from 'react';
import './Addwarehouse.css';
import {
  FormControl,
  TextField,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import {
  addWarehouse,
  getAllWarehouseByUserId,
} from '../../api/MongoAPIInstance';
import { useDispatch, useSelector } from 'react-redux';
import { set_warehouse_count } from '../../Redux/Action/Action';
import { RootState } from '../../Redux/Reducer';
import {
  WarehouseData,
  WarehouseDimensions,
} from '../../types/thingsboardTypes';
import CustomSnackBar from '../SnackBar/SnackBar';
import { getCurrentUser } from '../../api/loginApi';
import { useNavigate } from 'react-router-dom';

const AddWarehouse: React.FC = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<WarehouseData>({
    warehouse_name: '',
    latitude: '',
    longitude: '',
    warehouse_dimensions: {
      length: '',
      width: '',
      height: '',
    },
    energy_resource: '',
    cooling_units: null,
    sensors: null,
    userId: '',
    email: '',
  });

  const currentUser = useSelector((state: RootState) => state.user.user);

  const [submitted, setSubmitted] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbarType, setSnackbarType] = useState<'success' | 'error'>(
    'success'
  );
  const [message, setMessage] = useState('');

  const handleReset = () => {
    setFormData({
      warehouse_name: '',
      latitude: '',
      longitude: '',
      warehouse_dimensions: {
        length: '',
        width: '',
        height: '',
      },
      energy_resource: '',
      cooling_units: null,
      sensors: null,
      userId: '',
      email: '',
    });
    setSubmitted(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('warehouse_dimensions.')) {
      const dimensionKey = name.split('.')[1] as keyof WarehouseDimensions;
      setFormData({
        ...formData,
        warehouse_dimensions: {
          ...formData.warehouse_dimensions,
          [dimensionKey]: value,
        },
      });
    } else {
      if (name === 'cooling_units' || name === 'sensors') {
        const numericValue = parseInt(value, 10);
        if (numericValue >= 0 || value === '') {
          setFormData({
            ...formData,
            [name]: value === '' ? null : value,
          });
        }
      } else {
        setFormData({
          ...formData,
          [name]: value,
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const convertedData = {
      ...formData,
      latitude: parseFloat(formData.latitude),
      longitude: parseFloat(formData.longitude),
      warehouse_dimensions: {
        length: parseFloat(formData.warehouse_dimensions.length),
        width: parseFloat(formData.warehouse_dimensions.width),
        height: parseFloat(formData.warehouse_dimensions.height),
      },
      cooling_units: Number(formData.cooling_units),
      sensors: Number(formData.sensors),
      userId: currentUser.id?.id,
      email: currentUser.email,
    };

    try {
      await getCurrentUser()
      await addWarehouse(JSON.stringify(convertedData));

      setTimeout(() => {
        handleReset();
        setLoading(false);
        setOpen(true);
        setSnackbarType('success');
        setMessage('Warehouse Added Successfully');
        fetchAllWarehouses();
      }, 1000);
    } catch (error) {
      setSnackbarType('error');

      if (error.status === 401) {
        setMessage('Session has expired navigating to login page');
        setOpen(true);
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }else{
        setTimeout(() => {
          setMessage('Failed to Add Warehouse');
          setLoading(false);
          setOpen(true);
        }, 1000);
      }

    }
  };

  const warehousecountDispatch = useDispatch();

  const fetchAllWarehouses = async () => {
    try {
      const response = await getAllWarehouseByUserId(
        currentUser.id?.id,
        undefined
      );
      warehousecountDispatch(set_warehouse_count(response.data.totalElements));
    } catch (error) {
      console.error('Failed to fetch warehouses:', error);
    }
  };

  return (
    <>
      <div className="menu-data">
        <div className="warehouse">
          <h3>Add Warehouse</h3>
          <form className="warehouse-form" onSubmit={handleSubmit}>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Warehouse Name"
                name="warehouse_name"
                value={formData.warehouse_name}
                onChange={handleChange}
                disabled={submitted}
                className="textfieldss"
              />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Latitude"
                name="latitude"
                type="number"
                value={formData.latitude}
                onChange={handleChange}
                disabled={submitted}
                className="textfieldss"
              />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Longitude"
                name="longitude"
                type="number"
                value={formData.longitude}
                onChange={handleChange}
                disabled={submitted}
                className="textfieldss"
              />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Length"
                name="warehouse_dimensions.length"
                type="number"
                value={formData.warehouse_dimensions.length}
                onChange={handleChange}
                disabled={submitted}
                className="textfieldss"
              />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Width"
                name="warehouse_dimensions.width"
                type="number"
                value={formData.warehouse_dimensions.width}
                onChange={handleChange}
                disabled={submitted}
                className="textfieldss"
              />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Height"
                name="warehouse_dimensions.height"
                type="number"
                value={formData.warehouse_dimensions.height}
                onChange={handleChange}
                disabled={submitted}
                className="textfieldss"
              />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Energy Resource"
                name="energy_resource"
                type="text"
                value={formData.energy_resource}
                onChange={handleChange}
                disabled={submitted}
                className="textfieldss"
              />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <TextField
                label="No Of Cooling Units"
                name="cooling_units"
                type="number"
                value={formData.cooling_units ?? ''}
                onChange={handleChange}
                disabled={submitted}
                className="textfieldss"
              />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <TextField
                label="No Of Sensors"
                name="sensors"
                type="number"
                value={formData.sensors ?? ''}
                onChange={handleChange}
                disabled={submitted}
                className="textfieldss"
              />
            </FormControl>
            <div className="sub-btn">
              <LoadingButton
                size="small"
                type="submit"
                color="secondary"
                loading={loading}
                loadingPosition="start"
                startIcon={<SaveIcon />}
                variant="contained"
                disabled={loading}
                className="btn-save"
              >
                <span>Save</span>
              </LoadingButton>
            </div>
          </form>
        </div>
      </div>
      <CustomSnackBar
        open={open}
        setOpen={setOpen}
        snackbarType={snackbarType}
        message={message}
      />
    </>
  );
};

export default AddWarehouse;
