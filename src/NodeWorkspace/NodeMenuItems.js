import React, { useCallback } from 'react';

const debug = (title) => {console.log('[MenuAction]', title)};

export default {
    menu: [
        {
            title: 'Clear',
            action: () => { debug('Clear') },
            submenu: null,
        },
        {
            title: 'Add node',
            submenu: [
                {
                    title: 'Input node',
                    action: () => { debug('Input node') },
                    submenu: [
                        {
                            title: 'Option #2.1.1',
                            submenu: null,
                        },
                    ],
                },
                {
                    title: 'Option #2.2',
                    submenu: null,
                },
            ],
        },
        {
            title: 'Option #3',
            submenu: [
                {
                    title: 'Option #3.1',
                    submenu: null,
                },
                {
                    title: 'Option #3.2',
                    submenu:[ 
                        {
                            title: 'Option #3.2.1',
                            submenu: null,
                        },
                    ],
                },
            ],
        },
    ],
};
