import { Menu, X, ShoppingCart, UserRound, MapPin, LogOut, AlertTriangle, Box, CircleHelp } from 'lucide-react'
import Button, { IconButton } from './Button'
import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from '../store/authStore';
import { handleLogout } from '../services/authService';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";
import { useCartStore } from '../store/cartStore';
import toast, { Toaster } from 'react-hot-toast';
import Modal from './Modal';

export const BrandLogo = () => {
    const navigate = useNavigate();
    return (
        <div onClick={() => navigate('/')} className="cursor-pointer">
            <p className='comfortaa font-extrabold tracking-tighter text-2xl lg:text-3xl text-orange-600'>
                <span className='text-green-500'>go</span>treats
            </p>
        </div>
    )
}
const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const location = useLocation();
    const user = useAuthStore((state) => state.user)
    const userDetails = useAuthStore((state) => state.userDetails)
    const items = useCartStore((state) => state.items);
    const navigate = useNavigate();

    // Prevent background scrolling when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    // Function to handle navigation and close the mobile menu
    const handleNavigation = (path: string) => {
        setIsOpen(false)
        navigate(path)
    };

    const handleLogoutClick = async () => {
        try {
            useCartStore.getState().clearCart();
            await handleLogout();
            toast.success('Logged out successfully');
            navigate('/');
            setShowLogoutModal(false);
        } catch (error) {
            toast.error('Failed to logout. Please try again.');
        }
    };


    return (
        <>
            <header className=" py-1  z-50 shadow-xl border-b ">
                <div className="container  mx-auto">
                    <div className=" bg-white  ">
                        <div className=" grid grid-cols-2 lg:grid-cols-3 px-4 md:pr-2 py-2  items-center">
                            <div className='flex items-center gap-2'>
                                <span onClick={() => setIsOpen(!isOpen)}>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="feather feather-menu md:hidden"
                                    >
                                        <line x1="3" y1="6" x2="21" y2="6" className={`origin-left transition ${isOpen ? "rotate-45 -translate-y-1" : ""}`}></line>
                                        <line x1="3" y1="12" x2="21" y2="12" className={isOpen ? "opacity-0 transition" : "transition"}></line>
                                        <line x1="3" y1="18" x2="21" y2="18" className={`origin-left transition ${isOpen ? "-rotate-45 translate-y-1" : ""}`}></line>
                                    </svg>
                                </span>
                                <BrandLogo />
                            </div>
                           <div className="hidden lg:block">
  <nav className="flex gap-10 items-center justify-center">
    <Link to="/shop" className="nav-underline">Menu</Link>
    <Link to="/concept" className="nav-underline">Concept</Link>
    <Link to="/about" className="nav-underline">About</Link>
    <Link to="/customers" className="nav-underline">Customers</Link>
    <Link to="/contact" className="nav-underline">Contact</Link>
  </nav>
</div>

                            <div className="flex justify-end gap-4">



                        
                             {!user && (
  <button
    className="custom-signup-btn px-4 py-2 h-auto md:h-12 md:px-8 md:text-lg rounded-2xl font-medium text-base bg-gradient-to-r from-orange-400 to-yellow-300 text-white shadow-md border border-orange-200 hover:from-orange-500 hover:to-yellow-400 hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center"
    style={{ minHeight: '40px', minWidth: '88px', lineHeight: 1.1 }}
    onClick={() => navigate('/register')}
  >
    <span className="drop-shadow-sm tracking-wide">Sign Up</span>
  </button>
)}






                                {user &&
                                    <div onClick={() => navigate('/checkout')} className="cursor-pointer">
                                        <IconButton>
                                            <ShoppingCart strokeWidth={1.5} size={20} />
                                            <p className='text-green-600 text-lg'>
                                                {items.reduce((total, item) => total + item.quantity, 0)}
                                            </p>
                                        </IconButton>
                                    </div>
                                }
                                {user &&
                                    <Dropdown placement="bottom-end">
                                        <DropdownTrigger>
                                            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-green-500 cursor-pointer flex items-center justify-center">
                                                <img 
                                                    src={userDetails?.profileImage || 'https://via.placeholder.com/40'} 
                                                    alt="Profile" 
                                                    className="w-full h-full object-cover"
                                                />
                                                </div>
                                        </DropdownTrigger>
                                        <DropdownMenu
                                            aria-label="User Menu"
                                            className="min-w-[190px] p-2 bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-100 mt-2 space-y-1 z-50"
                                        >
                                            <DropdownItem
                                                className="hover:bg-gray-900 hover:text-white rounded-xl px-3 py-2 flex items-center gap-2 text-base cursor-pointer"
                                                key="profile"
                                                onPress={() => navigate('/profile')}
                                            >
                                                <UserRound size={18} />
                                                <span>Profile</span>
                                            </DropdownItem>
                                            <DropdownItem
                                                className="hover:bg-gray-900 hover:text-white rounded-xl px-3 py-2 flex items-center gap-2 text-base cursor-pointer"
                                                key="orders"
                                                onPress={() => navigate('/orders')}
                                            >
                                                <Box size={18} />
                                                <span>Orders</span>
                                            </DropdownItem>
                                            <DropdownItem
                                                className="hover:bg-gray-900 hover:text-white rounded-xl px-3 py-2 flex items-center gap-2 text-base cursor-pointer"
                                                key="help"
                                                onPress={() => navigate('/contact')}
                                            >
                                                <CircleHelp size={18} />
                                                <span>Help</span>
                                            </DropdownItem>
                                            <DropdownItem
                                                className="hover:bg-red-600 hover:text-white rounded-xl px-3 py-2 flex items-center gap-2 text-base text-red-500 cursor-pointer"
                                                key="logout"
                                                onPress={() => setShowLogoutModal(true)}
                                            >
                                                <LogOut size={18} />
                                                <span>Log Out</span>
                                            </DropdownItem>
                                        </DropdownMenu>
                                    </Dropdown>
                                }

                            </div>
                        </div>
                        <AnimatePresence>
                            {isOpen && (
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: "100dvh" }}
                                    exit={{ height: 0 }}
                                    className="overflow-hidden">
                                    <div className="flex flex-col gap-10 items-center justify-center px-10 py-10 ">
                                        <nav className="flex flex-col gap-14 items-center justify-center">
                                            <Link to="/" onClick={() => setIsOpen(false)} className={`text-lg `}>Home</Link>
                                            <Link to="/shop" onClick={() => setIsOpen(false)} className={`text-lg `}>Shop</Link>
                                            <Link to={user ? "/profile" : "/register"} onClick={() => setIsOpen(false)} className={`text-lg `}>Profile</Link>
                                            <Link to="/about" onClick={() => setIsOpen(false)} className={`text-lg `}>About</Link>
                                            <Link to="/customers" onClick={() => setIsOpen(false)} className={`text-lg `}>Customers</Link>
                                            <Link to="/contact" onClick={() => setIsOpen(false)} className={`text-lg `}>Contact Us</Link>
                                            <Link to="/concept" onClick={() => setIsOpen(false)} className={`text-lg `}>Concept</Link>
                                            <Link to="/terms-and-conditions" onClick={() => setIsOpen(false)} className={`text-lg `}>Terms and Conditions</Link>
                                        </nav>
                                        <div className="space-y-4 w-full">

                                            {user ?
                                                <Button variant='danger' className='w-full' onClick={() => setShowLogoutModal(true)}>Log Out</Button> :
                                                <Button variant='primary' className='w-full' onClick={() => navigate('/register')}>Sign Up</Button>
                                            }
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </header>
            <Modal
                isOpen={showLogoutModal}
                title="Confirm Logout"
                message='Are you sure you want to log out?'
                onConfirm={handleLogoutClick}
                onCancel={() => setShowLogoutModal(false)}
                confirmLabel="Yes, Log Out"
                cancelLabel="Cancel"
            />

            <Toaster />
        </>
    )
}

export default Navbar