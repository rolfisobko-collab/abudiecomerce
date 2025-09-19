import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    MdAdd,
    MdList,
    MdLocalShipping,
    MdPayment,
    MdAdminPanelSettings
} from 'react-icons/md';

const PermissionSidebar = ({ userPermissions }) => {
    const pathname = usePathname()
    
    // Definir todos los elementos del menú con sus permisos
    const allMenuItems = [
        { name: 'Add Product', path: '/seller', icon: MdAdd, permission: 'addProduct' },
        { name: 'Product List', path: '/seller/product-list', icon: MdList, permission: 'productList' },
        { name: 'Orders', path: '/seller/orders', icon: MdLocalShipping, permission: 'orders' },
        { name: 'Payment Methods', path: '/seller/payment-methods', icon: MdPayment, permission: 'paymentMethods' },
        { name: 'Admin Users', path: '/seller/admin-users', icon: MdAdminPanelSettings, permission: 'adminUsers' },
    ];

    // Filtrar elementos del menú basado en permisos
    const menuItems = allMenuItems.filter(item => {
        // Si no hay permisos definidos, mostrar todos (para desarrollo)
        if (!userPermissions) return true;
        
        // Verificar si el usuario tiene el permiso específico
        return userPermissions[item.permission] === true;
    });

    return (
        <div className='md:w-64 w-16 border-r min-h-screen text-base border-gray-300 py-2 flex flex-col'>
            {menuItems.map((item) => {
                const isActive = pathname === item.path;
                const IconComponent = item.icon;

                return (
                    <Link href={item.path} key={item.name} passHref>
                        <div
                            className={
                                `flex items-center py-3 px-4 gap-3 ${isActive
                                    ? "border-r-4 md:border-r-[6px] bg-[#feecaf]/10 border-[#feecaf]"
                                    : "hover:bg-gray-100/90 border-white"
                                }`
                            }
                        >
                            <IconComponent className="w-7 h-7 text-gray-800" />
                            <p className='md:block hidden text-center'>{item.name}</p>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
};

export default PermissionSidebar;
