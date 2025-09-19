import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    MdAdd,
    MdList,
    MdLocalShipping,
    MdPayment,
    MdAdminPanelSettings,
    MdCategory,
    MdEmail,
    MdBrandingWatermark
} from 'react-icons/md';

const SideBar = () => {
    const pathname = usePathname()
    const menuItems = [
        { name: 'Add Product', path: '/seller', icon: MdAdd },
        { name: 'Product List', path: '/seller/product-list', icon: MdList },
        { name: 'Categories', path: '/seller/categories', icon: MdCategory },
        { name: 'Brands', path: '/seller/brands', icon: MdBrandingWatermark },
        { name: 'Orders', path: '/seller/orders', icon: MdLocalShipping },
        { name: 'Payment Methods', path: '/seller/payment-methods', icon: MdPayment },
        { name: 'Communications', path: '/seller/communications', icon: MdEmail },
        { name: 'Admin Users', path: '/seller/admin-users', icon: MdAdminPanelSettings },
    ];

    return (
        <div className='md:w-64 w-16 border-r min-h-screen text-base border-gray-300 py-2 flex flex-col'>
            {menuItems.map((item) => {

                const isActive = pathname === item.path;

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
                            <item.icon className="w-7 h-7 text-gray-700" />
                            <p className='md:block hidden text-center'>{item.name}</p>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
};

export default SideBar;
