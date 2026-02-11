import { useEffect, useRef } from 'react';
import {
    BryntumSchedulerPro,
    BryntumResourceHistogram,
    BryntumSchedulerProProjectModel,
    BryntumSplitter,
    BryntumButton
} from '@bryntum/schedulerpro-react';
import { histogramProps, schedulerProps, projectProps } from '../lib/schedulerProConfig';

function SchedulerPro() {
    const schedulerRef = useRef(null);
    const histogramRef = useRef(null);
    const projectRef   = useRef(null);

    // Setup partnership between scheduler and histogram
    useEffect(() => {
        histogramRef.current.instance.addPartner(schedulerRef.current.instance);
    }, []);

    // Toolbar checkboxes click handler
    const onToolbarAction = (source) => {
        const action = source.dataset.action;
        histogramRef.current.instance[action] = source.checked;
    };

    // Zoom In/Out handler
    const onZoom = ({ source }) => {
        const {
            dataset : { action }
        } = source;
        schedulerRef.current.instance[action]();
    };

    return (
        <div className="demo-app">
            <div className="demo-toolbar">
                <BryntumButton
                    dataset={{ action : 'zoomIn' }}
                    icon="b-icon-search-plus"
                    text="Zoom in"
                    onAction={onZoom}
                />
                <BryntumButton
                    dataset={{ action : 'zoomOut' }}
                    icon="b-icon-search-minus"
                    text="Zoom out"
                    onAction={onZoom}
                />
            </div>
            <BryntumSchedulerProProjectModel
                ref={projectRef}
                {...projectProps}
            />
            <BryntumSchedulerPro
                ref={schedulerRef}
                project={projectRef}
                {...schedulerProps}
            />
            <BryntumSplitter />
            <BryntumResourceHistogram
                ref={histogramRef}
                project={projectRef}
                extraData={{ onToolbarAction }}
                {...histogramProps}
            />
        </div>
    );
}

export default SchedulerPro;