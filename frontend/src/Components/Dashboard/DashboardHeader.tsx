import React, { useEffect, useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import {
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { RootState } from '../../Redux/Reducer';
import { setLayout } from '../../Redux/Action/layoutActions';
import './styles/dashboardheader.css';
import { uuid } from '../../Utility/utility_functions';
import { CheckCircleOutline } from '@mui/icons-material';
import { getLayout, postLayout } from '../../api/MongoAPIInstance';

interface DashboardHeaderProps {
  onToggleEdit: () => void;
  onAddWidget: () => void;
  isEditable: boolean;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  onToggleEdit,
  onAddWidget,
  isEditable,
}) => {
  const [openDatePicker, setOpenDatePicker] = useState<boolean>(false);

  const [dateRange, setDateRange] = useState({
    startDate: new Date().getTime() - 300000,
    endDate: new Date().getTime(),
    range: 'last-5-minutes'
  })

  const { dashboardId } = useParams<string>();
  const dispatch = useDispatch();
  const storedLayout = useSelector(
    (state: RootState) => state.dashboardLayout[dashboardId || '']
  );


  useEffect(()=> {
    const fetchInitialData = async()=>{
        const response = await getLayout(dashboardId);
        if(response.data.dateRange){
          setDateRange(response.data.dateRange)
        }
        if(response.data.dateRange.range === 'custom-range'){
          setOpenDatePicker(true)
        }
    }

    fetchInitialData()

  }, [])

  const handleRangeChange = async (event: any) => {
    const value = event.target.value as string;
    setDateRange(prev => ({
      ...prev,
      range: value
    }));
    if (value === 'custom-range') {
      setOpenDatePicker(true);
    } else {
      setOpenDatePicker(false);
      let newDateRange:
        | { startDate: number; endDate: number; range: string }
        | undefined;

      switch (value) {
        case 'last-1-minute':
          newDateRange = {
            startDate: Date.now() - 60000,
            endDate: Date.now(),
            range: 'last-1-minute',
          };
          break;
        case 'last-5-minutes':
          newDateRange = {
            startDate: Date.now() - 300000,
            endDate: Date.now(),
            range: 'last-5-minutes',
          };
          break;
        case 'last-15-minutes':
          newDateRange = {
            startDate: Date.now() - 900000,
            endDate: Date.now(),
            range: 'last-15-minutes',
          };
          break;
        case 'last-30-minutes':
          newDateRange = {
            startDate: Date.now() - 1800000,
            endDate: Date.now(),
            range: 'last-30-minutes',
          };
          break;
        case 'last-1-hour':
          newDateRange = {
            startDate: Date.now() - 3600000,
            endDate: Date.now(),
            range: 'last-1-hour',
          };
          break;
        case 'last-2-hours':
          newDateRange = {
            startDate: Date.now() - 7200000,
            endDate: Date.now(),
            range: 'last-2-hours',
          };
          break;
        case 'last-1-day':
          newDateRange = {
            startDate: Date.now() - 86400000,
            endDate: Date.now(),
            range: 'last-1-day',
          };
          break;
        case 'last-7-days':
          newDateRange = {
            startDate: Date.now() - 604800000,
            endDate: Date.now(),
            range: 'last-7-days',
          };
          break;
        case 'last-30-days':
          newDateRange = {
            startDate: Date.now() - 2592000000,
            endDate: Date.now(),
            range: 'last-30-days',
          };
          break;
      }

      if (newDateRange) {
        const layoutBody = {
          ...storedLayout,
          dateRange: newDateRange,
        };
        dispatch(setLayout(dashboardId, layoutBody));
        await postLayout(dashboardId, layoutBody);
      }
    }
  };

  const handleDateRangeConfirm = async () => {
    if (dateRange.startDate && dateRange.endDate) {

      const layoutBody = {
        ...storedLayout,
        dateRange: {
          ...storedLayout.dateRange,
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
          range: 'custom-range'
        },
      }
      dispatch(
        setLayout(dashboardId, layoutBody)
      );
      await postLayout(dashboardId, layoutBody);
    }
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar
          style={{ backgroundColor: '#2BC790', height: '6vh' }}
          className="toolbar"
        >
          <Box className="toolbar-left"></Box>

          <Box className="toolbar-right">
            {openDatePicker && (
              <div className="date-fields">
                <div className="input-container">
                  <label htmlFor="date-start">Start Date</label>
                  <input
                    type="date"
                    id="date-start"
                    className="date-field"
                    value={
                      new Date(dateRange.startDate)?.toISOString().split('T')[0] || ''
                    }
                    onChange={(e) =>
                      setDateRange(prev => ({
                        ...prev, 
                        startDate: new Date(e.target.value).getTime()
                      }))
                    }
                  />
                </div>
                <div className="input-container">
                  <label htmlFor="date-end">End Date</label>
                  <input
                    type="date"
                    id="date-end"
                    className="date-field"
                    value={new Date(dateRange.endDate)?.toISOString().split('T')[0] || ''}
                    onChange={(e) =>
                      setDateRange(prev => ({
                        ...prev, 
                        endDate: new Date(e.target.value).getTime()
                      }))
                    }
                  />
                </div>
                <IconButton>
                  <CheckCircleOutline
                    sx={{ color: 'white' }}
                    onClick={handleDateRangeConfirm}
                  />
                </IconButton>
              </div>
            )}
            <FormControl
              variant="outlined"
              className="form-control"
              size="small"
              sx={{
                background: 'transparent',
              }}
            >
              <InputLabel
                id="realtime-label"
                sx={{
                  color: 'white',
                  '&.Mui-focused': {
                    color: 'white',
                  },
                  '&:hover': {
                    color: 'blue',
                  },
                }}
              >
                Realtime
              </InputLabel>
              <Select
                key={uuid()}
                labelId="realtime-label"
                value={dateRange.range}
                onChange={handleRangeChange}
                label="Realtime"
                sx={{
                  color: 'white',
                  '&.Mui-focused': {
                    color: 'white',
                  },
                  '&:hover': {
                    color: 'blue',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'white',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'white',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'blue',
                  },
                }}
              >
                <MenuItem value="last-1-minute">Last 1 Minute</MenuItem>
                <MenuItem value="last-5-minutes">Last 5 Minutes</MenuItem>
                <MenuItem value="last-15-minutes">Last 15 Minutes</MenuItem>
                <MenuItem value="last-30-minutes">Last 30 Minutes</MenuItem>
                <MenuItem value="last-1-hour">Last 1 Hour</MenuItem>
                <MenuItem value="last-2-hours">Last 2 Hours</MenuItem>
                <MenuItem value="last-1-day">Last 1 Day</MenuItem>
                <MenuItem value="last-7-days">Last 7 Days</MenuItem>
                <MenuItem value="last-30-days">Last 30 Days</MenuItem>
                <MenuItem value="custom-range">Custom Range</MenuItem>
              </Select>
            </FormControl>

            {isEditable && (
              <IconButton color="inherit" onClick={onAddWidget}>
                <AddIcon />
              </IconButton>
            )}

            <Button
              color="inherit"
              startIcon={isEditable ? <SaveIcon /> : <EditIcon />}
              onClick={onToggleEdit}
            >
              {isEditable ? 'Save' : 'Edit'}
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default DashboardHeader;
