import React, { useState, useEffect } from 'react';
import { requestCounter, requestDuration, customEventCounter } from '../metrics/metrics.jsx';

function App() {
  const [metrics, setMetrics] = useState({
    pageViews: 0,
    customEvents: 0
  });
  
  const [lastCustomEvent, setLastCustomEvent] = useState({
    time: 'None',
    details: 'None'
  });

  // Record page view when component mounts
  useEffect(() => {
    const startTime = performance.now();
    
    // Record a page view
    requestCounter.add(1, { 
      component: 'App', 
      action: 'page_view' 
    });
    
    // Update UI counter
    setMetrics(prev => ({
      ...prev,
      pageViews: prev.pageViews + 1
    }));
    
    // Measure page load time
    const loadTime = performance.now() - startTime;
    requestDuration.record(loadTime, {
      component: 'App',
      operation: 'page_load'
    });
  }, []);

  const handleCustomEvent = () => {
    const eventTime = new Date();
    const eventType = 'button_click';
    
    // Record the custom event
    customEventCounter.add(1, { 
      component: 'App', 
      action: eventType,
      timestamp: eventTime.getTime()
    });
    
    // Update UI state
    setMetrics(prev => ({
      ...prev,
      customEvents: prev.customEvents + 1
    }));
    
    // Update last event details
    setLastCustomEvent({
      time: eventTime.toLocaleTimeString(),
      details: `Custom event "${eventType}" triggered`
    });
  };

  return (
    <div className="App">
      <h1>OpenTelemetry Metrics in React</h1>
      
      <div>
        <h2>Local Metrics Display</h2>
        <p>Page views: {metrics.pageViews}</p>
        
        <div>
          <button 
            className="custom-event-btn"
            onClick={handleCustomEvent}
          >
            Trigger Custom Event
          </button>
          
          {lastCustomEvent.time !== 'None' && (
            <div className="custom-event-container">
              <h3>Last Custom Event</h3>
              <p>Time: <span className="event-detail">{lastCustomEvent.time}</span></p>
              <p>Details: <span className="event-detail">{lastCustomEvent.details}</span></p>
              <p>Count: <span className="event-detail">{metrics.customEvents}</span></p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;