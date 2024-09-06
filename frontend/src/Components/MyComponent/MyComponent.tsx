import React, { useEffect, useState } from 'react';
import './myComponent.css';
import { DashboardType} from '../../types/thingsboardTypes';
import { getCurrentUser } from '../../api/loginApi';

import { saveDashboard } from '../../api/dashboardApi';
import {
  getAllWidgetsBundles,
  getWidgetsBundles,
} from '../../api/widgetsBundleAPI';


import { getImages } from '../../api/imageAPIs';


const MyComponent: React.FC = () => {
  // State for dashboard creation
  const [dashboardTitle, setDashboardTitle] = useState<string>('');
  const [dashboardError, setDashboardError] = useState<string | null>(null);

  // State for widget bundles
  const [widgetBundles, setWidgetBundles] = useState<any[]>([]);
  const [loadingWidgetBundles, setLoadingWidgetBundles] =
    useState<boolean>(false);
  const [currentWidgetPage, setCurrentWidgetPage] = useState<number>(0);
  const [totalWidgetPages, setTotalWidgetPages] = useState<number>(0);


  // Fetch widget bundles with parameters
  const fetchAllWidgetBundles = async () => {
    try {
      const response = await getAllWidgetsBundles();
      setLoadingWidgetBundles(true);
      setWidgetBundles(response.data || []);
    } catch (error) {
      console.error('Failed to fetch widget bundles', error);
    } finally {
      setLoadingWidgetBundles(false);
    }
  };

  

  // Fetch widget bundles with parameters
  const fetchWidgetBundles = async (page: number) => {
    try {
      setLoadingWidgetBundles(true);
      const params = {
        pageSize: 10,
        page: page,
      };
      const response = await getWidgetsBundles(params);
      setWidgetBundles(response.data.data || []);
      setTotalWidgetPages(response.data.totalPages ?? 0);
      // console.log(response.data)
    } catch (error) {
      console.error('Failed to fetch widget bundles', error);
    } finally {
      setLoadingWidgetBundles(false);
    }
  };

  // Handle dashboard creation
  const handleCreateDashboard = async () => {
    try {
      const newDashboard: DashboardType = {
        title: dashboardTitle,
      };
      await saveDashboard(newDashboard);
      setDashboardTitle('');
      alert('Dashboard created successfully!');
    } catch (error) {
      setDashboardError('Failed to create dashboard');
    }
  };

  const handleGetAll = async () => {
    fetchAllWidgetBundles();
    fetchWidgetBundles(currentWidgetPage);
    const currentuser = await getCurrentUser();
    console.log('Current User: \n', currentuser.data);

    const params = {
      pageSize: 10000,
      page: 0
    }

    const imageResponse = await getImages(params)
    console.log(imageResponse.data)
  };


  const handlePageChangeWidgets = (page: number) => {
    if (page >= 0 && page < totalWidgetPages) {
      setCurrentWidgetPage(page);
    }
  };

  useEffect(() => {
    fetchAllWidgetBundles(); // Fetch widget bundles on component mount
    fetchWidgetBundles(currentWidgetPage);
  }, []);

  useEffect(() => {
    fetchWidgetBundles(currentWidgetPage);
  }, [currentWidgetPage]);

  return (
    <div className="menu-data mycomponent">
      <h1>MyComponent</h1>
      <button onClick={handleGetAll}>Get Data</button>

      {/* Create Dashboard */}
      <div>
        <h2>Create Dashboard</h2>
        <input
          type="text"
          value={dashboardTitle}
          onChange={(e) => setDashboardTitle(e.target.value)}
          placeholder="Dashboard Title"
        />
        <button onClick={handleCreateDashboard}>Create Dashboard</button>
        {dashboardError && <p>{dashboardError}</p>}
      </div>


      {/* Widget Bundles List */}
      <div>
        <h2>Widget Bundles</h2>
        {loadingWidgetBundles ? (
          <p>Loading widget bundles...</p>
        ) : (
          <ul>
            {widgetBundles.map((bundle) => (
              <li key={bundle.id.id}>{bundle.name}</li>
            ))}
          </ul>
        )}

        {/* Pagination */}
        <button
          onClick={() => handlePageChangeWidgets(currentWidgetPage - 1)}
          disabled={currentWidgetPage <= 0}
        >
          Previous
        </button>
        <span>
          {currentWidgetPage + 1} / {totalWidgetPages}
        </span>
        <button
          onClick={() => handlePageChangeWidgets(currentWidgetPage + 1)}
          disabled={currentWidgetPage >= totalWidgetPages - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
};




export default MyComponent;
