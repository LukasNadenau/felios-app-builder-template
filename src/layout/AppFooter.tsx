import React from 'react';
import { Toolbar } from 'primereact/toolbar';

const AppFooter = () => {
    const centerContent = (
        <span className="font-medium">Powered by FELIOS ⚡</span>
    );

    return (
        <Toolbar
            center={centerContent}
            className="layout-footer"
        />
    );
};

export default AppFooter;
