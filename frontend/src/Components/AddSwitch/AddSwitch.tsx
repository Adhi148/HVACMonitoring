import LoadingButton from "@mui/lab/LoadingButton";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import SaveIcon from '@mui/icons-material/Save';
import { useEffect, useState } from "react";
import Loader from "../Loader/Loader";
import CustomSnackBar from "../SnackBar/SnackBar";
import { getAllGRID } from "../../api/gridAPIs";
import { getAllDGSET } from "../../api/dgsetAPIs";
import { addSwitch } from "../../api/powerSwitchAPIs";

interface FormData {
    powerSource_status: string | boolean,
    dgset_id : string,
    grid_id : string,
    power_source: string,
}

const AddSwitch = () => {
    const [open, setOpen] = useState<boolean>(false);
    const [snackbarType, setSnackbarType] = useState<'success' | 'error'>('success');
    const [message, setMessage] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [addButtonLoader, setAddButtonLoader] = useState<boolean>(false);
    const [formData, setFormdata] = useState<FormData>({
        powerSource_status: '',
        power_source:"",
        dgset_id:"",
        grid_id:""
    });
    const [powerData, setPowerData] = useState<any[]>([]);

    const handleChange = (event: any) => {
        const { name, value } = event.target;
        setFormdata({
            ...formData,
            [name]: value,
        });
    };

    const getAllGrids = async () => {
        const response = await getAllGRID();
        return response.data.grids;
    }

    const getAllDGSets = async () => {
        const response = await getAllDGSET();
        return response.data.dgsets;
    }

    useEffect(() => {
        const fetchData = async () => {
            let data;
            if (formData.powerSource_status === "on") {
                data = await getAllDGSets();
            } else {
                data = await getAllGrids();
            }
            setPowerData(data);
        };

        fetchData();
    }, [formData]);

    const handleReset = () => {
        setFormdata({
            powerSource_status: '',
            power_source: '',
            dgset_id: '',
            grid_id: ''
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setAddButtonLoader(true);

        let finalData: Partial<FormData> = {
            powerSource_status: formData.powerSource_status === "on" ? true : false
        };

        if (formData.powerSource_status === "on" && formData.power_source) {
            finalData.dgset_id = formData.power_source;
        }

        if (formData.powerSource_status === "off" && formData.power_source) {
            finalData.grid_id = formData.power_source;
        }

        console.log(finalData)

        try {
            const response = await addSwitch(finalData);
            console.log(response.data);
            setTimeout(() => {
                handleReset();
                setAddButtonLoader(false);
                setOpen(true);
                setSnackbarType('success');
                setMessage('Switch added successfully');
            }, 1000);
        } catch (error) {
            setTimeout(() => {
                setAddButtonLoader(false);
                setOpen(true);
                setSnackbarType('error');
                setMessage('Failed to add switch');
                console.error('Error submitting form:', error);
            }, 1000);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 700);

        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            {loading ? (
                <div className="menu-data">
                    <Loader />
                </div>
            ) : (
                <div className="menu-data">
                    <div className="warehouse">
                        <h3>Add Switch</h3>
                        <form className="warehouse-form" onSubmit={handleSubmit}>
                                <FormControl fullWidth margin="normal">
                                    <InputLabel id="power-source-status-label">Switch Status</InputLabel>
                                    <Select
                                        labelId="power-source-status-label"
                                        id="power-source-status-select"
                                        name="powerSource_status"
                                        value={formData.powerSource_status}
                                        onChange={handleChange}
                                        label={"Switch Status"}
                                        className="textfieldss"
                                        required
                                    >
                                        <MenuItem value=""><em>None</em></MenuItem>
                                        <MenuItem value="on">ON</MenuItem>
                                        <MenuItem value="off">OFF</MenuItem>
                                    </Select>
                                </FormControl>

                                <FormControl fullWidth margin="normal">
                                    <InputLabel className="input-label-select" id="switch-label">Available Sources</InputLabel>
                                    <Select
                                        labelId="switch-label"
                                        id="switch-select"
                                        name="power_source"
                                        value={formData.power_source}
                                        label={"Available Sources"}
                                        onChange={handleChange}
                                        className="textfieldss"
                                        required
                                    >
                                        {powerData.map((item, index) => (
                                            <MenuItem key={index} value={item.grid_id || item.dgset_id}>
                                                {item.grid_name || item.dgset_name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                            <div className="sub-btn">
                                <LoadingButton
                                    size="small"
                                    type="submit"
                                    color="secondary"
                                    loading={addButtonLoader}
                                    loadingPosition="start"
                                    startIcon={<SaveIcon />}
                                    variant="contained"
                                    disabled={addButtonLoader}
                                    className="btn-save"
                                >
                                    <span>Save</span>
                                </LoadingButton>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            <CustomSnackBar
                open={open}
                setOpen={setOpen}
                snackbarType={snackbarType}
                message={message}
            />
        </>
    );
}

export default AddSwitch;
