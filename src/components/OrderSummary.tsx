import { CheckCircle, Home, Store, BadgePercent, Check, IndianRupee, Tag, ChevronRight } from "lucide-react";
import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Button from './Button';
import { Voucher } from '@/types/voucherTypes';
import { useCartStore } from '../store/cartStore';

interface OrderSummaryProps {
    grossTotalPrice: number;
    voucherDiscount: number;
    deliveryPrice: number;
    totalPrice: number;
    appliedVoucher: Voucher | null;
    onApplyVoucher: () => void;
    onRemoveVoucher?: () => void;
    paymentMode: 'online' | 'cod';
    onPaymentModeChange: (mode: 'online' | 'cod') => void;
    onHandlePayment: () => void;
    isLoading: boolean;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
    grossTotalPrice,
    voucherDiscount,
    deliveryPrice,
    totalPrice,
    appliedVoucher,
    onApplyVoucher,
    onRemoveVoucher,
    paymentMode,
    onPaymentModeChange,
    onHandlePayment,
    isLoading
}) => {
    // Slide to Pay state
    const [slidePercent, setSlidePercent] = useState(0);
    const [sliding, setSliding] = useState(false);
    const [slideSuccess, setSlideSuccess] = useState(false);
    const [showCheck, setShowCheck] = useState(false);
    const sliderRef = useRef<HTMLDivElement>(null);
    const handleRef = useRef<HTMLDivElement>(null);
    const isCOD = paymentMode === 'cod';
    const buttonText = isCOD ? 'Pay on Delivery' : 'Slide to Pay | ₹' + totalPrice.toFixed(0);
    const slideText = buttonText;
    const { items } = useCartStore();

    // Handle drag/touch events
    const startSlide = (e: React.MouseEvent | React.TouchEvent) => {
        if (isLoading) return;
        setSliding(true);
        setSlideSuccess(false);
        document.body.style.userSelect = 'none';
    };
    const moveSlide = (e: React.MouseEvent | React.TouchEvent) => {
        if (!sliding) return;
        let clientX = 0;
        if ('touches' in e) {
            clientX = e.touches[0].clientX;
        } else {
            clientX = e.clientX;
        }
        const slider = sliderRef.current;
        const handle = handleRef.current;
        if (slider && handle) {
            const rect = slider.getBoundingClientRect();
            let percent = ((clientX - rect.left - handle.offsetWidth / 2) / (rect.width - handle.offsetWidth)) * 100;
            percent = Math.max(0, Math.min(100, percent));
            setSlidePercent(percent);
        }
    };
    const endSlide = () => {
        setSliding(false);
        document.body.style.userSelect = '';
        if (isLoading) return;
        if (slidePercent > 85) {
            setSlidePercent(100);
            setShowCheck(true);
            setTimeout(() => {
                setSlideSuccess(true);
                setTimeout(() => {
                    setSlidePercent(0);
                    setSlideSuccess(false);
                    setShowCheck(false);
                    if (!isLoading) onHandlePayment();
                }, 900);
            }, 350);
        } else {
            setSlidePercent(0);
            setShowCheck(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-6 sticky top-24"
        >
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">Bill Summary</h2>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    {items.length} items
                </span>
            </div>

            {/* Item List */}
            <div className="space-y-3 mb-6">
                {items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-gray-700">
                        <div className="flex-1">
                            <span className="text-base">{item.productName} x{item.quantity}</span>
                        </div>
                        <span className="text-base font-medium">₹{(item.offerPrice * item.quantity).toFixed(2)}</span>
                    </div>
                ))}
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 my-4"></div>

            {/* Charges Breakdown */}
            <div className="space-y-3 text-gray-600">
                <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-medium">₹{grossTotalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span className="font-medium">₹{deliveryPrice.toFixed(2)}</span>
                </div>
                {voucherDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                        <span>Voucher Discount</span>
                        <span className="font-medium">- ₹{voucherDiscount.toFixed(2)}</span>
                    </div>
                )}
            </div>

            {/* Applied Voucher Card */}
            {appliedVoucher && (
                <div className="flex items-center justify-between bg-white rounded-2xl shadow border border-dashed border-gray-300 px-6 py-4 mb-4 mt-2">
                    <div>
                        <span className="text-lg font-extrabold text-gray-900 tracking-wide">'{appliedVoucher.code}'</span>
                        <div className="text-gray-700 text-base mt-1">Discount applied on the bill</div>
                    </div>
                    <button
                        onClick={() => onRemoveVoucher?.()}
                        className="font-extrabold text-red-600 text-lg px-3 py-1 rounded-lg hover:bg-red-50 transition-all"
                        aria-label="Remove voucher"
                    >
                        REMOVE
                    </button>
                </div>
            )}

            {/* SAVINGS CORNER - Apply Voucher Card */}
            <div className="mt-6">
                <div className="text-xs font-bold tracking-widest text-gray-400 mb-2 ml-1">SAVINGS CORNER</div>
                <button
                        onClick={onApplyVoucher}
                    className="w-full flex items-center justify-between bg-white rounded-2xl shadow-sm px-4 py-3 transition hover:shadow-md active:scale-[0.98]"
                    >
                    <div className="flex items-center gap-3">
                        <span className="bg-orange-500 rounded-full p-2 flex items-center justify-center">
                            <Tag size={20} className="text-white" />
                        </span>
                        <span className="text-base font-semibold text-gray-800">Apply Voucher</span>
                    </div>
                    <ChevronRight size={22} className="text-gray-400" />
                </button>
                </div>

            {/* Total */}
            <div className="border-t border-gray-200 mt-4 pt-4">
                <div className="flex justify-between text-xl font-bold text-gray-900">
                    <span>Total</span>
                    <span>₹{totalPrice.toFixed(2)}</span>
                </div>
            </div>

            {/* Payment Section */}
            <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Payment Mode</h3>
                <div className="flex gap-4 mb-6">
                    <Button
                        variant={paymentMode === 'online' ? 'primary' : 'secondary'}
                        onClick={() => onPaymentModeChange('online')}
                        className='flex-1'
                    >
                        Online
                    </Button>
                    <Button
                        variant={paymentMode === 'cod' ? 'primary' : 'secondary'}
                        onClick={() => onPaymentModeChange('cod')}
                        className='flex-1'
                    >
                        Cash on Delivery
                    </Button>
                </div>

                {/* Slide to Pay Button (always show, text changes by payment mode) */}
                <div
                    ref={sliderRef}
                    className="relative w-full h-14 bg-green-500 rounded-full flex items-center select-none overflow-hidden cursor-pointer"
                    onMouseMove={moveSlide}
                    onMouseUp={endSlide}
                    onMouseLeave={endSlide}
                    onTouchMove={moveSlide}
                    onTouchEnd={endSlide}
                >
                    {/* Slide Track */}
                    <div
                        className="absolute left-0 top-0 h-full bg-green-600 rounded-full transition-all duration-300"
                        style={{ width: `${slidePercent}%`, opacity: slidePercent > 0 ? 0.15 : 0 }}
                    />
                    {/* Slide Text */}
                    <span
                        className={`absolute left-0 right-0 mx-auto text-white font-bold text-lg text-center transition-opacity duration-300 ${slideSuccess || showCheck ? 'opacity-0' : 'opacity-100'}`}
                        style={{ zIndex: 1 }}
                >
                        {slideText}
                    </span>
                    {/* Slide Handle */}
                    <div
                        ref={handleRef}
                        className={`absolute top-1 left-1 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center transition-transform duration-200 active:scale-95${sliding ? ' ring-4 ring-green-300' : ''} ${showCheck ? 'animate-pulse shadow-green-400' : ''} ${isLoading ? ' pointer-events-none opacity-50' : ''}`}
                        style={{ transform: `translateX(${(sliderRef.current ? (slidePercent / 100) * (sliderRef.current.offsetWidth - 56) : 0)}px)` }}
                        onMouseDown={isLoading ? undefined : startSlide}
                        onTouchStart={isLoading ? undefined : startSlide}
                    >
                        <span className="text-green-600 text-2xl transition-all duration-300 flex items-center justify-center">
                            {showCheck || slideSuccess ? (
                                <Check size={32} className="text-green-600 transition-all duration-300" />
                            ) : (
                                <span className="text-green-600 text-2xl font-bold">&gt;&gt;</span>
                            )}
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default OrderSummary;
