import React from 'react';
import { useParams } from 'react-router-dom';
import ManagerBrand from './ManagerBrand';
import ManagerCategory from './ManagerCategory';
import ManagerColor from './ManagerColor';
import ManagerForm from './ManagerForm';
import ManagerMaterial from './ManagerMaterial';
import ManagerSize from './ManagerSize';
import ManagerProduct from './ManagerProduct';
import ManagerStatistic from './ManagerStatistic';
import ManagerAccount from './ManagerAccount';
import ManagerStaff from './ManagerStaff';
import ManagerOrder from './ManagerOrder';
import ManagerGender from './ManagerGender';


const ManagerDashboardContent = () => {
    const { section } = useParams();

    switch (section) {
        case 'statistic':
            return <ManagerStatistic />;
        case 'accounts':
            return <ManagerAccount />;
        case 'staffs':
            return <ManagerStaff />;
        case 'orders':
            return <ManagerOrder />;
        case 'brands':
            return <ManagerBrand />;
        case 'categories':
            return <ManagerCategory />;
        case 'colors':
            return <ManagerColor />;
        case 'forms':
            return <ManagerForm />;
        case 'genders':
            return <ManagerGender />;
        case 'materials':
            return <ManagerMaterial />;
        case 'sizes':
            return <ManagerSize />;
        case 'products':
            return <ManagerProduct />;
        default:
            return <ManagerStatistic />;
    }
};

export default ManagerDashboardContent;
