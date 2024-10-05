import mongoose from 'mongoose';

// Define the WidgetLayout schema (matches WidgetLayout interface)
const widgetLayoutSchema = new mongoose.Schema({
    x: { type: Number, required: false }, // X position
    y: { type: Number, required: false }, // Y position
    w: { type: Number, required: false }, // Width of the widget
    h: { type: Number, required: false }, // Height of the widget
    i: { type: String, required: false }, // Widget ID
    minW: { type: Number, required: false },
    minH: { type: Number, required: false },
    maxW: { type: Number, required: false },
    maxH: { type: Number, required: false },
    selectedDevice: { type: String, required: false }, // Optional default device
    selectedSensors: { type: [String], default: [], required: false }, // Selected sensors (array of strings)
    chart: { type: String, required: false }, // Chart type
    thresholds: {
        type: Map,
        of: Number,
        default: {},
        required: false,
    },
});

// Define the date range schema (matches dateRange in DashboardLayoutOptions)
const dateRangeSchema = new mongoose.Schema({
    startDate: { type: Number, required: false }, // Start date of the range
    endDate: { type: Number, required: false }, // End date of the range
    range: { type: String, required: false },
});

// Define the DashboardLayoutOptions schema (matches DashboardLayoutOptions interface)
const dashboardLayoutOptionsSchema = new mongoose.Schema({
    layout: { type: [widgetLayoutSchema], required: false }, // Array of widget layouts
    dateRange: { type: dateRangeSchema, required: false }, // Date range object
    limit: { type: Number, required: false }, // Limit for displaying widgets
});

// Define the Dashboard schema to store layouts based on dashboardId
const dashboardSchema = new mongoose.Schema({
    dashboardId: { type: String, required: false, unique: false }, // Unique dashboard ID
    layoutOptions: { type: dashboardLayoutOptionsSchema, required: false }, // Embedding layout options
    createdAt: { type: Date, default: Date.now }, // Timestamp for creation
    updatedAt: { type: Date, default: Date.now }, // Timestamp for last update
});

// Export the Dashboard model
const Dashboards = mongoose.model('Dashboards', dashboardSchema);
export default Dashboards;
