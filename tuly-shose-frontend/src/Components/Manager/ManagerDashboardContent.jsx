import React from 'react';
import { useParams } from 'react-router-dom';
import ManagerBrand from './ManagerBrand';
import ManagerCategory from './ManagerCategory';
import ManagerColor from './ManagerColor';
import ManagerForm from './ManagerForm';
import ManagerMaterial from './ManagerMaterial';
import ManagerSize from './ManagerSize';


const ManagerDashboardContent = () => {
    const { section } = useParams();

    switch (section) {
        case 'brands':
            return <ManagerBrand />;
        case 'categories':
            return <ManagerCategory />;
        case 'colors':
            return <ManagerColor />;
        case 'forms':
            return <ManagerForm />;
        case 'materials':
            return <ManagerMaterial />;
        case 'sizes':
            return <ManagerSize />;

        default:
            return <div>Welcome to Manager Dashboard</div>;
    }
};

export default ManagerDashboardContent;
