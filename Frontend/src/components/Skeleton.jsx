import React from 'react';

const Skeleton = ({ className, variant = 'rect' }) => {
    const baseClass = "bg-gray-800 animate-pulse";
    const variantClasses = {
        rect: "rounded-2xl",
        circle: "rounded-full",
        text: "rounded-md h-4 w-full"
    };

    return (
        <div className={`${baseClass} ${variantClasses[variant]} ${className}`}></div>
    );
};

export default Skeleton;
