import { BryntumResourceHistogramProps, BryntumSchedulerProProps } from '@bryntum/schedulerpro-react';

const onAction = ({ source }) => {
    source.up('resourcehistogram').extraData.onToolbarAction(source);
};

const toolbarConfig = {
    cls   : 'histogram-toolbar',
    items : [
        {
            type    : 'checkbox',
            dataset : { action : 'showBarText' },
            text    : 'Show bar texts',
            tooltip : 'Check to show resource allocation in the bars',
            checked : false,
            onAction
        },
        {
            type    : 'checkbox',
            dataset : { action : 'showMaxEffort' },
            text    : 'Show max allocation',
            tooltip : 'Check to display max resource allocation line',
            checked : true,
            onAction
        },
        {
            type    : 'checkbox',
            dataset : { action : 'showBarTip' },
            text    : 'Enable bar tooltip',
            tooltip : 'Check to show tooltips when moving mouse over bars',
            checked : true,
            onAction
        }
    ]
};

const header = { 'Content-Type' : 'application/json' };
Object.defineProperty(header, 'Authorization', {
    get()      { return sessionStorage.getItem('accountJWT'); },
    enumerable : true
});

export const projectProps = {
    transport : {
        load : {
            url         : import.meta.env.VITE_PROJECT_FUNCTION_DOMAIN_URL,
            method      : 'GET',
            headers     : header,
            credentials : 'omit'
        },
        sync : {
            url         : import.meta.env.VITE_PROJECT_FUNCTION_DOMAIN_URL,
            method      : 'POST',
            headers     : header,
            credentials : 'omit'
        },
    },
    autoLoad         : true,
    autoSync         : true,
    // This config enables response validation and dumps found errors into the browser console.
    // It's only meant to be used as a development-stage helper, so please set it to false for production.
    validateResponse : true
};

export const schedulerProps : BryntumSchedulerProProps = {
    flex              : '1 1 50%',
    startDate         : new Date(2026, 3, 26),
    endDate           : new Date(2026, 4, 10),
    viewPreset        : 'dayAndWeek',
    eventStyle        : 'filled',
    tickSize          : 70,
    subGridConfigs    : {
        locked : {
            width : '30em'
        }
    },
    resourceImagePath : 'users/',
    columns : [
        {
            type  : 'resourceInfo',
            text  : 'Name',
            field : 'name',
            width : '10em'
        },
        {
            text                 : 'City',
            htmlEncodeHeaderText : false,
            field                : 'city',
            width                : '9em',
        }
    ]
};

export const histogramProps : BryntumResourceHistogramProps = {
    flex                   : '1 1 50%',
    hideHeaders            : true,
    rowHeight              : 60,
    nonWorkingTimeFeature  : true,
    scheduleTooltipFeature : false,
    showBarTip             : true,
    bbar                   : toolbarConfig,
    resourceImagePath      : 'users/',
    columns                : [
        {
            type           : 'resourceInfo',
            text           : 'Name',
            field          : 'name',
            flex           : 1,
            showEventCount : false,
        }
    ]
};