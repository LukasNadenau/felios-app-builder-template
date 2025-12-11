import React from 'react';
import { PanelMenu } from 'primereact/panelmenu';
import { MenuItem } from 'primereact/menuitem';
import { useNavigate } from 'react-router-dom';

const AppMenu = () => {
    const navigate = useNavigate();

    const model: MenuItem[] = [
        {
            label: 'Home',
            items: [
                {
                    label: 'Dashboard',
                    icon: 'pi pi-fw pi-home',
                    command: () => navigate('/')
                }
            ]
        },
        {
            label: 'Features',
            items: [
                {
                    label: 'Example Feature',
                    icon: 'pi pi-fw pi-star',
                    command: () => navigate('/example-feature')
                }
            ]
        }
    ];

    return (
        <PanelMenu
            model={model}
            className="layout-menu"
        />
    );
};

export default AppMenu;
